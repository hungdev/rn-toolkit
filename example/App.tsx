import * as React from "react";
import { View, Button, Text } from "react-native";

import { ToolkitProvider, BottomSheet, Modal } from "rn-toolkit";

export default function App() {
  return (
    <ToolkitProvider>
      <Main />
    </ToolkitProvider>
  );
}

function Main() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <Text>HI</Text>
      </View>
      <Button title="Show" onPress={pushBottomSheet} />
    </View>
  );
}

function pushBottomSheet() {
  BottomSheet.push({
    bottomSheetProps: { snapPoints: [200, 400] },
    element: <MyBottomSheet onPress={pushModal} />,
  });
}

function pushModal() {
  Modal.push({
    element: <MyModal />,
  });
}

function MyBottomSheet({ onPress }: any) {
  return (
    <View style={{ padding: 12, paddingVertical: 64 }}>
      <Text>Awesome 🎉</Text>
      <Button title="Push" onPress={onPress} />
    </View>
  );
}

function MyModal() {
  return (
    <ModalContainer>
      <Text>Awesome 🎉</Text>
    </ModalContainer>
  );
}

function ModalContainer({ children }: any) {
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: "white",
        marginHorizontal: 16,
        padding: 16,
      }}
    >
      {children}
    </View>
  );
}
