import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import GreyBox from "./components/GreyBox";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
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
  logo: {
    marginVertical: 30,
    height: 90,
    width: 90,
  },
});
