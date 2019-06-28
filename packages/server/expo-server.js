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
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log("ticketChunk: ", ticketChunk);
        // TODO: Handle errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  _retrieveReceipts(tickets);
};

const _retrieveReceipts = tickets => {
  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receipt of receipts) {
          if (receipt.status === "ok") {
            console.log("Receipt status received and ok");
            continue;
          } else if (receipt.status === "error") {
            console.error(
              `There was an error sending a notification: ${receipt.message}`
            );
            if (receipt.details && receipt.details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
              // You must handle the errors appropriately.
              console.error(`The error code is ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
