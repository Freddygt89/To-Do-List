import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabBarBackground(): React.ReactElement {
  return <View style={styles.bg} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
});
