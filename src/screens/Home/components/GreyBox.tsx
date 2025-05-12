import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import { useUser } from "@/src/context/UserContext";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface TransactionItem {
  icon: FeatherIconName;
  label: string;
  time: string;
  category: string;
  value: string;
  iconColor: string;
  rawDate: Date;
  setor: string;
  valor: number;
  nome: string;
  gasto: string;
}

type Period = "hoje" | "semana" | "mes";

interface GreyBoxProps {
  totalBalance: number;
  totalExpense: number;
}

interface UserData {
  id: string; // Ensure the `id` property is here
  name: string;
  email: string;
}

export default function GreyBox({ totalBalance, totalExpense }: GreyBoxProps) {
  const { user } = useUser(); // user should be typed as `UserData | null`
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [filtered, setFiltered] = useState<TransactionItem[]>([]);
  const [gastoPeriodo, setGastoPeriodo] = useState(0);
  const [gastoComida, setGastoComida] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("semana");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) {
          console.log("Usuário não logado.");
          return;
        }

        const querySnapshot = await getDocs(collection(db, "financeiro"));
        const allTransactions: TransactionItem[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawDate = new Date(data.data.seconds * 1000);
          const valor = data.valor / 100;

          if (data.userId === user.id) {
            allTransactions.push({
              icon:
                data.setor === "entrada"
                  ? "arrow-down-circle"
                  : "arrow-up-circle",
              label: data.nome || "Gasto",
              time: rawDate.toLocaleString("pt-BR"),
              category: data.gasto || data.setor || "Outros",
              value:
                (data.setor === "saida" ? "-" : "") +
                `R$ ${valor.toFixed(2).replace(".", ",")}`,
              iconColor: data.setor === "entrada" ? "#6C63FF" : "#29ABE2",
              rawDate,
              setor: data.setor,
              valor,
              nome: data.nome || "",
              gasto: data.gasto || "",
            });
          }
        });

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, [user]); // Certifique-se de que o useEffect depende de 'user'

  useEffect(() => {
    console.log("User ID:", user?.id); // Verifique o ID do usuário
    const filteredList = transactions.filter((item) => {
      const date = item.rawDate;
      const now = new Date();

      if (selectedPeriod === "hoje") {
        return (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      if (selectedPeriod === "semana") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo && date <= now;
      }

      if (selectedPeriod === "mes") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      return false;
    });

    setFiltered(filteredList);
  }, [transactions, selectedPeriod, user?.id]); // Garanta que o filtro só ocorra quando o 'user.id' ou os dados das transações mudarem

  return (
    <ScrollView style={styles.containerBox}>
      <View style={styles.highlightBox}>
        <View style={styles.highlightLeft}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="car" size={20} color="#00D09E" />
          </View>
          <Text style={styles.highlightLabel}>Savings On Goals</Text>
        </View>
        <View style={styles.highlightRight}>
          <Text style={styles.label}>Gastos do Período</Text>
          <Text style={styles.value}>
            R$ {gastoPeriodo.toFixed(2).replace(".", ",")}
          </Text>
          <Text style={styles.label}>Gastos com comida</Text>
          <Text style={[styles.value, { color: "#00D09E" }]}>
            - R$ {gastoComida.toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {(["hoje", "semana", "mes"] as Period[]).map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={selectedPeriod === period ? styles.activeTab : styles.tab}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.transactions}>
        {filtered.map((item, index) => (
          <View key={index} style={styles.item}>
            <View
              style={[
                styles.iconCircleItem,
                { backgroundColor: item.iconColor },
              ]}
            >
              <Feather name={item.icon} size={16} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <View style={styles.itemCategory}>
              <Text style={styles.itemType}>{item.category}</Text>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F1FFF3",
    paddingTop: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  highlightBox: {
    flexDirection: "row",
    backgroundColor: "#00D09E1A",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    justifyContent: "space-between",
  },
  highlightLeft: {
    alignItems: "center",
    width: "40%",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#00D09E",
    alignItems: "center",
    justifyContent: "center",
  },
  highlightLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  highlightRight: {
    justifyContent: "center",
    width: "60%",
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tab: {
    fontSize: 14,
    color: "#555",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E0F7ED",
  },
  activeTab: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#00D09E",
  },
  transactions: {
    width: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  iconCircleItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  itemTime: {
    fontSize: 12,
    color: "#888",
  },
  itemCategory: {
    alignItems: "flex-end",
  },
  itemType: {
    fontSize: 12,
    color: "#666",
  },
  itemValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00D09E",
  },
});
