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
import { Feather, MaterialIcons, Entypo } from "@expo/vector-icons";
import { format, isValid, parse } from "date-fns";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import { useUser } from "@/src/context/UserContext";
import { ConfirmModal } from "./ConfirmModal";
import { DatePickerModal } from "./DatePickerModal";
import { TextInputMask } from "react-native-masked-text";

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
  descricao: string;
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

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState<Partial<TransactionItem>>({});

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
            valor: data.valorCentavos || "",
            nome: data.nome || "",
            gasto: data.gasto || "",
            descricao: data.descricao || "",
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

  const openViewModal = (transaction: TransactionItem) => {
    setSelectedTransaction(transaction);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setSelectedTransaction(null);
    setViewModalVisible(false);
  };

  const openEditModal = () => {
    if (selectedTransaction) {
      setEditData({ ...selectedTransaction });
      setEditModalVisible(true);
    }
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const handleEditChange = (
    field: keyof TransactionItem,
    value: string | number
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = async () => {
    if (!editData.id) return;

    try {
      const updateRef = doc(db, "financeiro", editData.id);

      // Valor em centavos (ex: R$ 12.34 => 1234)
      const valorCentavos = editData.valor;

      await updateDoc(updateRef, {
        nome: editData.nome,
        gasto: editData.gasto,
        descricao: editData.descricao,
        valor: valorCentavos,
      });

      setTransactions((prev) =>
        prev.map((item) => {
          if (item.id === editData.id) {
            const valor = editData.valor ?? item.valor;
            const setor = editData.setor ?? item.setor;
            const valorFormatado = (valor / 100).toFixed(2).replace(".", ",");
            const valueString =
              (setor === "saida" ? "-" : "") + `R$ ${valorFormatado}`;

            return {
              ...item,
              ...editData,
              valor,
              value: valueString,
              label: editData.nome ?? item.label,
              category: editData.gasto ?? item.category,
            };
          }
          return item;
        })
      );

      Alert.alert("Sucesso", "Transação atualizada!");
      closeEditModal();
      closeViewModal();
    } catch (error) {
      console.error("Erro ao editar transação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a transação.");
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
            {selectedDate
              ? format(selectedDate, "dd/MM/yyyy")
              : "Selecionar Data"}
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
                  onPress={() => openViewModal(item)}
                  style={{ marginLeft: 10 }}
                >
                  <Entypo name="info" size={24} color="#4ECDC4" />
                </TouchableOpacity>

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

      <Modal
        visible={viewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeViewModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes da Transação</Text>
            {selectedTransaction && (
              <>
                <Text>Nome: {selectedTransaction.nome}</Text>
                <Text>Categoria: {selectedTransaction.gasto}</Text>
                <Text>Valor: {selectedTransaction.value}</Text>
                <Text>Data: {selectedTransaction.time}</Text>
                <Text>Setor: {selectedTransaction.setor}</Text>
                <Text>Descrição: {selectedTransaction.descricao}</Text>
              </>
            )}
            <TouchableOpacity
              onPress={closeViewModal}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openEditModal}
              style={[styles.modalCloseButton, { backgroundColor: "#6C63FF" }]}
            >
              <Text style={styles.modalCloseText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Transação</Text>

            <TextInput
              placeholder="Nome"
              value={editData.nome}
              onChangeText={(text) => handleEditChange("nome", text)}
              style={styles.input}
            />

            <TextInput
              placeholder="Categoria"
              value={editData.gasto}
              onChangeText={(text) => handleEditChange("gasto", text)}
              style={styles.input}
            />

<TextInputMask
  type={"money"}
  options={{
    precision: 2,
    separator: ",",
    delimiter: ".",
    unit: "R$ ",
  }}
  value={
    editData.valor !== undefined
      ? (editData.valor / 100).toFixed(2).replace(".", ",") // valor em reais formatado
      : ""
  }
  onChangeText={(text) => {
    // Remove tudo que não for número e vírgula
    const valorLimpo = text.replace(/[^\d,]/g, "");

    // Troca vírgula por ponto para parseFloat
    const valorComPonto = valorLimpo.replace(",", ".");

    // Converte para número decimal em reais
    const valorNumero = parseFloat(valorComPonto) || 0;

    // Converte para centavos (inteiro)
    const valorCentavos = Math.round(valorNumero * 100);

    handleEditChange("valor", valorCentavos);
  }}
  style={styles.input}
  keyboardType="numeric"
/>



            <TextInput
              placeholder="Descrição"
              value={editData.descricao}
              onChangeText={(text) => handleEditChange("descricao", text)}
              style={styles.input}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={closeEditModal}
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: "#E63946" },
                ]}
              >
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleEditSave}
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: "#6C63FF" },
                ]}
              >
                <Text style={styles.modalCloseText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#E63946",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "bold",
  },
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
