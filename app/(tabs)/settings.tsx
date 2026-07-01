import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { useContext } from "react";

import {
  NotificationContext,
} from "../context/NotificationContext";

export default function SettingsScreen() {

  const notificationContext =
    useContext(NotificationContext);

  if (!notificationContext)
    return null;

  const {

    notificationsEnabled,

    warning50,

    warning80,

    warning100,

    setNotificationsEnabled,

    setWarning50,

    setWarning80,

    setWarning100,

  } = notificationContext;

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Notification Settings
        </Text>

        {/* MASTER */}

        <View style={styles.settingRow}>

          <Text style={styles.settingText}>
            🔔 Enable Notifications
          </Text>

          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />

        </View>

        {/* 50% */}

        <View style={styles.settingRow}>

          <Text style={styles.settingText}>
            💡 50% Budget Alert
          </Text>

          <Switch
            value={warning50}
            onValueChange={setWarning50}
          />

        </View>

        {/* 80% */}

        <View style={styles.settingRow}>

          <Text style={styles.settingText}>
            ⚠️ 80% Budget Alert
          </Text>

          <Switch
            value={warning80}
            onValueChange={setWarning80}
          />

        </View>

        {/* 100% */}

        <View style={styles.settingRow}>

          <Text style={styles.settingText}>
            🚨 Budget Exceeded Alert
          </Text>

          <Switch
            value={warning100}
            onValueChange={setWarning100}
          />

        </View>

      </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 6,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  settingText: {
    fontSize: 18,
    color: "#111827",
    flex: 1,
    marginRight: 10,
  },

});