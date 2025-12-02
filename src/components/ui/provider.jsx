"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

export function Provider(props) {
  return (
    <ChakraProvider
      value={{
        ...defaultSystem,
        config: {
          initialColorMode: "light",
          useSystemColorMode: false,
        },
      }}
    >
      <ColorModeProvider defaultColorMode="light" {...props} />
    </ChakraProvider>
  );
}
