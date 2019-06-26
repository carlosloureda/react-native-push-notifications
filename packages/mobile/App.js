import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Permissions, Notifications } from "expo";

const PUSH_REGISTRATION_ENDPOINT = "http://05463050.ngrok.io/token";
// const MESSAGE_ENPOINT = "http://localhost:3000/message";

const App = () => {
  /**
   * Register Token for Push Notifications
   */
  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log("token is:", token);

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: {
          value: token
        },
        user: {
          username: "Carlos"
        }
      })
    });
  };

  handleNotification = notification => {
    setNotification(notification);
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  });

  const [notification, setNotification] = useState(null);
  const [messageText, setMessageText] = useState("");

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
