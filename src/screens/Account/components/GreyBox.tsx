import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import { useUser } from "@/src/context/UserContext"; // <== IMPORTANTE

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

type FilterType = "entrada" | "saida";

interface GreyBoxProps {
  totalBalance: number;
  totalExpense: number;
}

export default function GreyBox({ totalBalance, totalExpense }: GreyBoxProps) {
  const { user } = useUser(); // <== USA O CONTEXTO DO USUÁRIO
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [filtered, setFiltered] = useState<TransactionItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("entrada");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) return;

        const querySnapshot = await getDocs(collection(db, "financeiro"));
        const allTransactions: TransactionItem[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.userId !== user.id) return; // <== FILTRA POR ID DO USUÁRIO

          const rawDate = new Date(data.data.seconds * 1000);
          const valor = data.valor / 100;

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
        });

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const filteredList = transactions.filter((item) => item.setor === selectedFilter);
    setFiltered(filteredList);
  }, [transactions, selectedFilter]);

  return (
    <ScrollView style={styles.containerBox}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedFilter("entrada")}>
          <Text
            style={selectedFilter === "entrada" ? styles.activeTab : styles.tab}
          >
            Entrada
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedFilter("saida")}>
          <Text
            style={selectedFilter === "saida" ? styles.activeTab : styles.tab}
          >
            Saída
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactions}>
        {filtered.map((item, index) => (
          <View key={index} style={styles.item}>
            <View
              style={[styles.iconCircleItem, { backgroundColor: item.iconColor }]}
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
