# 📝 To-Do-List App

Aplicación móvil desarrollada en **React Native con Expo** para la gestión de tareas diarias.  
Incluye persistencia local, calendario con clima, vista de estadísticas y modo oscuro.

---

## 🚀 Tecnologías y framework

- **Framework:** React Native con Expo  
- **Lenguaje:** TypeScript  
- **Gestión de estado:** Context API  
- **Persistencia local:** AsyncStorage  
- **Clima:** API de OpenWeatherMap  
- **Navegación:** `expo-router` con tabs inferiores  

Se eligió **React Native** porque permite desarrollar una **aplicación nativa**, no web ni PWA, cumpliendo con los requisitos académicos.

---

## 📲 Funcionalidades principales

- Agregar, editar y eliminar tareas.  
- Marcar tareas como completadas o pendientes.  
- Vista de calendario mensual con clima y temperatura diaria.  
- Estadísticas automáticas de tareas.  
- Modo oscuro/claro con persistencia local del tema.

---

## 💾 Persistencia

La aplicación almacena los datos localmente mediante `AsyncStorage`, garantizando que las tareas se conserven al cerrar la app.

---

## 🧩 Estructura del proyecto

app/
├── tabs/
│ ├── tasks.tsx # Lista de tareas
│ ├── new.tsx # Nueva tarea
│ ├── calendar.tsx # Calendario con clima
│ └── statsScreen.tsx # Estadísticas
├── context/
│ └── AppContext.tsx # Contexto global y modo oscuro
├── services/
│ └── storage.ts # Persistencia local
└── constants/
└── Config.ts # API key de OpenWeather


---

## 🧠 Decisiones de diseño (UI/UX)

- Se optó por una **navegación por pestañas** para una experiencia rápida e intuitiva.  
- Colores neutros y tipografía clara para mejorar legibilidad.  
- Modo oscuro persistente para comodidad visual.  
- Íconos representativos para cada pantalla.

---

## ⚙️ Cómo ejecutar el proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Freddygt89/To-Do-List.git

## Instala dependencias: 
   npm install

## Ejecuta en Expo: 
   npx expo start