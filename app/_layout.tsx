// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { AppProvider, useAppContext } from "../context/AppContext";

/**
 * Nota: LayoutContent usa useAppContext(), por eso debe renderizarse
 * **dentro** de AppProvider.
 */

function LayoutContent() {
  const { isDarkMode } = useAppContext();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // contentStyle aplica un fondo a todas las pantallas
        contentStyle: { backgroundColor: isDarkMode ? "#0b0b0f" : "#ffffff" },
      }}
    >
      <Stack.Screen name="tabs" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // proveedor global (tema, nombre, etc.)
    <AppProvider>
      <LayoutContent />
    </AppProvider>
  );
}
