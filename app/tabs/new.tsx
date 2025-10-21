// app/tabs/new.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../../context/AppContext";
import { loadTasks, saveTasks } from "../../services/storage";
import { Task } from "../../types";
import Header from "../components/Header";

/**
 * Pantalla de creación/edición de tarea.
 * - Si se abre con editId: carga la tarea para edición.
 * - Usa isDarkMode del AppContext para ajustar colores.
 */

const categories = [
  { key: "home", label: "Casa" },
  { key: "work", label: "Trabajo" },
  { key: "shopping", label: "Compras" },
  { key: "study", label: "Estudio" },
  { key: "health", label: "Salud" },
  { key: "other", label: "Otro" },
];

export default function NewTaskScreen(): React.ReactElement {
  const params = useLocalSearchParams() as { dateISO?: string; editId?: string } | undefined;
  const router = useRouter();
  const dateISOParam = params?.dateISO;
  const editId = params?.editId;
  const { isDarkMode } = useAppContext();
  const isDark = isDarkMode;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("other");
  const [allDay, setAllDay] = useState(true);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState<Date>(dateISOParam ? new Date(dateISOParam) : new Date());
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      if (!editId) {
        setTitle("");
        setCategory("other");
        setAllDay(true);
        setTime(null);
        setNotes("");
        setDate(dateISOParam ? new Date(dateISOParam) : new Date());
      }
      return () => {};
    }, [editId, dateISOParam])
  );

  useEffect(() => {
    if (dateISOParam) setDate(new Date(dateISOParam));
  }, [dateISOParam]);

  useEffect(() => {
    (async () => {
      const loaded = await loadTasks();
      setTasks(loaded);
      if (editId) {
        const t = loaded.find((x) => x.id === String(editId));
        if (t) {
          setTitle(t.title);
          setCategory(t.category);
          setAllDay(!!t.allDay);
          setNotes((t as any).notes ?? "");
          if (t.time) {
            const [hh, mm] = String(t.time).split(":");
            const dt = new Date(t.dateISO);
            dt.setHours(Number(hh ?? 0), Number(mm ?? 0));
            setTime(dt);
          } else {
            setTime(null);
          }
          setDate(new Date(t.dateISO));
        }
      }
    })();
  }, [editId]);

  async function onSave() {
    if (!title.trim()) {
      alert("Escribe un título");
      return;
    }

    const timeString = allDay ? null : time ? `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}` : null;

    if (editId) {
      const updated = tasks.map((t) =>
        t.id === String(editId) ? { ...t, title, category, allDay, time: timeString, dateISO: date.toISOString(), ...(notes ? { notes } : {}) } : t
      );
      setTasks(updated);
      await saveTasks(updated);
      router.back();
      return;
    }

    const newTask: Task & { notes?: string } = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      dateISO: date.toISOString(),
      time: timeString,
      allDay,
      status: "pending",
      ...(notes ? { notes } : {}),
    };

    const next = [...tasks, newTask].sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
    setTasks(next);
    await saveTasks(next);

    setTitle("");
    setCategory("other");
    setAllDay(true);
    setTime(null);
    setNotes("");
    setDate(new Date());

    router.back();
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1e1e1f" : "#f5f6fa" }]}>
      <Header title={editId ? "Editar Tarea" : "Nueva tarea"} />
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Fecha</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { backgroundColor: isDark ? "#2c2c2e" : "#fff", borderColor: isDark ? "#444" : "#ddd" }]}>
          <Text style={{ color: isDark ? "#fff" : "#000" }}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Título</Text>
        <TextInput style={[styles.input, { backgroundColor: isDark ? "#2c2c2e" : "#fff", color: isDark ? "#fff" : "#000", borderColor: isDark ? "#444" : "#ddd" }]} placeholder="Título..." placeholderTextColor={isDark ? "#888" : "#aaa"} value={title} onChangeText={setTitle} />

        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Categoría</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
          {categories.map((c) => (
            <TouchableOpacity key={c.key} onPress={() => setCategory(c.key)} style={[styles.catBtn, category === c.key && { backgroundColor: isDark ? "#007aff" : "#e6f0ff", borderColor: isDark ? "#007aff" : "#9ec5ff" }, { borderColor: isDark ? "#555" : "#ddd" }]}>
              <Text style={{ color: isDark ? "#fff" : "#000" }}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Notas (opcional)</Text>
        <TextInput value={notes} onChangeText={setNotes} style={[styles.input, { height: 100, backgroundColor: isDark ? "#2c2c2e" : "#fff", color: isDark ? "#fff" : "#000", borderColor: isDark ? "#444" : "#ddd" }]} multiline placeholder="Detalles, observaciones..." placeholderTextColor={isDark ? "#888" : "#aaa"} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 8 }}>
          <Text style={{ color: isDark ? "#fff" : "#000" }}>Todo el día</Text>
          <Switch value={allDay} onValueChange={setAllDay} />
        </View>

        {!allDay && (
          <>
            <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Hora</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[styles.input, { backgroundColor: isDark ? "#2c2c2e" : "#fff", borderColor: isDark ? "#444" : "#ddd" }]}>
              <Text style={{ color: isDark ? "#fff" : "#000" }}>{time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Seleccionar hora"}</Text>
            </TouchableOpacity>
          </>
        )}

        {showDatePicker && <DateTimePicker value={date} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={(e, sel) => { setShowDatePicker(false); if (sel) setDate(sel); }} />}
        {showTimePicker && <DateTimePicker value={time ?? new Date()} mode="time" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={(e, sel) => { setShowTimePicker(false); if (sel) setTime(sel); }} />}

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: isDark ? "#007aff" : "#0a84ff" }]} onPress={onSave}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>{editId ? "Guardar cambios" : "Crear tarea"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontWeight: "700", marginTop: 12 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginTop: 6 },
  catBtn: { padding: 8, borderWidth: 1, borderRadius: 8, marginRight: 8, marginTop: 8 },
  saveBtn: { marginTop: 18, padding: 14, borderRadius: 10, alignItems: "center" },
});
