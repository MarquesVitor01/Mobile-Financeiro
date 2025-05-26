import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import HeaderPerfil from "./components/HeaderPerfil";
import GreyBox from "./components/GreyBox";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function PerfilScreen() {
  const router = useRouter();
  

  // Pode passar a função para o BottomBar para navegação personalizada
  // const handleNavigate = (route: string) => {
  //   if (!route) return;
  //   router.push(route);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPerfil />

      <ScrollView contentContainerStyle={styles.content}>
        <GreyBox />
      </ScrollView>

      <BottomBar  />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
    backgroundColor: "#F1FFF3",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
