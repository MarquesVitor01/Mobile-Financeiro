import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

interface TransactionItemProps {
  id: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
  iconColor: string;
  label: string;
  time: string;
  category: string;
  value: string;
  onDelete: (id: string) => void;
}

export default function TransactionItem({
  id,
  iconName,
  iconColor,
  label,
  time,
  category,
  value,
  onDelete,
}: TransactionItemProps) {
  const confirmDelete = () => {
    Alert.alert(
      "Excluir transação",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => onDelete(id) },
      ]
    );
  };

  return (
    <View style={styles.item}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
        <Feather name={iconName} size={16} color="#fff" />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <View style={styles.category}>
        <Text style={styles.categoryText}>{category}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      <TouchableOpacity onPress={confirmDelete} style={{ marginLeft: 10 }}>
        <MaterialIcons name="delete" size={24} color="#E63946" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  category: {
    alignItems: "flex-end",
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00D09E",
  },
});
