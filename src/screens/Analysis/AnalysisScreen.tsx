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
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Análises</Text>
        <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
      </View>

      <View style={styles.main}>
        <View style={styles.contentRow}>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={trocarCategoria}
          >
            <View style={styles.circleBorder}>
              <FontAwesome
                name={categorias[categoriaAtual].icone as any}
                size={44}
                color="#fff"
              />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.infoColumn}>
            <View style={styles.infoBox}>
              <FontAwesome name="credit-card" size={30} color="#fff" />
              <View style={styles.textContainer}>
                <Text style={styles.infoTitle}>
                  {categorias[categoriaAtual].nome}
                </Text>
                <Text style={styles.infoSubtitle}>
                  R$ {valorCategoria.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>
          </View>
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
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  main: {
    paddingBlock: 30,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#fff",
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00B68D",
  },
  divider: {
    width: 1,
    height: 130,
    backgroundColor: "#fff",
    marginHorizontal: 25,
  },
  infoColumn: {
    justifyContent: "center",
    height: 130,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00B68D",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: 180,
  },
  textContainer: {
    marginLeft: 10,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
});