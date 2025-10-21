// app/context/AppContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { View } from "react-native";

/**
 * Contexto global de la app.
 * - isDarkMode: controla el tema (claro/oscuro) de la aplicación.
 * - toggleTheme / setDarkMode: funciones para cambiar el tema.
 * - name / setName: nombre para saludo (persistente).
 *
 * Persistencia: AsyncStorage (keys: "@theme_pref", "@user_name")
 */

type AppContextType = {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  setDarkMode: (v: boolean) => Promise<void>;

  name: string;
  setName: (v: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_KEY = "@theme_pref";
const NAME_KEY = "@user_name";

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [name, setNameState] = useState<string>("");

  // cargar preferencias al inicio
  useEffect(() => {
    (async () => {
      try {
        const th = await AsyncStorage.getItem(THEME_KEY);
        setIsDarkMode(th === "dark");

        const nm = await AsyncStorage.getItem(NAME_KEY);
        if (nm) setNameState(nm);
      } catch (e) {
        console.warn("AppProvider: error leyendo AsyncStorage", e);
      }
    })();
  }, []);

  // toggle y persistencia
  const toggleTheme = async () => {
    try {
      const next = !isDarkMode;
      setIsDarkMode(next);
      await AsyncStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch (e) {
      console.warn("toggleTheme error", e);
      setIsDarkMode((s) => !s);
    }
  };

  const setDarkMode = async (v: boolean) => {
    try {
      setIsDarkMode(v);
      await AsyncStorage.setItem(THEME_KEY, v ? "dark" : "light");
    } catch (e) {
      console.warn("setDarkMode error", e);
    }
  };

  const setName = async (v: string) => {
    try {
      setNameState(v);
      await AsyncStorage.setItem(NAME_KEY, v);
    } catch (e) {
      console.warn("setName error", e);
    }
  };

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, setDarkMode, name, setName }}>
      {/* Mantengo View wrapper por compatibilidad con tu layout actual */}
      <View style={{ flex: 1 }}>{children}</View>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de AppProvider");
  return ctx;
}
