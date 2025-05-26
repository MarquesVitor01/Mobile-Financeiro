import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import { useUser } from "@/src/context/UserContext";
import GreyBox from "./components/GreyBox";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function AccountScreen() {
  const { user } = useUser();
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expensePercentage, setExpensePercentage] = useState(0);
  const router = useRouter();

  const fetchTotals = useCallback(async () => {
    if (!user) return;

    try {
      const querySnapshot = await getDocs(collection(db, "financeiro"));
      let balance = 0;
      let expense = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId !== user.id) return;

        const valor = data.valor / 100;
        if (data.setor === "entrada") balance += valor;
        else if (data.setor === "saida") expense += valor;
      });

      setTotalBalance(balance);
      setTotalExpense(expense);
      setExpensePercentage(
        balance ? parseFloat(((expense / balance) * 100).toFixed(1)) : 0
      );
    } catch (error) {
      console.error("Erro ao buscar totais:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchTotals();
  }, [fetchTotals]);

  const handleNavigate = (route: string) => {
    if (route === "") router.push("/");
    else console.warn("Rota desconhecida:", route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Registros</Text>
        <TouchableOpacity
          onPress={() => alert("Em desenvolvimento")}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceBox}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>💰 Total Balance</Text>
          <Text style={styles.expenseLabel}>💸 Total Expense</Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            R$ {totalBalance.toFixed(2).replace(".", ",")}
          </Text>
          <Text style={styles.expenseAmount}>
            - R$ {totalExpense.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBarFill, { width: `${expensePercentage}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {expensePercentage}% of your expenses.{" "}
          {expensePercentage < 50 ? "Looks Good." : "Be careful!"}
        </Text>
      </View>

      <GreyBox totalBalance={0} totalExpense={0} />

      <BottomBar onPress={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 40,
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
