# rn-toolkit

## Installation

```bash
yarn add rn-toolkit
```

Install the required dependencies if you dont have them already

```bash
yarn add react-native-screens react-native-gesture-handler react-native-reanimated
```

## Usage

Wrap your app in the `<ToolkitProvider />` component

```tsx
// App.tsx
import * as React from "react";

import { ToolkitProvider } from "rn-toolkit";

function App() {
  return (
    <ToolkitProvider>
      <MyApp />
    </ToolkitProvider>
  );
}
```

Now you can push a new screen:

```tsx
import * as React from "react";
import { Button, View, Text } from "react-native";

import { Stack } from "rn-toolkit";

function MyComponent() {
  return (
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
  );
}

function MyScreen() {
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
}
```

...or use a bottom sheet:

```tsx
import * as React from "react";
import { Button, View, Text } from "react-native";

import { BottomSheet } from "rn-toolkit";

function MyComponent() {
  return (
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
  );
}

function MyBottomSheet() {
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
}
```

...or even a modal:

```tsx
import * as React from "react";
import { Button, View, Text } from "react-native";

import { Modal } from "rn-toolkit";

function MyComponent() {
  return (
    <Button
      title="Push modal"
      onPress={() => {
        Modal.push({
          element: <MyModal />,
        });
      }}
    />
  );
}

function MyModal() {
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
}
```
