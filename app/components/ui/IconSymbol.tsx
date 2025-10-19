import { Ionicons } from "@expo/vector-icons";
import React from "react";

type IconSymbolProps = {
  name: string;
  size?: number;
  color?: string;
};

const IconSymbol: React.FC<IconSymbolProps> = ({ name, size = 24, color = "black" }) => {
  return <Ionicons name={name as any} size={size} color={color} />;
};

export default IconSymbol;
