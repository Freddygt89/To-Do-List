// app/+not-found.tsx
import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import ThemedText from "./components/ThemedText";
import ThemedView from "./components/ThemedView";

export default function NotFoundScreen(): React.ReactElement {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>

        <Link href="./" asChild>
          <Text style={styles.link}>Ir al inicio</Text>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  link: { marginTop: 15, paddingVertical: 15, color: "#0a84ff" },
});
