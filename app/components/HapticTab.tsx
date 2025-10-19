// app/components/HapticTab.tsx
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import React, { forwardRef } from "react";
import { Platform } from "react-native";

const HapticTab = forwardRef<any, BottomTabBarButtonProps>((props, ref) => {
  const { onPressIn, children, ...rest } = props;
  return (
    <PlatformPressable
      {...(rest as any)}
      ref={ref as any}
      onPressIn={(ev: any) => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPressIn?.(ev);
      }}
    >
      {children as any}
    </PlatformPressable>
  );
});

HapticTab.displayName = "HapticTab";
export default HapticTab;
