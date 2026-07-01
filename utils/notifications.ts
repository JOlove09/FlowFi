import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

// ===============================
// REQUEST PERMISSION
// ===============================
export async function requestNotificationPermissions() {

  try {

    // Skip on web
    if (Platform.OS === "web") {

      console.log("Web does not need notification permissions");

      return;
    }

    const { status } =
      await Notifications.requestPermissionsAsync();

    if (status !== "granted") {

      Alert.alert(
        "Permission Required",
        "Enable notifications to receive budget alerts."
      );
    }

  } catch (error) {

    console.log("Permission Error:", error);

  }
}

// ===============================
// SEND ALERT
// ===============================
export async function sendBudgetAlert(
  title: string,
  body: string
) {

  try {

    // WEB
    if (Platform.OS === "web") {

      alert(`${title}\n\n${body}`);

      return;
    }

    // MOBILE
    await Notifications.scheduleNotificationAsync({

      content: {
        title,
        body,
      },

      trigger: null,

    });

  } catch (error) {

    console.log("Notification Error:", error);

    Alert.alert(title, body);

  }
}