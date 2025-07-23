const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function sendMessageToKafka(message) {
  await producer.connect();
  await producer.send({
    topic: 'chat-messages',
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
}

module.exports = { sendMessageToKafka };