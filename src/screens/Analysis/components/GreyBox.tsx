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
        if (!user) {
          console.log("Usuário não logado.");
          return;
        }

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

  const itemsDoMesSelecionado = filteredItems.filter((item) => {
    return item.mes.toLowerCase() === selectedMonth.toLowerCase();
  });

  return (
    <View style={styles.containerBox}>
      <View style={styles.grafico}>
        <View style={styles.header}>
          <Text style={styles.chartTitle}>
            Entradas e Saídas - {selectedMonth}
          </Text>
          <TouchableOpacity
            onPress={() => setShowMonthPicker(true)}
            style={styles.monthButton}
          >
            <Feather name="calendar" size={24} color="#00D09E" />
          </TouchableOpacity>
        </View>

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

        <View style={styles.chartContainer}>
          {weeklyData.map((week, index) => (
            <View key={index} style={styles.weekContainer}>
              <Text style={styles.weekLabel}>{week.week}</Text>
              <View style={styles.barsContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setTooltip({ index, type: "income" })}
                  style={{ alignItems: "center" }}
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
                      styles.incomeBar,
                      { height: (week.income / maxValue) * 150 },
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setTooltip({ index, type: "expense" })}
                  style={{ alignItems: "center" }}
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
                      styles.expenseBar,
                      { height: (week.expense / maxValue) * 150 },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: fillIncome }]}
            />
            <Text style={styles.legendText}>Entradas</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: fillExpense }]}
            />
            <Text style={styles.legendText}>Saídas</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        {itemsDoMesSelecionado.map((item) => (
          <View key={item.id} style={styles.item}>
            <View
              style={[
                styles.iconCircleItem,
                { backgroundColor: item.iconColor },
              ]}
            >
              <Feather name={item.icon as any} size={16} color="#fff" />
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
      </ScrollView>
    </View>
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
  grafico: {
    backgroundColor: "#00D09E1A",
    padding: 20,
    borderRadius: 50,
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  monthButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F1FFF3",
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  monthOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  monthOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#ff6b6b",
  },
  chartContainer: {
    flexDirection: "row",
    height: 200,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  weekContainer: {
    alignItems: "center",
    flex: 1,
  },
  weekLabel: {
    fontSize: 12,
    marginBottom: 5,
    color: "#555",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: "100%",
  },
  bar: {
    width: 20,
    marginHorizontal: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 3,
  },
  incomeBar: {
    backgroundColor: "#00D09E",
  },
  expenseBar: {
    backgroundColor: "#FF6B6B",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#555",
  },
  tooltip: {
    position: "absolute",
    bottom: "100%",
    backgroundColor: "#333",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
    zIndex: 10,
  },
  tooltipText: {
    color: "white",
    fontSize: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircleItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
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
    color: "#888",
  },
  itemValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
