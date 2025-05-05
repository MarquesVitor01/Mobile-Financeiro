import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GreyBox from "./components/GreyBox";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function AddScreen() {
  const totalBalance = 7783.0;
  const totalExpense = 1187.4;
  const rawPercentage = (totalExpense / totalBalance) * 100;
  const expensePercentage = parseFloat(rawPercentage.toFixed(1));

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
          <Text style={styles.title}>Add</Text>
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
  icon: {},
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  profileIcon: {
    marginLeft: "auto",
  },
  balanceBox: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 14,
  },
  expenseLabel: {
    color: "#fff",
    fontSize: 14,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  expenseAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#b9e0ff",
  },
  progressBarContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 10,
  },
  progressText: {
    marginBlock: 13,
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff60",
    marginVertical: 10,
  },
  lastTransactionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBlock: 20,
  },
});
