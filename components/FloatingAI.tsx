import { Bot } from "lucide-react-native";
import {
    StyleSheet,
    TouchableOpacity,
} from "react-native";

type FloatingAIProps = {
  onPress: () => void;
};

export default function FloatingAI({
  onPress,
}: FloatingAIProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Bot
        size={28}
        color="#fff"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    right: 20,

    bottom: 115,

    width: 65,

    height: 65,

    borderRadius: 32.5,

    backgroundColor: "#22C7A9",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#22C7A9",

    shadowOpacity: 0.4,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 10,

    zIndex: 999,
  },
});