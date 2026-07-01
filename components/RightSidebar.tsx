import { router, usePathname } from "expo-router";

import {
    Bot,
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

export default function RightSidebar() {
  const pathname = usePathname();

  const Item = ({
    icon,
    route,
  }: any) => (
    <TouchableOpacity
      style={[
        styles.iconBtn,
        pathname === route &&
          styles.active,
      ]}
      onPress={() => router.push(route)}
    >
      {icon}
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.sidebar}>
        <Item
          route="/"
          icon={
            <Home
              size={24}
              color="#22C7A9"
            />
          }
        />

        <Item
          route="/expenses"
          icon={
            <Receipt
              size={24}
              color="#64748B"
            />
          }
        />

        <Item
          route="/analytics"
          icon={
            <ChartColumn
              size={24}
              color="#64748B"
            />
          }
        />

        <Item
          route="/settings"
          icon={
            <Settings
              size={24}
              color="#64748B"
            />
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push("/add")
          }
        >
          <Plus
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.chatbot}
        onPress={() =>
          router.push("/assistant")
        }
      >
        <Bot
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",

    right: 20,

    top: 80,

    width: 90,

    backgroundColor: "#FFFFFF",

    borderRadius: 30,

    paddingVertical: 25,

    alignItems: "center",

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 20,

    elevation: 10,
  },

  iconBtn: {
    width: 55,

    height: 55,

    borderRadius: 18,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 18,
  },

  active: {
    backgroundColor:
      "rgba(34,199,169,0.15)",
  },

  addButton: {
    marginTop: 10,

    width: 65,

    height: 65,

    borderRadius: 32,

    backgroundColor: "#22C7A9",

    justifyContent: "center",

    alignItems: "center",
  },

  chatbot: {
    position: "absolute",

    right: 32,

    bottom: 40,

    width: 65,

    height: 65,

    borderRadius: 33,

    backgroundColor: "#22C7A9",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#22C7A9",

    shadowOpacity: 0.4,

    shadowRadius: 15,

    elevation: 12,
  },
});