import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useContext,
  useState,
} from "react";

import {
  ExpenseContext,
} from "../context/ExpenseContext";

import {
  NotificationContext,
} from "../context/NotificationContext";

export default function SettingsScreen() {

  // =========================
  // EXPENSE CONTEXT
  // =========================

  const expenseContext =
    useContext(ExpenseContext);

  const notificationContext =
    useContext(NotificationContext);

  if (
    !expenseContext ||
    !notificationContext
  )
    return null;

  const {
    budget,
    setBudget,
  } = expenseContext;

  // =========================
  // NOTIFICATION CONTEXT
  // =========================

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

  // =========================
  // LOCAL STATE
  // =========================

  const [input, setInput] =
    useState(
      budget.toString()
    );

  // =========================
  // SAVE BUDGET
  // =========================

  const handleSave = () => {

    const value =
      Number(input);

    if (!isNaN(value)) {

      setBudget(value);
    }
  };

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >

      {/* ========================= */}
      {/* BUDGET SECTION */}
      {/* ========================= */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Monthly Budget
        </Text>

        <TextInput
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          placeholder="Enter budget"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >

          <Text style={styles.buttonText}>
            Save Budget
          </Text>

        </TouchableOpacity>

        <Text style={styles.current}>
          Current Budget:
          ₹{budget.toLocaleString()}
        </Text>

      </View>

      {/* ========================= */}
      {/* NOTIFICATION SETTINGS */}
      {/* ========================= */}

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
            value={
              notificationsEnabled
            }
            onValueChange={
              setNotificationsEnabled
            }
          />

        </View>

        {/* 50 */}

        <View style={styles.settingRow}>

          <Text style={styles.settingText}>
            💡 50% Budget Alert
          </Text>

          <Switch
            value={warning50}
            onValueChange={
              setWarning50
            }
          />

        </View>

        {/* 80 */}

        <View style={styles.settingRow}>

          <Text style={styles.settingText}>
            ⚠️ 80% Budget Alert
          </Text>

          <Switch
            value={warning80}
            onValueChange={
              setWarning80
            }
          />

        </View>

        {/* 100 */}

        <View style={styles.settingRow}>

          <Text style={styles.settingText}>
            🚨 Budget Exceeded Alert
          </Text>

          <Switch
            value={warning100}
            onValueChange={
              setWarning100
            }
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

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 18,
    padding: 16,
    fontSize: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#19C59D",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  current: {
    marginTop: 24,
    fontSize: 18,
    color: "#475569",
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