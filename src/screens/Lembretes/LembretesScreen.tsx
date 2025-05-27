import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/src/config/firebaseConfig";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

interface Lembrete {
  id: string;
  texto: string;
  data: string; // yyyy-MM-dd
  horario?: string; // novo campo opcional hh:mm
}

interface Day {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

export default function LembretesScreen() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [texto, setTexto] = useState<string>("");
  const [horario, setHorario] = useState<string>("");
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);
  const router = useRouter();

  const [lembretesMes, setLembretesMes] = useState<Lembrete[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (selectedDate) fetchLembretes();
  }, [selectedDate]);

  useEffect(() => {
    fetchLembretesMes();
  }, []);

  const fetchLembretesMes = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    const q = query(
      collection(db, "lembretes"),
      where("data", ">=", `${year}-${month}-01`),
      where("data", "<=", `${year}-${month}-31`)
    );

    const querySnapshot = await getDocs(q);

    const fetched: Lembrete[] = querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Lembrete, "id">),
    }));

    setLembretesMes(fetched);
  };

  const fetchLembretes = async () => {
    if (!selectedDate) return;

    const q = query(
      collection(db, "lembretes"),
      where("data", "==", selectedDate)
    );

    const querySnapshot = await getDocs(q);

    const fetchedLembretes: Lembrete[] = querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Lembrete, "id">),
    }));

    setLembretes(fetchedLembretes);
  };

  const getMarkedDates = () => {
    const marks: { [key: string]: any } = {};

    lembretesMes.forEach((lem) => {
      const isSelected = lem.data === selectedDate;

      if (!marks[lem.data]) {
        marks[lem.data] = {
          marked: true,
          dotColor: "#2563EB",
          selected: isSelected,
          selectedColor: isSelected ? "#4F46E5" : undefined,
        };
      }
    });

    if (selectedDate && !marks[selectedDate]) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: "#4F46E5",
      };
    }

    return marks;
  };

  const salvarLembrete = async () => {
    if (!texto || !selectedDate) {
      Alert.alert("Erro", "Texto e data são obrigatórios.");
      return;
    }

    const lembreteData = {
      texto,
      data: selectedDate,
      horario: horario || null,
    };

    try {
      if (editingLembrete) {
        await updateDoc(doc(db, "lembretes", editingLembrete.id), lembreteData);
      } else {
        await addDoc(collection(db, "lembretes"), lembreteData);
      }
      limparFormulario();
      fetchLembretes();
      fetchLembretesMes();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o lembrete.");
    }
  };

  const excluirLembrete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "lembretes", id));
      fetchLembretes();
      fetchLembretesMes();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o lembrete.");
    }
  };

  const abrirEditar = (lembrete: Lembrete) => {
    setEditingLembrete(lembrete);
    setTexto(lembrete.texto);
    setHorario(lembrete.horario || "");
    setModalVisible(true);
  };

  const limparFormulario = () => {
    setTexto("");
    setHorario("");
    setEditingLembrete(null);
    setModalVisible(false);
  };

  const formatarHorario = (texto: string) => {
    // Remove tudo que não for número
    let digits = texto.replace(/\D/g, "");

    if (digits.length > 4) digits = digits.slice(0, 4);

    if (digits.length >= 3) {
      return digits.slice(0, 2) + ":" + digits.slice(2);
    } else if (digits.length >= 1) {
      return digits;
    }

    return "";
  };

  const onDayPress = (day: Day) => {
    setSelectedDate(day.dateString);

    const lembsNoDia = lembretesMes.filter((l) => l.data === day.dateString);
    setTooltipVisible(lembsNoDia.length > 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lembretes</Text>

      <View style={styles.calendarWrapper}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          theme={{
            todayTextColor: "#4F46E5",
            arrowColor: "#4F46E5",
            selectedDayBackgroundColor: "#4F46E5",
            selectedDayTextColor: "#fff",
            dotColor: "#2563EB",
            selectedDotColor: "#fff",
            textDayFontWeight: "600",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      <Modal
        visible={tooltipVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTooltipVisible(false)}
      >
        <TouchableOpacity
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={() => setTooltipVisible(false)}
        >
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipTitle}>Lembretes de {selectedDate}</Text>
            <FlatList
              data={lembretesMes.filter((l) => l.data === selectedDate)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.tooltipItem}>
                  <Text style={styles.tooltipText}>{item.texto}</Text>
                  <Text style={styles.tooltipTime}>{item.horario}</Text>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {selectedDate ? (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Adicionar Lembrete</Text>
          </TouchableOpacity>

          <FlatList
            data={lembretes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.texto}</Text>
                <Text style={styles.cardTime}>{item.horario}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => abrirEditar(item)}>
                    <Text style={styles.editButton}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => excluirLembrete(item.id)}>
                    <Text style={styles.deleteButton}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.infoText}>
          Selecione uma data para ver lembretes.
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={limparFormulario}
      >
        <TouchableWithoutFeedback onPress={limparFormulario}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback
              onPress={(e) => {
                if (Platform.OS === "web") {
                  e.stopPropagation();
                }
              }}
            >
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  {editingLembrete ? "Editar Lembrete" : "Novo Lembrete"}
                </Text>
                <TextInput
                  placeholder="Texto do lembrete"
                  value={texto}
                  onChangeText={setTexto}
                  style={styles.input}
                  multiline
                />

                <TextInput
                  placeholder="Horário (hh:mm)"
                  value={horario}
                  onChangeText={(text) => setHorario(formatarHorario(text))}
                  style={[styles.input, { marginBottom: 12 }]}
                  keyboardType="numeric"
                  maxLength={5}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={salvarLembrete}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={limparFormulario}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <BottomBar />
    </View>
  );
}
const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#E74C3C",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  calendarWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#00D09E",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBlock: 22,
    textAlign: "center",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardText: { fontSize: 16, fontWeight: "600" },
  cardTime: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  editButton: { marginRight: 16, color: "#2563EB", fontWeight: "600" },
  deleteButton: { color: "#DC2626", fontWeight: "600" },
  infoText: { textAlign: "center", marginTop: 20, color: "#fff" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
  timePickerButton: {
    backgroundColor: "#E0E7FF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  timePickerText: { fontSize: 16, fontWeight: "600", color: "#3730A3" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  cancelButtonText: { color: "#374151", fontWeight: "700", fontSize: 16 },

  tooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  tooltipItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tooltipText: { fontSize: 16, color: "#111827" },
  tooltipTime: { fontSize: 14, color: "#6B7280" },
});
function setHorario(date: Date) {
  throw new Error("Function not implemented.");
}
