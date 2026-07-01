import { Stack } from "expo-router";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

import { useColorScheme } from "react-native";

import { ExpenseProvider } from "./context/ExpenseContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <ExpenseProvider>

          <NavigationThemeProvider
            value={
              colorScheme === "dark"
                ? DarkTheme
                : DefaultTheme
            }
          >

            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />

          </NavigationThemeProvider>

        </ExpenseProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}