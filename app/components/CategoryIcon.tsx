// app/components/CategoryIcon.tsx
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

type Props = { name: string; size?: number };

export default function CategoryIcon({ name, size = 20 }: Props) {
  switch (name) {
    case "home":
      return <MaterialCommunityIcons name="home-outline" size={size} />;
    case "shopping":
      return <FontAwesome5 name="shopping-bag" size={size} />;
    case "work":
      return <MaterialCommunityIcons name="briefcase-outline" size={size} />;
    case "study":
      return <MaterialCommunityIcons name="book-outline" size={size} />;
    case "health":
      return <MaterialCommunityIcons name="heart-outline" size={size} />;
    default:
      return <MaterialCommunityIcons name="note-outline" size={size} />;
  }
}
