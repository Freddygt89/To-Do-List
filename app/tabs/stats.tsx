// app/tabs/stats.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../../context/AppContext";

/**
 * Pantalla de estadísticas.
 * - Botón "Actualizar" lee las tareas guardadas y calcula completadas / pendientes.
 * - Usa isDarkMode del contexto global para tema.
 */

export default function StatsScreen(): React.ReactElement {
  const { isDarkMode } = useAppContext();
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);

  const loadStats = async () => {
    try {
      const raw = await AsyncStorage.getItem("@tasks_v1");
      if (!raw) {
        setCompleted(0);
        setPending(0);
        return;
      }
      const tasks = JSON.parse(raw) as any[];
      const c = tasks.filter((t) => t.status === "done").length;
      const p = tasks.filter((t) => t.status !== "done").length;
      setCompleted(c);
      setPending(p);
    } catch (e) {
      console.error("StatsScreen: error leyendo tareas", e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#0b0b0f" : "#fff" }]}>
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>📊 Estadísticas</Text>

      <View style={styles.statsBox}>
        <Text style={[styles.statText, { color: isDarkMode ? "#fff" : "#000" }]}>✅ Completadas: {completed}</Text>
        <Text style={[styles.statText, { color: isDarkMode ? "#fff" : "#000" }]}>⏳ Pendientes: {pending}</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? "#3b82f6" : "#007AFF" }]} onPress={loadStats}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  statsBox: { alignItems: "center", marginBottom: 25 },
  statText: { fontSize: 18, marginVertical: 4 },
  button: { paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
