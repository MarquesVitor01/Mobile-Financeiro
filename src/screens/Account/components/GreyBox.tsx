import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";

// Definindo os tipos para ícones válidos do Feather
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface TransactionItem {
  icon: FeatherIconName;
  label: string;
  time: string;
  category: string;
  value: string;
  iconColor: string;
}

export default function GreyBox() {
  const transactions: TransactionItem[] = [
    {
      icon: "credit-card", // Ícone válido do Feather (substitui "wallet")
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

  return (
    <View style={styles.containerBox}>

      <View style={styles.tabContainer}>
        <Text style={styles.tab}>Transactions</Text>
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
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// Estilos (mantidos iguais)
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