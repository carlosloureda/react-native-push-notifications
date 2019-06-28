import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, AppState, Alert } from "react-native";
import { Permissions, Notifications } from "expo";

const PUSH_REGISTRATION_ENDPOINT = "http://9a6d8012.ngrok.io/token";

const App = () => {
  /**
   * manage App State for checking if app is active and foreground
   */
  let appState = "active";

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return function() {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  handleAppStateChange = nextAppState => (appState = nextAppState);

  handleNotification = notification => {
    if (appState === "active" && notification.origin === "received") {
      Notifications.dismissNotificationAsync(notification.notificationId);
      Alert.alert(notification.data.title, notification.data.body);
      setNotification(null);
    } else {
      setNotification(notification);
    }
  };

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

    //  setup an event listener to listen to any notifications that occur
    // while the app is open and foregrounded
    Notifications.addListener(handleNotification);

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        crossOrigin: false
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

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const [notification, setNotification] = useState(null);
  const [messageText, setMessageText] = useState("");

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {notification && (
          <>
            <Text>Origin: {notification.origin}</Text>
            <Text>Title: {notification.data.title}</Text>
            <Text>Message: {notification.data.body}</Text>
            <Text>Data: {JSON.stringify(notification.data)}</Text>
          </>
        )}
        {!notification && (
          <Text>Here will appear notification if some appear</Text>
        )}
      </View>
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
