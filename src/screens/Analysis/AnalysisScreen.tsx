import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import GreyBox from "./components/GreyBox";
import { useUser } from "@/src/context/UserContext";

const categorias = [
  { nome: "passeio", icone: "car" },
  { nome: "comida", icone: "cutlery" },
  { nome: "compras", icone: "book" },
];

export default function AnalysisScreen() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categoriaAtual, setCategoriaAtual] = useState(0);
  const [valorCategoria, setValorCategoria] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user?.uid) return;

        const financeiroRef = collection(db, "financeiro");
        const q = query(financeiroRef, where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        const lista: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawDate = new Date(data.data.seconds * 1000);

          lista.push({
            ...data,
            valor: data.valor / 100,
            rawDate,
          });
        });

        setTransactions(lista);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const categoria = categorias[categoriaAtual].nome;
    const total = transactions
      .filter((item) => item.setor === "saida" && item.gasto === categoria)
      .reduce((acc, curr) => acc + curr.valor, 0);

    setValorCategoria(total);
  }, [categoriaAtual, transactions]);

  const trocarCategoria = () => {
    setCategoriaAtual((prev) => (prev + 1) % categorias.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity> */}
        <Text style={styles.title}>Análises</Text>
        <TouchableOpacity
          onPress={() => router.push("/lembretes")}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <TouchableOpacity
          style={styles.circleContainer}
          onPress={trocarCategoria}
        >
          <FontAwesome
            name={categorias[categoriaAtual].icone as any}
            size={30}
            color="#fff"
          />
          <Text style={styles.categoriaNome}>
            {categorias[categoriaAtual].nome}
          </Text>
        </TouchableOpacity>

        <View style={styles.valorBox}>
          <FontAwesome name="credit-card" size={20} color="#fff" />
          <Text style={styles.valorText}>
            R$ {valorCategoria.toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </View>

      <GreyBox />

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 20,
    justifyContent: "space-between",
  },
    iconButton: {
    padding: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  main: {
    alignItems: "center",
    marginBottom: 10,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#00B68D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  categoriaNome: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  valorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00B68D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  valorText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
