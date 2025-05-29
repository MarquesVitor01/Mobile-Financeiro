import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Animated,
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
  icone: string;
}

type Period = "hoje" | "semana" | "mes";

interface GreyBoxProps {
  totalBalance: number;
  totalExpense: number;
}

interface Categoria {
  nome: string;
  icone: string;
}

export default function GreyBox({ totalBalance, totalExpense }: GreyBoxProps) {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionItem[]
  >([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("semana");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtual, setCategoriaAtual] = useState(0);
  const [valorCategoria, setValorCategoria] = useState(0);
  const [gastoPeriodo, setGastoPeriodo] = useState(0);

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const querySnapshot = await getDocs(collection(db, "financeiro"));
        const allTransactions: TransactionItem[] = [];
        const categoriaMap = new Map<string, string>(); // Map: categoria -> icone

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
              icone: data.icone || "question",
            });

            // Adiciona categoria e icone ao mapa se ainda não tiver
            if (data.gasto && !categoriaMap.has(data.gasto)) {
              categoriaMap.set(data.gasto, data.icone || "question");
            }
          }
        });

        setTransactions(allTransactions);

        // Converte o Map para array de objetos
        const categoriasArray: Categoria[] = Array.from(
          categoriaMap,
          ([nome, icone]) => ({
            nome,
            icone,
          })
        );

        setCategorias(categoriasArray);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const now = new Date();

    const filtered = transactions.filter((item) => {
      const date = item.rawDate;

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

    setFilteredTransactions(filtered);

    const gastosNoPeriodo = filtered
      .filter((t) => t.setor === "saida")
      .reduce((acc, curr) => acc + curr.valor, 0);

    setGastoPeriodo(gastosNoPeriodo);
  }, [transactions, selectedPeriod]);

  useEffect(() => {
    if (categorias.length === 0) {
      setValorCategoria(0);
      return;
    }

    const categoria = categorias[categoriaAtual].nome;

    const total = filteredTransactions
      .filter(
        (item) =>
          item.setor === "saida" &&
          item.gasto.toLowerCase() === categoria.toLowerCase()
      )
      .reduce((acc, curr) => acc + curr.valor, 0);

    setValorCategoria(total);
  }, [categoriaAtual, filteredTransactions, categorias]);

  const trocarCategoria = (direcao: "next" | "prev") => {
    if (categorias.length === 0) return;

    setCategoriaAtual((prev) => {
      if (direcao === "next") {
        return (prev + 1) % categorias.length;
      } else {
        return (prev - 1 + categorias.length) % categorias.length;
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          trocarCategoria("prev");
        } else if (gestureState.dx < -50) {
          trocarCategoria("next");
        }
      },
    })
  ).current;

  const PeriodTabs = () => (
    <View style={styles.tabContainer}>
      {(["hoje", "semana", "mes"] as Period[]).map((period) => (
        <TouchableOpacity
          key={period}
          onPress={() => setSelectedPeriod(period)}
          style={[styles.tab, selectedPeriod === period && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              selectedPeriod === period && styles.activeTabText,
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.containerBox}
      contentContainerStyle={{ paddingBottom: 150 }}
      showsVerticalScrollIndicator={false}
    >
      {categorias.length === 0 ? (
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Nenhuma categoria cadastrada.
        </Text>
      ) : (
        <View style={styles.highlightBox} {...panResponder.panHandlers}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => trocarCategoria("next")}
          >
            <Text style={{ fontSize: 40 }}>
              {categorias[categoriaAtual].icone}
            </Text>
          </TouchableOpacity>
          <View style={styles.highlightRight}>
            <Text style={styles.label}>{categorias[categoriaAtual].nome}</Text>
            <Text style={styles.value}>
              R$ {valorCategoria.toFixed(2).replace(".", ",")}
            </Text>
            <Text style={[styles.label, { marginTop: 8 }]}>
              Gastos do Período
            </Text>
            <Text style={[styles.value, { color: "#00D09E" }]}>
              R$ {gastoPeriodo.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>
      )}

      <PeriodTabs />

      <View style={styles.transactions}>
        {filteredTransactions.length === 0 ? (
          <Text style={styles.noTransactionsText}>
            Nenhuma transação para o período selecionado.
          </Text>
        ) : (
          filteredTransactions.map((item, index) => (
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
                <Text
                  style={[
                    styles.itemValue,
                    item.setor === "saida"
                      ? { color: "#E74C3C" }
                      : { color: "#00D09E" },
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            </View>
          ))
        )}
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
    alignItems: "center", // garante centralização vertical
  },
  highlightLeft: {
    alignItems: "center",
    width: "40%",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#00D09E",
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
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E0F7ED",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#00D09E",
  },
  tabText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "normal",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  transactions: {
    width: "100%",
  },
  noTransactionsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 14,
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
  },
});
