// kafka/consumer.js
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Message = require('../models/Message'); // Import the Message model

// Kafka config
const kafka = new Kafka({
  clientId: 'chat-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'chat-group' });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value.toString();
      console.log('Kafka Received Message:', value); // ✅ Step 1

      try {
        const parsed = JSON.parse(value);
        console.log('Parsed Message:', parsed); // ✅ Step 2

        // Create new Message instance based on parsed data
        const savedMsg = new Message({
          sender: parsed.sender,
          type: parsed.type, // Store message type
          timestamp: new Date(parsed.timestamp), // Ensure timestamp is a Date object
        });

        // Conditionally assign content or data based on type
        if (parsed.type === 'text') {
            savedMsg.content = parsed.content;
        } else if (parsed.type === 'image') {
            savedMsg.data = parsed.data;
        }

        await savedMsg.save(); // ✅ Step 3
        console.log('Saved to MongoDB:', savedMsg); // ✅ Step 4
      } catch (err) {
        console.error('❌ Error parsing/saving message:', err.message); // ✅ Step 5
      }
    },
  });
}

module.exports = { runConsumer };
runConsumer().catch(console.error);