import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import GreyBox from "./components/GreyBox";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import { useUser } from "@/src/context/UserContext"; // IMPORTADO

export default function AccountScreen() {
  const { user } = useUser(); // USUÁRIO ATUAL
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expensePercentage, setExpensePercentage] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) return;

        const querySnapshot = await getDocs(collection(db, "financeiro"));
        let totalBalanceTemp = 0;
        let totalExpenseTemp = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const valor = data.valor / 100;

          if (data.userId === user.id) { // FILTRO POR ID DO USUÁRIO
            if (data.setor === "entrada") {
              totalBalanceTemp += valor;
            } else if (data.setor === "saida") {
              totalExpenseTemp += valor;
            }
          }
        });

        setTotalBalance(totalBalanceTemp);
        setTotalExpense(totalExpenseTemp);

        const rawPercentage = (totalExpenseTemp / totalBalanceTemp) * 100;
        setExpensePercentage(parseFloat(rawPercentage.toFixed(1)));
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleNavigate = (route: string) => {
    switch (route) {
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
          <Text style={styles.title}>Registros</Text>
        </View>
        <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
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

      <GreyBox totalBalance={totalBalance} totalExpense={totalExpense} />

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
