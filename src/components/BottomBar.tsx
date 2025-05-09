// components/BottomBar.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const items = [
{ route: "/perfil", icon: "user-circle", label: "Perfil" },
  { route: "/home", icon: "home", label: "Início" },
  { route: "/account", icon: "folder-open", label: "Registros" },
  { route: "/analysis", icon: "line-chart", label: "Análises" },
  // { route: "/notification", icon: "bell", label: "Notificações" },
  // { route: "/categories", icon: "th-large", label: "Categorias" },
] as const;

type RoutePath = typeof items[number]["route"];

interface BottomBarProps {
  onPress?: (route: RoutePath) => void;
}

export default function BottomBar({ onPress }: BottomBarProps) {
  const router = useRouter();

  const handleNavigate = (route: RoutePath) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.route}
          onPress={() => handleNavigate(item.route)}
          style={styles.iconButton}
        >
          <FontAwesome name={item.icon} size={22} color="#052224" />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EAF8EE",
    paddingVertical: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconButton: {
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#444",
  },
});
