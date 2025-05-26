import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type FilterType = "entrada" | "saida";

interface FilterTabsProps {
  selectedFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

export default function FilterTabs({ selectedFilter, onSelectFilter }: FilterTabsProps) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={() => onSelectFilter("entrada")}>
        <Text style={selectedFilter === "entrada" ? styles.activeTab : styles.tab}>
          Entrada
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectFilter("saida")}>
        <Text style={selectedFilter === "saida" ? styles.activeTab : styles.tab}>
          Saída
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
