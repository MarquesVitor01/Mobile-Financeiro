import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const categories = [
  { id: "1", name: "Transporte", icon: "bus" },
  { id: "2", name: "Alimentação", icon: "utensils" },
  { id: "3", name: "Lazer", icon: "gamepad" },
  { id: "4", name: "Saúde", icon: "heartbeat" },
  { id: "5", name: "Educação", icon: "book" },
  { id: "6", name: "Moradia", icon: "home" },
  { id: "7", name: "Roupas", icon: "tshirt" },
  { id: "8", name: "Tecnologia", icon: "laptop" },
  { id: "9", name: "Outros", icon: "ellipsis-h" },
];

export default function GreyBox() {
  const renderItem = ({ item }: { item: typeof categories[0] }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={0.7} style={styles.box}>
        <FontAwesome5 name={item.icon as any} size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.label}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.containerBox}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
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
  grid: {
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemContainer: {
    alignItems: "center",
    flex: 1,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#007BFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});
