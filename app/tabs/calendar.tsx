import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Config } from "../../constants/Config";

// 📅 Configurar idioma del calendario
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ],
  monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
};
LocaleConfig.defaultLocale = "es";

interface WeatherInfo {
  temp: number;
  description: string;
  icon: string;
}

export default function CalendarScreen() {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherInfo>>({});
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=Medellín&units=metric&appid=${Config.OPENWEATHER_API_KEY}&lang=es`
        );

        const daily: Record<string, WeatherInfo> = {};
        res.data.list.forEach((item: any) => {
          const date = item.dt_txt.split(" ")[0];
          if (!daily[date]) {
            daily[date] = {
              temp: Math.round(item.main.temp),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            };
          }
        });
        setWeatherData(daily);
      } catch (err) {
        console.error("Error al cargar el clima", err);
      }
    };

    fetchWeather();
  }, []);

  const markedDates = Object.keys(weatherData).reduce((acc: any, date) => {
    acc[date] = {
      customStyles: {
        container: { backgroundColor: isDark ? "#2c2c2e" : "#e8e9eb", borderRadius: 6 },
        text: { color: isDark ? "#fff" : "#000" },
      },
    };
    return acc;
  }, {});

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1e1e1f" : "#f5f6fa" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        Pronóstico del clima - Medellín
      </Text>

      <Calendar
        markingType="custom"
        markedDates={markedDates}
        theme={{
          calendarBackground: isDark ? "#1e1e1f" : "#fff",
          monthTextColor: isDark ? "#fff" : "#000",
          dayTextColor: isDark ? "#fff" : "#000",
          textDisabledColor: isDark ? "#666" : "#ccc",
          arrowColor: "#4a90e2",
          todayTextColor: "#4a90e2",
        }}
        renderArrow={(direction) => (
          <Text style={{ color: "#4a90e2" }}>
            {direction === "left" ? "←" : "→"}
          </Text>
        )}
        dayComponent={({ date }) => {
          const data = date ? weatherData[date.dateString] : undefined;
          return (
            <View style={styles.dayContainer}>
              <Text style={[styles.dayText, { color: isDark ? "#fff" : "#000" }]}>{date?.day}</Text>
              {data && (
                <>
                  <Image
                    source={{ uri: `https://openweathermap.org/img/wn/${data.icon}.png` }}
                    style={styles.icon}
                  />
                  <Text style={[styles.tempText, { color: isDark ? "#ccc" : "#333" }]}>{data.temp}°C</Text>
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  dayContainer: { alignItems: "center", justifyContent: "center", height: 60 },
  dayText: { fontSize: 12, fontWeight: "600" },
  tempText: { fontSize: 10, marginTop: -5 },
  icon: { width: 25, height: 25, tintColor: "gray" },
});
