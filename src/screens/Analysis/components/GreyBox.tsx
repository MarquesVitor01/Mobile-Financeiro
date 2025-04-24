import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface TransactionItem {
  icon: FeatherIconName;
  label: string;
  time: string;
  category: string;
  value: string;
  iconColor: string;
}

interface WeekData {
  week: string;
  income: number;
  expense: number;
}

const monthData: Record<string, WeekData[]> = {
  Abril: [
    { week: "Semana 1", income: 1200, expense: 800 },
    { week: "Semana 2", income: 1500, expense: 900 },
    { week: "Semana 3", income: 1800, expense: 1200 },
    { week: "Semana 4", income: 2000, expense: 1100 },
  ],
  Maio: [
    { week: "Semana 1", income: 1000, expense: 700 },
    { week: "Semana 2", income: 1300, expense: 850 },
    { week: "Semana 3", income: 1600, expense: 950 },
    { week: "Semana 4", income: 1900, expense: 1050 },
  ],
  Junho: [
    { week: "Semana 1", income: 1400, expense: 750 },
    { week: "Semana 2", income: 1700, expense: 880 },
    { week: "Semana 3", income: 2000, expense: 1000 },
    { week: "Semana 4", income: 2300, expense: 1150 },
  ],
};

export default function GreyBox() {
  const [selectedMonth, setSelectedMonth] = useState<string>("Abril");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const transactions: TransactionItem[] = [
    {
      icon: "credit-card",
      label: "Salary",
      time: "18:27 - April 30",
      category: "Monthly",
      value: "$4.000,00",
      iconColor: "#6C63FF",
    },
    {
      icon: "shopping-cart",
      label: "Groceries",
      time: "17:00 - April 24",
      category: "Pantry",
      value: "-$100,00",
      iconColor: "#29ABE2",
    },
    {
      icon: "home",
      label: "Rent",
      time: "8:30 - April 15",
      category: "Rent",
      value: "-$674,40",
      iconColor: "#1C92D2",
    },
  ];

  const fillIncome = "#00D09E";
  const fillExpense = "#FF6B6B";
  const weeklyData = monthData[selectedMonth] || [];

  const maxValue = Math.max(
    ...weeklyData.map(item => Math.max(item.income, item.expense))
  );

  return (
    <View style={styles.containerBox}>
      <View style={styles.grafico}>
        <View style={styles.header}>
          <Text style={styles.chartTitle}>Entradas e Saídas - {selectedMonth}</Text>
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

        {/* Gráfico de barras personalizado */}
        <View style={styles.chartContainer}>
          {weeklyData.map((week, index) => (
            <View key={index} style={styles.weekContainer}>
              <Text style={styles.weekLabel}>{week.week}</Text>
              <View style={styles.barsContainer}>
                <View style={[
                  styles.bar, 
                  styles.incomeBar, 
                  { height: (week.income / maxValue) * 150 } // 150 é a altura máxima
                ]}>
                  <Text style={styles.barValue}>${week.income}</Text>
                </View>
                <View style={[
                  styles.bar, 
                  styles.expenseBar, 
                  { height: (week.expense / maxValue) * 150 }
                ]}>
                  <Text style={styles.barValue}>${week.expense}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: fillIncome }]} />
            <Text style={styles.legendText}>Entradas</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: fillExpense }]} />
            <Text style={styles.legendText}>Saídas</Text>
          </View>
        </View>
      </View>

      <View style={styles.transactions}>
        {transactions.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={[styles.iconCircleItem, { backgroundColor: item.iconColor }]}>
              <Feather name={item.icon} size={16} color="#fff" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <View style={styles.itemCategory}>
              <Text style={styles.itemType}>{item.category}</Text>
              <Text style={[
                styles.itemValue, 
                item.value.startsWith("-") ? styles.expenseValue : styles.incomeValue
              ]}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
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
  barValue: {
    fontSize: 9,
    color: "white",
    marginBottom: 2,
    transform: [{ rotate: '-90deg' }],
    width: 40,
    textAlign: 'center',
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
  },
  incomeValue: {
    color: "#00D09E",
  },
  expenseValue: {
    color: "#FF6B6B",
  },
});