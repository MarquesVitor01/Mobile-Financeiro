import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GreyBox from "./components/GreyBox";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function AccountScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registros</Text>
        <TouchableOpacity
          onPress={() => router.push("/lembretes")}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <GreyBox totalBalance={0} totalExpense={0} />

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 10,
  },
  iconButton: {
    padding: 8,
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
    marginVertical: 13,
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff60",
    marginVertical: 10,
  },
});
