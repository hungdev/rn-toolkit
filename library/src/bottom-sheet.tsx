import * as React from "react";
import { Animated, Pressable } from "react-native";
import BottomSheet, { BottomSheetProps as BSP } from "@gorhom/bottom-sheet";

import { StackItem } from "./create-async-stack";

export type BottomSheetProps = {
  type: "bottom-sheet";
  element: React.ReactElement<any>;
  bottomSheetProps: Omit<BSP, "children">;
};

type BottomSheetItemProps = StackItem<BottomSheetProps>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BottomSheetItem({
  data,
  status,
  onPopEnd,
  onPushEnd,
}: BottomSheetItemProps) {
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const { bottomSheetProps } = data;

  React.useEffect(() => {
    if (status === "pushing") {
      bottomSheetRef.current?.expand();
      onPushEnd();
    }

    if (status === "popping") {
      bottomSheetRef.current?.close();
    }
  }, [status]);

  const onChange = React.useCallback((index: number) => {
    if (index === -1) {
      onPopEnd();
    }
  }, []);

  return (
    <BottomSheet
      enablePanDownToClose
      {...bottomSheetProps}
      ref={bottomSheetRef}
      onChange={onChange}
    >
      <AnimatedPressable style={{ flex: 1 }}>{data.element}</AnimatedPressable>
    </BottomSheet>
  );
}
