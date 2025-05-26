import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";

import BottomBar from "@/src/components/BottomBar";
import GreyBox from "./components/GreyBox";
import { useUser } from "@/src/context/UserContext";

const { width } = Dimensions.get("window");

function Header({ userName }: { userName?: string }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Olá, Seja Bem Vindo</Text>
        <Text style={styles.subGreeting}>{userName}</Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/perfil")}
        style={{ padding: 10 }}
      >
        <FontAwesome name="user-circle" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function BalanceInfo({
  totalBalance,
  totalExpense,
  expensePercentage,
}: {
  totalBalance: number;
  totalExpense: number;
  expensePercentage: number;
}) {
  return (
    <View style={styles.balanceBox}>
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>💰 Valor de Entrada</Text>
        <Text style={styles.expenseLabel}>💸 Valor de Saída</Text>
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
            { width: `${Math.min(expensePercentage, 100)}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {expensePercentage.toFixed(1)}% das suas despesas.{" "}
        {expensePercentage < 50 ? "Está indo bem." : "Cuidado!"}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expensePercentage, setExpensePercentage] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) return;

        const querySnapshot = await getDocs(collection(db, "financeiro"));
        let totalBalanceTemp = 0;
        let totalExpenseTemp = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId !== user.id) return;
          const valor = data.valor / 100;

          if (data.setor === "entrada") totalBalanceTemp += valor;
          else if (data.setor === "saida") totalExpenseTemp += valor;
        });

        setTotalBalance(totalBalanceTemp);
        setTotalExpense(totalExpenseTemp);

        const percentage = totalBalanceTemp
          ? (totalExpenseTemp / totalBalanceTemp) * 100
          : 0;
        setExpensePercentage(percentage);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Header userName={user?.nome} />

      <BalanceInfo
        totalBalance={totalBalance}
        totalExpense={totalExpense}
        expensePercentage={expensePercentage}
      />

      <GreyBox totalBalance={totalBalance} totalExpense={totalExpense} />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/add")}
      >
        <AntDesign name="pluscircle" size={60} color="#000" />
      </TouchableOpacity>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 30,
  },
  header: {
    paddingHorizontal: width * 0.05,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  subGreeting: {
    fontSize: 14,
    color: "#fff",
  },
  balanceBox: {
    marginTop: 20,
    paddingHorizontal: width * 0.05,
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
  divider: {
    height: 1,
    backgroundColor: "#ffffff60",
    marginVertical: 10,
  },
  progressBarContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
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
  floatingButton: {
    position: "absolute",
    bottom: 120,
    right: width * 0.05,
    zIndex: 10,
  },
});
