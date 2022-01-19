import * as React from "react";
import { Animated, View, Pressable, StyleSheet } from "react-native";

import { BottomSheetItem, BottomSheetProps } from "./bottom-sheet";
import { createAsyncStack, StackItem } from "./create-async-stack";
import { ModalItem, ModalProps } from "./modal";
import { createScreenStack } from "./screen";
import { useStackItems } from "./use-stack-items";

// TODO - pop by key, update element to be a function w/ pop() callback, generic store for updating screens / items?

type UIServicesProps = {
  children: React.ReactNode;
};

type Item = ModalProps | BottomSheetProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function create() {
  const { ScreenContainer, Screens } = createScreenStack();

  const UI = createAsyncStack<Item>();

  function onDismissed() {
    UI.pop();
  }

  function ToolkitProvider({ children }: UIServicesProps) {
    const animatedValue = React.useRef(new Animated.Value(0));

    const items = useStackItems(UI);

    const hasItem = items.some(
      (item) => item.status !== "popped" && item.status !== "popping"
    );

    React.useEffect(() => {
      Animated.spring(animatedValue.current, {
        toValue: hasItem ? 1 : 0,
        useNativeDriver: false,
      }).start();
    }, [hasItem]);

    const backgroundColor = animatedValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(0,0,0,0.0)", "rgba(0,0,0,0.5)"],
    });

    return (
      <ScreenContainer>
        {children}
        <AnimatedPressable
          onPress={onDismissed}
          pointerEvents={hasItem ? "auto" : "none"}
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor },
          ]}
        >
          {items.map((item) => renderStackItem(item))}
        </AnimatedPressable>
      </ScreenContainer>
    );
  }

  const Modal = {
    push: (options: Omit<ModalProps, "type">) => {
      return UI.push({ type: "modal", ...options });
    },
    pop: UI.pop,
  };

  const BottomSheet = {
    push: (options: Omit<BottomSheetProps, "type">) => {
      return UI.push({ type: "bottom-sheet", ...options });
    },
    pop: UI.pop,
  };

  return {
    ToolkitProvider,
    Stack: Screens,
    BottomSheet,
    Modal,
  };
}

function renderStackItem(item: StackItem<Item>) {
  if (item.data.type === "modal") {
    return <ModalItem {...(item as StackItem<ModalProps>)} />;
  }

  if (item.data.type === "bottom-sheet") {
    return <BottomSheetItem {...(item as StackItem<BottomSheetProps>)} />;
  }

  return null;
}

const UI = create();
const { Stack, Modal, ToolkitProvider, BottomSheet } = UI;

export { create, Stack, Modal, ToolkitProvider, BottomSheet };
