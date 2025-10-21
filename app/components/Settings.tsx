// app/components/Settings.tsx
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../../context/AppContext";

/*
  Settings: pantalla simple para cambiar el tema (toggle) y el nombre del usuario.
  - Usa AppContext para persistir los cambios.
*/

export default function Settings() {
  const { isDarkMode, toggleTheme, name, setName } = useAppContext();
  const [tempName, setTempName] = useState(name);

  const handleSave = () => {
    setName(tempName || "");
    // opcional: feedback / toast
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Configuración</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Modo oscuro</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={{ marginTop: 16, width: "100%" }}>
        <Text style={styles.label}>Tu nombre</Text>
        <View style={styles.nameRow}>
          <TextInput value={tempName} onChangeText={setTempName} placeholder="Tu nombre..." style={styles.input} />
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={{ color: "#fff" }}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, width: "100%" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 16 },
  nameRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 8, borderRadius: 8, marginRight: 8 },
  saveBtn: { backgroundColor: "#0a84ff", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
});
