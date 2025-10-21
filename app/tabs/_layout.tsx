// app/tabs/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useAppContext } from "../../context/AppContext";

/**
 * Layout de las pestañas (Tabs).
 * Usa isDarkMode del AppContext para colorear la tab bar.
 */

export default function TabsLayout(): React.ReactElement {
  const { isDarkMode } = useAppContext();
  const isDark = isDarkMode;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#4a90e2" : "#007aff",
        tabBarStyle: {
          backgroundColor: isDark ? "#111111" : "#fff",
          borderTopColor: isDark ? "#222" : "#e6e6e6",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tareas",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "Nueva tarea",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
