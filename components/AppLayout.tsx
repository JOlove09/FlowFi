import { View } from "react-native";
import RightSidebar from "./RightSidebar";

export default function AppLayout({
  children,
}: any) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingRight: 120,
        }}
      >
        {children}
      </View>

      <RightSidebar />
    </View>
  );
}