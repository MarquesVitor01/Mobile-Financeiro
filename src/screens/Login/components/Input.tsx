// src/components/common/Input.tsx
import React from "react";
import {
  TextInput,
  Text,
  StyleSheet,
  View,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#A9A9A9"
        {...props}
      />
    </View>
  );
}

// Input.tsx (estilo apenas)
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    marginLeft: 12,
    marginBottom: 6,
    fontWeight: "600",
    color: "#007B5E",
  },
  input: {
    height: 48,
    backgroundColor: "#E7F5EF",
    borderRadius: 30,
    paddingHorizontal: 22,
    fontSize: 16,
    color: "#004D40",
  },
});
