// src/components/common/Input.tsx
import React from "react";
import { TextInput, Text, StyleSheet, View, TextInputProps } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: "600",
    color: "#0E3E3E",
  },
  input: {
    height: 45,
    backgroundColor: "#E1F3E7",
    borderRadius: 25,
    paddingHorizontal: 20,
  },
});
