import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const categories = [
  { id: "1", name: "Editar", icon: "edit" },
  { id: "2", name: "Segurança", icon: "shield-alt" },
  { id: "3", name: "Configurações", icon: "cogs" },
  { id: "4", name: "Ajuda", icon: "question-circle" },
  { id: "5", name: "Sair", icon: "sign-out-alt" },
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
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>João Silva</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F1FFF3",
    paddingTop: 170, // espaço maior para acomodar a imagem
    paddingHorizontal: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    position: "relative", // necessário pra posicionar a imagem
  },
  list: {
    paddingBottom: 30,
  },
  itemContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  box: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  profileContainer: {
    position: "absolute",
    top: -25, 
    alignSelf: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "#F1FFF3",
  },
  profileName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
