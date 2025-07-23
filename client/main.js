// client/main.js

let token = localStorage.getItem('token');
let username = localStorage.getItem('username');

// --- Authentication Page Logic (for auth.html) ---
if (window.location.pathname.endsWith('auth.html') || window.location.pathname === '/') {
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const regResult = document.getElementById('reg-result');
    const loginResult = document.getElementById('login-result');

    // If on auth page and token exists, redirect to index.html (chat)
    if (token && username) {
        window.location.href = 'index.html';
    }


    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const user = document.getElementById("reg-username").value;
            const pass = document.getElementById("reg-password").value;

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });
                const data = await res.json();
                regResult.innerText = data.message;
                if (res.ok) {
                    alert('✅ Registered! You can now log in.');
                    document.getElementById("reg-username").value = '';
                    document.getElementById("reg-password").value = '';
                } else {
                    alert('❌ ' + data.message);
                }
            } catch (error) {
                regResult.innerText = `Error: ${error.message}`;
                alert(`❌ Error during registration: ${error.message}`);
            }
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const user = document.getElementById("login-username").value;
            const pass = document.getElementById("login-password").value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });

                const data = await res.json();
                loginResult.innerText = data.message;

                if (res.ok && data.token) {
                    token = data.token;
                    username = data.username;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    alert('✅ Logged in successfully! Redirecting to chat...');
                    window.location.href = 'index.html';
                } else {
                    alert('❌ ' + data.message);
                }
            } catch (error) {
                loginResult.innerText = `Error: ${error.message}`;
                alert(`❌ Error during login: ${error.message}`);
            }
        });
    }

}

// --- Chat Page Logic (for index.html) ---
else if (window.location.pathname.endsWith('index.html')) {
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const authStatus = document.getElementById('auth-status');
    const logoutBtn = document.getElementById('logoutBtn');
    const imageInput = document.getElementById('imageInput');
    const typingStatusDiv = document.getElementById('typing-status'); // ✨ NEW: Typing status div ✨

    // If no token is found on the chat page, redirect to the authentication page
    if (!token) {
        alert("Please log in to access the chat.");
        window.location.href = 'auth.html';
    } else {
        authStatus.innerText = `Logged in as ${username}`;

        const socket = io({
            auth: {
                token: token
            }
        });

        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                token = null;
                username = null;
                socket.disconnect();
                alert('Logged out successfully!');
                window.location.href = 'auth.html';
            });
        }

        let typing = false;
        let timeout = undefined;

        // Function to send 'typing' event
        function typingTimeout() {
            typing = false;
            socket.emit('stop typing');
        }

        // ✨ NEW: Typing Event Listeners ✨
        input.addEventListener('keydown', () => {
            if (!typing) {
                typing = true;
                socket.emit('typing');
            }
            clearTimeout(timeout);
            timeout = setTimeout(typingTimeout, 3000); // Stop typing after 3 seconds of inactivity
        });

        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') { // If Enter is pressed, stop typing immediately
                clearTimeout(timeout);
                typingTimeout();
            }
        });


        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const msg = input.value.trim();
            const imageFile = imageInput.files[0];

            if (msg || imageFile) {
                if (!token) {
                    alert("You are not logged in. Please refresh or log in again.");
                    return;
                }

                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        socket.emit('chat message', {
                            type: 'image',
                            data: event.target.result
                        });
                    };
                    reader.readAsDataURL(imageFile);
                    imageInput.value = '';
                } else if (msg) {
                    socket.emit('chat message', {
                        type: 'text',
                        content: msg
                    });
                    input.value = '';
                }
                clearTimeout(timeout); // Clear typing timeout when message is sent
                typingTimeout(); // Explicitly send stop typing event
            }
        });


        socket.on('chat message', function(msg) {
            const item = document.createElement('li');
            if (msg.type === 'text') {
                item.textContent = `${msg.sender}: ${msg.content}`;
            } else if (msg.type === 'image') {
                const img = document.createElement('img');
                img.src = msg.data;
                img.style.maxWidth = '200px';
                img.style.maxHeight = '200px';
                item.innerHTML = `${msg.sender}: `;
                item.appendChild(img);
            }
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });

        // ✨ NEW: Handle Typing Status Updates ✨
        const activeTypingUsers = new Set(); // Keep track of who is typing

        socket.on('user typing', (typingUsername) => {
            if (typingUsername !== username) { // Don't show typing for self
                activeTypingUsers.add(typingUsername);
                updateTypingStatusDisplay();
            }
        });

        socket.on('stop typing', (typingUsername) => {
            activeTypingUsers.delete(typingUsername);
            updateTypingStatusDisplay();
        });

        function updateTypingStatusDisplay() {
            if (activeTypingUsers.size > 0) {
                const users = Array.from(activeTypingUsers).join(', ');
                typingStatusDiv.textContent = `${users} is typing...`;
            } else {
                typingStatusDiv.textContent = '';
            }
        }


        socket.on('connect_error', (err) => {
            console.error("Socket connection error:", err.message);
            authStatus.innerText = `Authentication failed: ${err.message}. Please log in again.`;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            token = null;
            username = null;
            alert(`Authentication failed: ${err.message}. Redirecting to login page.`);
            window.location.href = 'auth.html';
        });
    }
}