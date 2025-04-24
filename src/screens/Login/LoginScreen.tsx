import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import GreyBox from "./components/GreyBox";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={[
          styles.logo,
        ]}
      />
      <Text style={styles.title}>Seja Bem Vindo</Text>
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
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
    marginBlock: 30,
  },
  logo: {
    height: 90,
    width: 90
  }
});
