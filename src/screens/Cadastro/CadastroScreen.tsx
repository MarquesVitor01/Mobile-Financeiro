import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GreyBox from "./components/GreyBox";

export default function CadastroScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <GreyBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    marginBottom: 30,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Poppins",
    textShadowColor: "rgba(0, 255, 198, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
});
