import * as React from "react";
import {
  ScreenStack,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
  ScreenProps,
  Screen,
  ScreenStackHeaderConfig,
} from "react-native-screens";
import { StyleSheet } from "react-native";

import { createAsyncStack, Stack as StackType } from "./create-async-stack";
import { useStackItems } from "./use-stack-items";

type Props = {
  element: React.ReactElement<any>;
  headerProps?: ScreenStackHeaderConfigProps;
  screenProps?: ScreenProps;
};

export type ScreenContainerProps = ScreenStackProps & {};

export function createScreenStack() {
  const Screens = createAsyncStack<Props>();

  const p = Screens.pop;

  function pop(amount?: number, startIndex?: number) {
    const items = p(amount, startIndex);

    items.forEach((item) => {
      item.onPopEnd();
    });

    return items;
  }

  Screens.pop = pop;

  function onDismissed() {
    Screens.pop();
  }

  function ScreenContainer({ children, ...props }: ScreenContainerProps) {
    const stackItems = useStackItems(Screens);

    return (
      <ScreenStack {...props} style={{ flex: 1 }}>
        <Screen style={StyleSheet.absoluteFill}>{children}</Screen>
        {stackItems
          .filter(
            (item) => item.status !== "popping" && item.status !== "popped"
          )
          .map((item) => {
            const { element, screenProps, headerProps, ...props } = item.data;
            return (
              <Screen
                key={item.key}
                {...props}
                {...screenProps}
                onDismissed={onDismissed}
                onWillDisappear={onDismissed}
                onDisappear={item.onPopEnd}
                onAppear={item.onPushEnd}
              >
                <ScreenStackHeaderConfig {...headerProps} />
                {element}
              </Screen>
            );
          })}
      </ScreenStack>
    );
  }

  return {
    Screens,
    ScreenContainer,
  };
}
