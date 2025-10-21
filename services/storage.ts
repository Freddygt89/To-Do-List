// app/services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types";

/**
 * Service simple para persistir tareas en AsyncStorage.
 * - KEY: "@tasks_v1"
 * - saveTasks / loadTasks
 */

const TASKS_KEY = "@tasks_v1";

export async function saveTasks(tasks: Task[]) {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks ?? []));
  } catch (e) {
    console.error("Error saving tasks", e);
  }
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch (e) {
    console.error("Error loading tasks", e);
    return [];
  }
}
