import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GreyBox from "./components/GreyBox";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function AccountScreen() {
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
          <Text style={styles.title}>Account Balance</Text>
        </View>
        <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
      </View>

      <View style={styles.balanceBox}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>💰 Total Balance</Text>
          <Text style={styles.expenseLabel}>💸 Total Expense</Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
          <Text style={styles.expenseAmount}>- ${totalExpense.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${expensePercentage}%` as `${number}%` },
            ]}
          />
        </View>

        <View style={styles.lastTransactionsContainer}>
          <View style={styles.transactionBox}>
            <FontAwesome name="arrow-down" size={24} color="#00D09E" />
            <Text style={styles.transactionLabel}>Última entrada</Text>
            <Text style={styles.transactionAmount}>+ $250.00</Text>
          </View>
          <View style={styles.transactionBox}>
            <FontAwesome name="arrow-up" size={24} color="#FF5C5C" />
            <Text style={styles.transactionLabel}>Última saída</Text>
            <Text style={styles.transactionAmount}>- $99.90</Text>
          </View>
        </View>
        <Text style={styles.progressText}>
          {expensePercentage}% of your expenses.{" "}
          {expensePercentage < 50 ? "Looks Good." : "Be careful!"}
        </Text>
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
  transactionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  transactionLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  transactionAmount: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
