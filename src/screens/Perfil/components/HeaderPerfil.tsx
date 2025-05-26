import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HeaderPerfil() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
        <FontAwesome name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Perfil</Text>

      <TouchableOpacity onPress={() => alert("Em desenvolvimento")} style={styles.iconButton}>
        <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
});
