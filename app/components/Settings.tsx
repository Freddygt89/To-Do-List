"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

export default function Settings() {
  const { theme, toggleTheme, name, setName } = useAppContext();
  const [tempName, setTempName] = useState(name);

  const handleSave = () => {
    setName(tempName);
  };

  return (
    <div className="p-4 border rounded-md mt-4">
      <h2 className="text-lg font-semibold mb-2">⚙️ Configuración</h2>
      
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Cambiar a {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
      </button>

      <div className="mt-4">
        <label className="block text-sm mb-1">Tu nombre:</label>
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="border px-2 py-1 rounded-md text-black"
        />
        <button
          onClick={handleSave}
          className="ml-2 px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
