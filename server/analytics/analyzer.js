const wordCount = {};

function analyze(message) {
  const words = message.content.split(/\s+/);
  words.forEach(word => {
    const w = word.toLowerCase();
    wordCount[w] = (wordCount[w] || 0) + 1;
  });

  console.log("🔍 Current Word Frequency:", wordCount);
}

module.exports = analyze;