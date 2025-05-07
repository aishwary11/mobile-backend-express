import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'push-notification-service',
  brokers: ['localhost:9092'],
});

console.log('Kafka client created');
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'notification-group' });

async function initializeKafka() {
  await producer.connect();
  await consumer.connect();
  console.log('Kafka producer and consumer connected');
}

async function publishMessage(topic: string, message: string) {
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
  console.log('Message published');
}
async function consumeMessage(topic: string, callback: (message: any) => void) {
  await consumer.subscribe({ topic, fromBeginning: true });
  console.log(`Consumer subscribed to topic: ${topic}`);
  await consumer.run({
    eachMessage: async ({ message }) => {
      callback(message.value?.toString());
    },
  });
  console.log(`Consumer is processing messages from topic: ${topic}`);
}

export default { initializeKafka, publishMessage, consumeMessage };
