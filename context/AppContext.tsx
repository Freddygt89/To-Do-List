// context/AppContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { View } from "react-native";

type AppContextType = {
  example: string;
  setExample: (val: string) => void;

  // Tema (modo oscuro)
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (v: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [example, setExample] = useState("Hola desde AppContext");

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Cargar preferencia de tema al iniciar
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("theme");
        if (stored === "dark") setIsDarkMode(true);
        else if (stored === "light") setIsDarkMode(false);
        // si es null, dejamos false (claro) por defecto
      } catch (e) {
        console.warn("No se pudo leer theme de AsyncStorage", e);
      }
    })();
  }, []);

  // Cambiar y persistir el tema
  const toggleTheme = async () => {
    try {
      const next = !isDarkMode;
      setIsDarkMode(next);
      await AsyncStorage.setItem("theme", next ? "dark" : "light");
    } catch (e) {
      console.warn("No se pudo guardar theme en AsyncStorage", e);
      setIsDarkMode((s) => !s);
    }
  };

  const setDarkMode = async (v: boolean) => {
    try {
      setIsDarkMode(v);
      await AsyncStorage.setItem("theme", v ? "dark" : "light");
    } catch (e) {
      console.warn("No se pudo guardar theme en AsyncStorage", e);
    }
  };

  return (
    <AppContext.Provider value={{ example, setExample, isDarkMode, toggleTheme, setDarkMode }}>
      {/* Mantengo el View wrapper para conservar layout previos */}
      <View style={{ flex: 1 }}>{children}</View>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }
  return context;
}
