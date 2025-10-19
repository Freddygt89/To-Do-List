// app/components/TaskItem.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Task, TaskStatus } from "../../types";
import CategoryIcon from "./CategoryIcon";

type Props = {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onPress?: () => void;
};

function statusSymbol(status: TaskStatus) {
  if (status === "done") return "check-circle";
  if (status === "inprogress") return "hourglass-top";
  return "radio-button-unchecked";
}

export default function TaskItem({ task, onToggleStatus, onDelete, onPress }: Props): React.ReactElement {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <CategoryIcon name={task.category} size={22} />
      </View>

      <View style={styles.middle}>
        <Text style={[styles.title, task.status === "done" ? styles.doneText : undefined]}>
          {task.title}
        </Text>
        <Text style={styles.subtitle}>
          {new Date(task.dateISO).toLocaleDateString()} {task.allDay ? "(Todo el día)" : task.time ?? ""}
        </Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => onToggleStatus(task.id)} style={styles.iconBtn}>
          <MaterialIcons name={statusSymbol(task.status)} size={26} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Eliminar tarea", "¿Eliminar esta tarea?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Eliminar", style: "destructive", onPress: () => onDelete(task.id) },
            ])
          }
          style={styles.iconBtn}
        >
          <MaterialIcons name="delete-outline" size={24} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  left: { width: 36, alignItems: "center" },
  middle: { flex: 1, paddingHorizontal: 8 },
  right: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { fontSize: 12, color: "#666", marginTop: 4 },
  doneText: { textDecorationLine: "line-through", color: "#999" },
  iconBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});
