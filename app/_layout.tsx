// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { AppProvider, useAppContext } from "../context/AppContext";

/**
 * Nota: LayoutContent usa el hook `useAppContext()` y por eso debe
 * estar definido dentro del árbol de AppProvider.
 */
function LayoutContent() {
  const { isDarkMode } = useAppContext();

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDarkMode ? "#0b0b0f" : "#ffffff" },
        }}
      >
        <Stack.Screen name="tabs" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <LayoutContent />
    </AppProvider>
  );
}
