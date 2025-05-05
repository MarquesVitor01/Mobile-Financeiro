import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import GreyBox from "./components/GreyBox";
import { FontAwesome } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";

export default function HomeScreen() {
  const totalBalance = 7783.0;
  const totalExpense = 1187.4;
  const rawPercentage = (totalExpense / totalBalance) * 100;
  const expensePercentage = parseFloat(rawPercentage.toFixed(1));

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, Welcome Back</Text>
            <Text style={styles.subGreeting}>Good Morning</Text>
          </View>
          <View style={styles.icon}>
            <FontAwesome
              name="user-circle"
              size={28}
              color="#fff"
              style={styles.profileIcon}
            />
          </View>
        </View>

        <View style={styles.balanceBox}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>💰 Total Balance</Text>
            <Text style={styles.expenseLabel}>💸 Total Expense</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
            <Text style={styles.expenseAmount}>
              - ${totalExpense.toFixed(2)}
            </Text>
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
          <Text style={styles.progressText}>
            {expensePercentage}% of your expenses.{" "}
            {expensePercentage < 50 ? "Looks Good." : "Be careful!"}
          </Text>
        </View>

        <GreyBox />
      </ScrollView>
      <BottomBar/>
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
  greeting: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  subGreeting: {
    fontSize: 14,
    color: "#fff",
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
});
