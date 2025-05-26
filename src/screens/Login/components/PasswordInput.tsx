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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1F3E7",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 45,
  },
  input: {
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
});
