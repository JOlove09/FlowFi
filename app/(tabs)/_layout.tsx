import { Tabs } from "expo-router";

import {
  ChartColumn,
  Home,
  Plus,
  Receipt,
  Settings,
} from "lucide-react-native";

import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: "#22C7A9",

        tabBarInactiveTintColor: "#7C8BA1",

        tabBarStyle: styles.tabBar,

        tabBarLabelStyle: styles.label,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused &&
                  styles.activeIconContainer,
              ]}
            >
              <Home color={color} size={22} />
            </View>
          ),
        }}
      />

      {/* EXPENSES */}
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused &&
                  styles.activeIconContainer,
              ]}
            >
              <Receipt color={color} size={22} />
            </View>
          ),
        }}
      />

      {/* ADD */}
      <Tabs.Screen
        name="add"
        options={{
          title: "",

          tabBarIcon: () => (
            <LinearGradient
              colors={[
                "#22C7A9",
                "#1CC8EE",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButton}
            >
              <Plus
                color="#fff"
                size={30}
                strokeWidth={2.5}
              />
            </LinearGradient>
          ),

          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={props.onPress}
              activeOpacity={0.9}
              style={styles.addBtnWrapper}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />

      {/* ANALYTICS */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused &&
                  styles.activeIconContainer,
              ]}
            >
              <ChartColumn
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />

      {/* SETTINGS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused &&
                  styles.activeIconContainer,
              ]}
            >
              <Settings
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />

      {/* HIDDEN AI ASSISTANT */}
      <Tabs.Screen
        name="assistant"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",

    left: 12,
    right: 12,
    bottom: 16,

    height: 72,

    borderRadius: 24,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    paddingTop: 6,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  label: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: "600",
  },

  iconContainer: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",
  },

  activeIconContainer: {
    backgroundColor:
      "rgba(34,199,169,0.18)",
  },

  addBtnWrapper: {
    top: -20,

    justifyContent: "center",
    alignItems: "center",
  },

  addButton: {
    width: 64,
    height: 64,

    borderRadius: 32,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#22C7A9",

    shadowOpacity: 0.35,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 10,
  },
});