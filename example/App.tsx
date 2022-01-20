import * as React from "react";
import { View, Button, Text } from "react-native";

import { ToolkitProvider, BottomSheet, Modal, Stack } from "rn-toolkit";

export default function App() {
  return (
    <ToolkitProvider>
      <MyApp />
    </ToolkitProvider>
  );
}

function MyApp() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <Button
          title="Push screen"
          onPress={() => {
            Stack.push({
              element: <MyScreen />,
              screenProps: {
                stackPresentation: "modal",
              },
            });
          }}
        />

        <Button
          title="Push bottom sheet"
          onPress={() => {
            BottomSheet.push({
              element: <MyBottomSheet />,
              bottomSheetProps: {
                snapPoints: [400, 600],
              },
            });
          }}
        />

        <Button
          title="Push modal"
          onPress={() => {
            Modal.push({
              element: <MyModal />,
            });
          }}
        />
      </View>
    </View>
  );
}

function MyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Text>Hi</Text>
    </View>
  );
}

function MyBottomSheet() {
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
}

function MyModal() {
  return (
    <View style={{ backgroundColor: "white" }}>
      <Text>Hi</Text>
    </View>
  );
}
