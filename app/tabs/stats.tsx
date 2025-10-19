// app/tabs/stats.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../../context/AppContext";

export default function StatsScreen() {
  const { isDarkMode } = useAppContext();
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const loadTasks = async () => {
      const stored = await AsyncStorage.getItem("tasks");
      if (stored) {
        const tasks = JSON.parse(stored);
        setCompleted(tasks.filter((t: any) => t.done).length);
        setPending(tasks.filter((t: any) => !t.done).length);
      }
    };
    const focus = setInterval(loadTasks, 1000);
    return () => clearInterval(focus);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#0b0b0f" : "#fff" },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
        Estadísticas
      </Text>

      <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
        ✅ Completadas: {completed}
      </Text>
      <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
        ⏳ Pendientes: {pending}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
});
