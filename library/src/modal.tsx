import * as React from "react";
import { Animated, Pressable, useWindowDimensions } from "react-native";

import { StackItem } from "./create-async-stack";

export type ModalProps = {
  type: "modal";
  modalProps?: any;
  element: React.ReactElement<any>;
};

type ModalItemProps = StackItem<ModalProps>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ModalItem({
  status,
  data,
  onPopEnd,
  onPushEnd,
}: ModalItemProps) {
  const animatedValue = React.useRef(new Animated.Value(0));
  const { height } = useWindowDimensions();

  React.useEffect(() => {
    if (status === "pushing") {
      Animated.spring(animatedValue.current, {
        toValue: 1,
        useNativeDriver: true,
      }).start(onPushEnd);
    }

    if (status === "popping") {
      Animated.spring(animatedValue.current, {
        toValue: 0,
        useNativeDriver: true,
      }).start(onPopEnd);
    }
  }, [status]);

  const translateY = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const isPopping = status === "popping" || status === "popped";

  return (
    <Animated.View
      pointerEvents={isPopping ? "none" : "box-none"}
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          transform: [{ translateY }],
          justifyContent: "center",
        },
      ]}
    >
      <AnimatedPressable>{data.element}</AnimatedPressable>
    </Animated.View>
  );
}
