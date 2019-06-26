import Expo from "expo-server-sdk";
let expo = new Expo();
let savedPushTokens = [];

export const saveToken = token => {
  if (savedPushTokens.indexOf(token === -1)) {
    savedPushTokens.push(token);
  }
};

export const sendMessage = () => {
  // TODO: we will see hot to manage push tokens ..
  console.log("sendMessage");
};
