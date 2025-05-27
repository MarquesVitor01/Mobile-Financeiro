import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary";
};

export default function Button({ title, onPress, variant = "primary" }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        variant === "secondary" && styles.secondaryButton,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 240,
    height: 50,
    backgroundColor: "#00D09E",
    borderRadius: 30,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#00D09E",
  },
  buttonText: {
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: 18,
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#00D09E",
  },
});
