import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { format, isValid, parse } from "date-fns";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import { useUser } from "@/src/context/UserContext";
import { ConfirmModal } from "./ConfirmModal";
import { DatePickerModal } from "./DatePickerModal";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface TransactionItem {
  id: string;
  icon: FeatherIconName;
  label: string;
  time: string;
  category: string;
  value: string;
  iconColor: string;
  rawDate: Date;
  setor: string;
  valor: number;
  nome: string;
  gasto: string;
}

type FilterType = "entrada" | "saida";

interface GreyBoxProps {
  totalBalance: number;
  totalExpense: number;
}

export default function GreyBox({ totalBalance, totalExpense }: GreyBoxProps) {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [filtered, setFiltered] = useState<TransactionItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("entrada");

  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, "financeiro"),
          where("userId", "==", user.id)
        );
        const querySnapshot = await getDocs(q);
        const allTransactions: TransactionItem[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const rawDate = data?.data?.seconds
            ? new Date(data.data.seconds * 1000)
            : new Date();

          const valor = data?.valor ? data.valor / 100 : 0;

          allTransactions.push({
            id: docSnap.id,
            icon:
              data.setor === "entrada"
                ? "arrow-down-circle"
                : "arrow-up-circle",
            label: data.nome || "Gasto",
            time: format(rawDate, "dd/MM/yyyy HH:mm"),
            category: data.gasto || data.setor || "Outros",
            value:
              (data.setor === "saida" ? "-" : "") +
              `R$ ${valor.toFixed(2).replace(".", ",")}`,
            iconColor: data.setor === "entrada" ? "#6C63FF" : "#29ABE2",
            rawDate,
            setor: data.setor,
            valor,
            nome: data.nome || "",
            gasto: data.gasto || "",
          });
        });

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        Alert.alert("Erro", "Não foi possível carregar as transações.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    let filteredList = transactions.filter(
      (item) => item.setor === selectedFilter
    );

    if (searchText) {
      filteredList = filteredList.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedDate) {
      filteredList = filteredList.filter(
        (item) =>
          format(item.rawDate, "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      );
    }

    setFiltered(filteredList);
  }, [transactions, selectedFilter, searchText, selectedDate]);

  const openConfirm = (id: string) => {
    setSelectedId(id);
    setConfirmVisible(true);
  };

  const closeConfirm = () => {
    setSelectedId(null);
    setConfirmVisible(false);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    setDeleting(true);

    try {
      await deleteDoc(doc(db, "financeiro", selectedId));
      setTransactions((prev) => prev.filter((item) => item.id !== selectedId));
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      Alert.alert("Erro", "Não foi possível excluir a transação.");
    } finally {
      setDeleting(false);
      closeConfirm();
    }
  };

  const handleSelectDate = (dateString: string) => {
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
    }
  };

  return (
    <>
      <View style={styles.filtersContainer}>
        <TextInput
          placeholder="Buscar por nome..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />

        <TouchableOpacity
          onPress={() => setDatePickerVisible(true)}
          style={styles.dateInput}
        >
          <Text>
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar Data"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.clearButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedDate(null);
            setSearchText("");
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Limpar filtros</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.containerBox}>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setSelectedFilter("entrada")}>
            <Text
              style={
                selectedFilter === "entrada" ? styles.activeTab : styles.tab
              }
            >
              Entrada
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedFilter("saida")}>
            <Text
              style={selectedFilter === "saida" ? styles.activeTab : styles.tab}
            >
              Saída
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00D09E" />
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
        ) : (
          <View style={styles.transactions}>
            {filtered.map((item) => (
              <View key={item.id} style={styles.item}>
                <View
                  style={[
                    styles.iconCircleItem,
                    { backgroundColor: item.iconColor },
                  ]}
                >
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
                <TouchableOpacity
                  onPress={() => openConfirm(item.id)}
                  style={{ marginLeft: 10 }}
                  disabled={deleting}
                >
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color={deleting ? "#ccc" : "#E63946"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <DatePickerModal
        visible={isDatePickerVisible}
        onSelectDate={(dateString) => {
          handleSelectDate(dateString);
          setDatePickerVisible(false);
        }}
        onClose={() => setDatePickerVisible(false)}
      />

      <ConfirmModal
        visible={confirmVisible}
        message="Tem certeza que deseja excluir esta transação?"
        onConfirm={confirmDelete}
        onCancel={closeConfirm}
        loading={deleting}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dateInput: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    width: 140,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  containerBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F1FFF3",
    paddingTop: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  clearButtonContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#E63946",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#E63946",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});
