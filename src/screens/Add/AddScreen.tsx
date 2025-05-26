import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import GreyBox from "./components/GreyBox";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View>
          <Text style={styles.title}>Adicionar Registro</Text>
        </View>
      </View>

      <GreyBox />
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
