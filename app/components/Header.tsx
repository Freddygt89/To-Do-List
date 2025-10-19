// app/components/Header.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../../context/AppContext";

export default function Header({ title }: { title: string }): React.ReactElement {
  const { name } = useAppContext();

  return (
    <View style={styles.header}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.greeting}>
        {name ? `Hola, ${name} 👋` : "Bienvenido 👋"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 12, paddingTop: 18, backgroundColor: "#f7f7f7" },
  h1: { fontSize: 22, fontWeight: "700" },
  greeting: { fontSize: 16, marginTop: 4, color: "#555" },
});
