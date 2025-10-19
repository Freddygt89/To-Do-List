// app/components/ThemedText.tsx
import React from "react";
import { Text, TextProps } from "react-native";

export default function ThemedText(props: TextProps & { type?: string }) {
  return <Text {...props} />;
}
