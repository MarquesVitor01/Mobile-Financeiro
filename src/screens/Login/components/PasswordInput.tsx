// src/components/common/PasswordInput.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function PasswordInput({
  label,
  value,
  onChangeText,
}: PasswordInputProps) {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder={label}
          placeholderTextColor="#A9A9A9"
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Feather
            name={secure ? "eye-off" : "eye"}
            size={20}
            color="#555"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// PasswordInput.tsx (estilo apenas)
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F5EF",
    borderRadius: 30,
    paddingHorizontal: 22,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#004D40",
  },
  icon: {
    marginLeft: 12,
  },
});

