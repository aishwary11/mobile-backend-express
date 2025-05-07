import { Expo } from 'expo-server-sdk';
import kafka from './kafka';

const expo = new Expo();

const sendPushNotification = async (pushMessage: string) => {
  await kafka.consumeMessage('push-notification', async message => {
    const { token } = message;
    const chunks = expo.chunkPushNotifications([{ to: token, sound: 'default', body: pushMessage, title: 'Demo-push-notification' }]);
    for await (const chunk of chunks) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.forEach(ticket => {
        if (ticket.status !== 'ok') {
          console.error(`Error sending notification: ${ticket}`);
        }
      });
    }
    console.log('Push notification sent successfully');
  });
};

export default { sendPushNotification };
