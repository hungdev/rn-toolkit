import * as React from "react";
import {
  View,
  Animated,
  StyleSheet,
  useWindowDimensions,
  Text,
  Button,
  Pressable,
} from "react-native";
import { createAsyncStack, Stack, StackItem } from "create-async-stack";

type ModalProps = {
  element: React.ReactElement<any>;
};

const ModalStack = createAsyncStack<ModalProps>();

function useStackItems<T>(stack: Stack<T>) {
  const [items, setItems] = React.useState<StackItem<ModalProps>[]>([]);

  React.useEffect(() => {
    const unsubscribe = ModalStack.subscribe(({ state }) => {
      setItems(state.items);
    });

    return () => unsubscribe();
  }, []);

  return items;
}

function ModalStackContainer({ children }: any) {
  const modals = useStackItems(ModalStack);
  const hasModals = modals.some(
    (modal) => modal.status !== "popping" && modal.status !== "popped"
  );
  const animatedValue = React.useRef(new Animated.Value(hasModals ? 1 : 0));

  React.useEffect(() => {
    Animated.spring(animatedValue.current, {
      toValue: hasModals ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [hasModals]);

  const backgroundColor = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"],
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor }]}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={async () => {
          const poppedItems = await Promise.all(
            ModalStack.pop().map((i) => i.promise)
          );
        }}
      >
        {children}
        {modals.map((modal) => {
          return <ModalScreen {...modal} key={modal.key} />;
        })}
      </Pressable>
    </Animated.View>
  );
}

type ModalScreenProps = StackItem<ModalProps>;

function ModalScreen({ status, onPopEnd, onPushEnd, data }: ModalScreenProps) {
  const { height: screenHeight } = useWindowDimensions();

  const animatedValue = React.useRef(
    new Animated.Value(status === "settled" ? 1 : 0)
  );

  React.useEffect(() => {
    if (status === "pushing") {
      Animated.spring(animatedValue.current, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => onPushEnd());
    }

    if (status === "popping") {
      Animated.spring(animatedValue.current, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => onPopEnd());
    }
  }, [status, onPushEnd, onPopEnd]);

  const translateY = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  return (
    <Animated.View
      pointerEvents={status === "popping" ? "none" : "auto"}
      style={[StyleSheet.absoluteFillObject, { transform: [{ translateY }] }]}
    >
      <View style={{ flex: 1, justifyContent: "center", marginHorizontal: 32 }}>
        <Pressable>{data?.element || null}</Pressable>
      </View>
    </Animated.View>
  );
}

export default function App() {
  function onPushModal() {
    ModalStack.push({ element: <MyModal /> });
  }

  return (
    <ModalStackContainer>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Show modal" onPress={onPushModal} />
      </View>
    </ModalStackContainer>
  );
}

function MyModal() {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        paddingVertical: 32,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "800",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Hello!
      </Text>
      <Button title="Hide modal" onPress={() => ModalStack.pop()} />
    </View>
  );
}
