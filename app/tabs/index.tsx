// app/tabs/index.tsx
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../../context/AppContext";
import { loadTasks, saveTasks } from "../../services/storage";
import { Task } from "../../types";
import Header from "../components/Header";
import TaskItem from "../components/TaskItem";

/**
 * Pantalla de "Mis Tareas"
 * - Muestra la lista (persistida en AsyncStorage via services/storage)
 * - Contiene el switch que controla el tema global (AppContext)
 * - Al crear/editar/guardar tareas llamamos a saveTasks para persistir
 */

export default function TasksScreen(): React.ReactElement {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { isDarkMode, toggleTheme } = useAppContext();

  const read = useCallback(async () => {
    const loaded = await loadTasks();
    setTasks(loaded.sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()));
  }, []);

  useEffect(() => {
    // persiste automáticamente cuando cambia la lista
    saveTasks(tasks);
  }, [tasks]);

  useFocusEffect(
    useCallback(() => {
      read();
    }, [read])
  );

  function toggleStatus(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = t.status === "pending" ? "inprogress" : t.status === "inprogress" ? "done" : "pending";
        return { ...t, status: next };
      })
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const isDark = isDarkMode;
  const backgroundStyle = { backgroundColor: isDark ? "#0b0b0f" : "#f7f7f7", flex: 1 };
  const textColor = isDark ? "#fff" : "#111";

  return (
    <View style={backgroundStyle}>
      <Header title="Mis Tareas" />
      {/* barra superior con el switch global */}
      <View style={[styles.topRow, { backgroundColor: isDark ? "#0b0b0f" : "#fff" }]}>
        <Text style={[styles.themeLabel, { color: textColor }]}>Modo oscuro</Text>
        <Switch value={isDark} onValueChange={() => toggleTheme()} />
      </View>

      <View style={styles.container}>
        <FlatList
          data={tasks}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onDelete={deleteTask}
              onToggleStatus={toggleStatus}
              onPress={() => router.push({ pathname: "/tabs/new", params: { editId: item.id } })}
            />
          )}
          ListEmptyComponent={() => <Text style={{ textAlign: "center", marginTop: 20, color: textColor }}>No hay tareas. Presiona + para agregar.</Text>}
        />

        <TouchableOpacity style={styles.fab} onPress={() => router.push("/tabs/new")}>
          <AntDesign name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  themeLabel: { fontWeight: "700" },
  container: { flex: 1 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0a84ff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
