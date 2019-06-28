import Expo from "expo-server-sdk";
let expo = new Expo();
const savedPushTokens = [];

export const saveToken = token => {
  if (savedPushTokens.indexOf(token === -1)) {
    savedPushTokens.push(token);
  }
};

// type PushMessage = {
//   to : string,
//   data ?: Object,
//   title ?: string,
//   body ?: string,
//   ttl ?: number,
//   expiration?: number,
//   priority ?: 'default' | 'normal' | 'high',
//   subtitle ?: string,
//   sound ?: 'default' | null,
//   badge ?: number,
//   _category ?: string,
//   channelId ?: string
// }

export const sendMessage = message => {
  // Manage array of messages
  let notifications = [];
  for (let pushToken of savedPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    notifications.push({
      to: pushToken,
      sound: "default",
      title: message.title,
      body: message.body,
      data: message // TODO: message or message.data ?
    });
  }
  // Send the messages via chunkPushNotifications and sendPushNotificationsAsync
  let chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
