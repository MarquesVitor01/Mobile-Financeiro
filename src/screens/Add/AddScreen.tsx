import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GreyBox from "./components/GreyBox";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function AddScreen() {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    switch (route) {
      case "":
        router.push("/");
        break;
      case "":
        router.push("/");
        break;
      case "":
        router.push("/");
        break;
      case "":
        router.push("/");
        break;
      default:
        console.warn("Rota inválida:", route);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Adicionar Registro</Text>
        </View>
        <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
      </View>

      <GreyBox />
      <BottomBar onPress={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
