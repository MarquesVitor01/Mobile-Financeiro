import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { db } from "@/src/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "@/src/context/UserContext";

interface WeekData {
  week: string;
  income: number;
  expense: number;
}

interface ItemData {
  id: string;
  label: string;
  category: string;
  value: string;
  icon: string;
  iconColor: string;
  time: string;
  mes: string;
}

const validFeatherIcons = new Set([
  "dollar-sign",
  "shopping-cart",
  "home",
  "calendar",
  "credit-card",
  "briefcase",
  "book",
  "coffee",
  "gift",
  "tag",
]);

export default function GreyBox() {
  const { user } = useUser();
  const [monthData, setMonthData] = useState<Record<string, WeekData[]>>({});
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ItemData[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) return;

        const querySnapshot = await getDocs(collection(db, "financeiro"));
        const transactions: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId !== user.id) return;

          const date = new Date(data.data.seconds * 1000);
          const mes = date.toLocaleString("pt-BR", { month: "long" });

          transactions.push({
            ...data,
            valor: data.valor / 100,
            date,
            mes,
            semana: `Semana ${Math.ceil(date.getDate() / 7)}`,
            label: data.nome || "Sem título",
            category: data.categoria || "Outros",
            value: `R$${(data.valor / 100).toFixed(2)}`,
            icon: validFeatherIcons.has(data.icon) ? data.icon : "dollar-sign",
            iconColor: data.setor === "entrada" ? "#00D09E" : "#FF6B6B",
            time: date.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        });

        const grouped: Record<
          string,
          Record<string, { income: number; expense: number }>
        > = {};

        transactions.forEach((t) => {
          const mes = t.mes.charAt(0).toUpperCase() + t.mes.slice(1);
          const semana = t.semana;

          if (!grouped[mes]) grouped[mes] = {};
          if (!grouped[mes][semana])
            grouped[mes][semana] = { income: 0, expense: 0 };

          if (t.setor === "entrada") grouped[mes][semana].income += t.valor;
          if (t.setor === "saida") grouped[mes][semana].expense += t.valor;
        });

        const formattedData: Record<string, WeekData[]> = {};
        Object.entries(grouped).forEach(([mes, semanas]) => {
          formattedData[mes] = Object.entries(semanas).map(
            ([week, values]) => ({
              week,
              income: values.income,
              expense: values.expense,
            })
          );
        });

        const mesesDisponiveis = Object.keys(formattedData);
        setMonthData(formattedData);
        setSelectedMonth(mesesDisponiveis[0] || "");
        setFilteredItems(transactions);
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      }
    };

    fetchTransactions();
  }, []);

  const fillIncome = "#00D09E";
  const fillExpense = "#FF6B6B";
  const weeklyData = monthData[selectedMonth] || [];
  const maxValue = Math.max(
    ...weeklyData.flatMap((item) => [item.income, item.expense, 1])
  );

  const [tooltip, setTooltip] = useState<{
    index: number;
    type: "income" | "expense";
  } | null>(null);
  const itemsDoMesSelecionado = filteredItems.filter(
    (item) => item.mes.toLowerCase() === selectedMonth.toLowerCase()
  );

  return (
    <View style={styles.container}>
      {/* Gráfico */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Entradas e Saídas - {selectedMonth}</Text>
          <TouchableOpacity
            onPress={() => setShowMonthPicker(true)}
            style={styles.monthButton}
          >
            <Feather name="calendar" size={20} color="#00D09E" />
          </TouchableOpacity>
        </View>

        {/* Modal de meses */}
        <Modal
          visible={showMonthPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMonthPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {Object.keys(monthData).map((month) => (
                <TouchableOpacity
                  key={month}
                  style={styles.monthOption}
                  onPress={() => {
                    setSelectedMonth(month);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={styles.monthOptionText}>{month}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowMonthPicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.chart}>
          {weeklyData.map((week, index) => (
            <View key={index} style={styles.week}>
              <Text style={styles.weekLabel}>{week.week}</Text>
              <View style={styles.bars}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setTooltip({ index, type: "income" })}
                >
                  {tooltip?.index === index && tooltip?.type === "income" && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>
                        R${week.income.toFixed(0)}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        backgroundColor: fillIncome,
                        height: (week.income / maxValue) * 120,
                      },
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setTooltip({ index, type: "expense" })}
                >
                  {tooltip?.index === index && tooltip?.type === "expense" && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>
                        R${week.expense.toFixed(0)}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        backgroundColor: fillExpense,
                        height: (week.expense / maxValue) * 120,
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: fillIncome }]} />
            <Text>Entradas</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: fillExpense }]}
            />
            <Text>Saídas</Text>
          </View>
        </View>
      </View>

      {/* Lista de itens */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {itemsDoMesSelecionado.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            style={styles.item}
          >
            <View
              style={[styles.iconCircle, { backgroundColor: item.iconColor }]}
            >
              <Feather name={item.icon as any} size={18} color="#fff" />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <View style={styles.itemCategory}>
              <Text style={styles.itemType}>{item.category}</Text>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1FFF3",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  card: {
    backgroundColor: "#E8F9F1",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  monthButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    marginTop: 10,
  },
  week: {
    alignItems: "center",
    flex: 1,
  },
  weekLabel: {
    fontSize: 10,
    marginBottom: 4,
    color: "#555",
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bar: {
    width: 12,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  tooltip: {
    position: "absolute",
    bottom: "100%",
    padding: 4,
    backgroundColor: "#333",
    borderRadius: 6,
    marginBottom: 4,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 10,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  monthOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  monthOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#ff6b6b",
    textAlign: "center",
  },
  list: {
    flex: 1,
    marginBottom: 80, // espaço para não ser cortado pela bottom bar
  },
  listContent: {
    paddingBottom: 80, // espaço extra no final
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemLabel: {
    fontWeight: "600",
    fontSize: 15,
  },
  itemTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  itemCategory: {
    alignItems: "flex-end",
  },
  itemType: {
    fontSize: 12,
    color: "#aaa",
  },
  itemValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
    itemInfo: {
    flex: 1,
  },
});
