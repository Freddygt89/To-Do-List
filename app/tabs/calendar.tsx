// app/tabs/calendar.tsx
/**
 * Calendario + clima (Medellín) — VERSIÓN CORREGIDA
 *
 * - Muestra icono y temperatura (hasta 5 días) usando OpenWeather forecast.
 * - Al tocar un día navega a /tabs/new con `dateISO=YYYY-MM-DDT12:00:00`
 * - Usa isDarkMode desde AppContext para colores.
 *
 * Importante: no forzamos fondos blancos en cada celda para evitar
 * el efecto "dalmata". Dejar que el componente Calendar pinte las celdas
 * y solo aplicamos colores seguros para texto/fondo según tema.
 */

import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import * as ConfigModule from "../../constants/Config"; // import seguro (default o named)
import { useAppContext } from "../../context/AppContext";

/* ---------------------------
   Localización (español)
--------------------------- */
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ],
  monthNamesShort: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
  dayNames: ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
  dayNamesShort: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
};
LocaleConfig.defaultLocale = "es";

interface WeatherInfo {
  temp: number;
  description: string;
  icon: string;
}

/* ---------------------------
   Extrae una entrada por día del forecast (limita a 5 días)
--------------------------- */
function pickDailyFromForecast(list: any[]): Record<string, WeatherInfo> {
  const daily: Record<string, WeatherInfo> = {};
  for (const item of list || []) {
    const date = String(item.dt_txt || "").split(" ")[0];
    if (!date) continue;
    if (!daily[date]) {
      daily[date] = {
        temp: Math.round(item.main?.temp ?? 0),
        description: item.weather?.[0]?.description ?? "",
        icon: item.weather?.[0]?.icon ?? "01d",
      };
    }
  }
  const keys = Object.keys(daily).slice(0, 5);
  const out: Record<string, WeatherInfo> = {};
  keys.forEach((k) => (out[k] = daily[k]));
  return out;
}

/* ---------------------------
   Obtener API key de OpenWeather (seguro)
--------------------------- */
function getOpenWeatherKey(): string | null {
  const mod: any = ConfigModule as any;
  if (mod.OPENWEATHER_API_KEY) return mod.OPENWEATHER_API_KEY;
  if (mod.Config?.OPENWEATHER_API_KEY) return mod.Config.OPENWEATHER_API_KEY;
  if (mod.default?.OPENWEATHER_API_KEY) return mod.default.OPENWEATHER_API_KEY;
  return null;
}

/* ---------------------------
   Componente principal
--------------------------- */
export default function CalendarScreen(): React.ReactElement {
  const { isDarkMode } = useAppContext();
  const isDark = !!isDarkMode;
  const router = useRouter();

  const [weatherData, setWeatherData] = useState<Record<string, WeatherInfo>>({});

  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      try {
        const key = getOpenWeatherKey();
        if (!key) {
          console.warn("OPENWEATHER_API_KEY no encontrada en constants/Config.");
          return;
        }

        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=Medellin,CO&units=metric&appid=${key}&lang=es`
        );
        const list = res.data?.list || [];
        const daily = pickDailyFromForecast(list);
        if (mounted) setWeatherData(daily);
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    fetchWeather();
    return () => { mounted = false; };
  }, []);

  /* marcado: damos un fondo SUTIL sólo para días con datos */
  const markedDates = Object.keys(weatherData).reduce((acc: Record<string, any>, date) => {
    acc[date] = {
      customStyles: {
        container: {
          backgroundColor: isDark ? "#222426" : "#eaf4ff", // sutil, no agresivo
          borderRadius: 6,
          paddingTop: 2,
          paddingBottom: 2,
        },
        text: {
          color: isDark ? "#ffffff" : "#000000",
          fontWeight: "600",
        },
      },
    };
    return acc;
  }, {});

  /* Navegar a nueva tarea con fecha a las 12:00 para evitar -1 por zona horaria */
  function handleDayPress(day?: { dateString?: string }) {
    if (!day?.dateString) return;
    const iso = `${day.dateString}T12:00:00`;
    router.push({ pathname: "/tabs/new", params: { dateISO: iso } });
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#ffffff" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Pronóstico del clima - Medellín</Text>

      <Calendar
        onDayPress={handleDayPress}                // uso del evento nativo del calendario
        markingType="custom"
        markedDates={markedDates}
        theme={{
          // aseguro colores legibles para ambos temas (no forzar fondos en celdas)
          calendarBackground: isDark ? "#121212" : "#ffffff",
          backgroundColor: isDark ? "#121212" : "#ffffff",
          monthTextColor: isDark ? "#ffffff" : "#111111",
          dayTextColor: isDark ? "#ffffff" : "#111111",
          textDisabledColor: isDark ? "#666666" : "#cfcfcf",
          arrowColor: isDark ? "#90caf9" : "#1976d2",
          todayTextColor: isDark ? "#64b5f6" : "#0a84ff",
          textSectionTitleColor: isDark ? "#cfcfcf" : "#444444",
          selectedDayBackgroundColor: isDark ? "#1976d2" : "#cde5ff",
          selectedDayTextColor: "#000000",
          textDayFontWeight: "600",
          textMonthFontWeight: "bold",
          textDayFontSize: 14,
        }}
        renderArrow={(direction) => (
          <Text style={{ color: isDark ? "#90caf9" : "#1976d2" }}>{direction === "left" ? "←" : "→"}</Text>
        )}
        dayComponent={({ date }) => {
          // date puede ser undefined en algunos renders
          if (!date) return <View style={styles.dayEmpty} />;

          const data = weatherData[date.dateString];

          /* NOTA IMPORTANTE:
             - No forzamos un background en cada celda: eso generaba el efecto parcheado.
             - Permitimos que Calendar dibuje las celdas; aquí sólo pintamos número + icono.
          */
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleDayPress(date)}
              style={styles.dayTouchWrapper}
            >
              <Text style={[styles.dayNumber, { color: isDark ? "#ffffff" : "#000000" }]}>
                {String(date.day)}
              </Text>

              {data && (
                <>
                  <Image
                    source={{ uri: `https://openweathermap.org/img/wn/${data.icon}.png` }}
                    style={[styles.icon, { tintColor: isDark ? "#ddd" : "#666" }]}
                  />
                  <Text style={[styles.tempText, { color: isDark ? "#ccc" : "#333" }]}>{data.temp}°</Text>
                </>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

/* ---------------------------
   Estilos
--------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  dayTouchWrapper: { height: 64, alignItems: "center", justifyContent: "center", paddingVertical: 2 },
  dayNumber: { fontSize: 12, fontWeight: "600" },
  tempText: { fontSize: 10, marginTop: 2 },
  icon: { width: 20, height: 20, marginTop: 2 },
  dayEmpty: { height: 64 },
});
