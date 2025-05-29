import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "@/src/config/firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { TextInputMask } from "react-native-masked-text";
import { useUser } from "@/src/context/UserContext";

// Lista de ícones disponíveis (nomes de emojis, mas pode ser qualquer lib de ícones)
const iconesDisponiveis = ["🍔", "🏖️", "🛒", "💡", "🚗", "🏠", "📚", "🎁"];

export default function GreyBox() {
  const { user } = useUser();
  const router = useRouter();

  // Form
  const [setor, setSetor] = useState("");
  const [gasto, setGasto] = useState("");
  const [nomeGasto, setNomeGasto] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  // Categorias
  const [categorias, setCategorias] = useState<
    { nome: string; icone: string }[]
  >([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState("");
  const [modalCategoriasVisible, setModalCategoriasVisible] = useState(false);
  const [modalIconesVisible, setModalIconesVisible] = useState(false);

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!user?.uid) return;

    const carregarCategorias = async () => {
      try {
        const q = query(
          collection(db, "categorias"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const cats: { nome: string; icone: string }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.nome && data.icone)
            cats.push({ nome: data.nome, icone: data.icone });
        });
        setCategorias(cats);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    carregarCategorias();
  }, [user]);

  const adicionarCategoria = async () => {
    const nomeTrim = novaCategoria.trim();
    if (!nomeTrim || !iconeSelecionado) {
      alert("Preencha o nome e selecione um ícone.");
      return;
    }

    const jaExiste = categorias.some((cat) => cat.nome === nomeTrim);
    if (jaExiste) {
      alert("Categoria já existe!");
      return;
    }

    try {
      if (!user?.uid) {
        alert("Usuário não autenticado.");
        return;
      }

      await addDoc(collection(db, "categorias"), {
        nome: nomeTrim,
        icone: iconeSelecionado,
        userId: user.uid,
      });

      setCategorias((old) => [
        ...old,
        { nome: nomeTrim, icone: iconeSelecionado },
      ]);
      setNovaCategoria("");
      setIconeSelecionado("");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert("Erro ao adicionar categoria.");
    }
  };

  const pedirExcluirCategoria = (cat: string) => {
    setCategoriaParaExcluir(cat);
    setModalExcluirVisible(true);
  };

  const excluirCategoria = async () => {
    if (!categoriaParaExcluir || !user?.uid) return;

    try {
      const q = query(
        collection(db, "categorias"),
        where("userId", "==", user.uid),
        where("nome", "==", categoriaParaExcluir)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "categorias", document.id));
      });

      setCategorias((old) =>
        old.filter((c) => c.nome !== categoriaParaExcluir)
      );
      if (gasto === categoriaParaExcluir) setGasto("");

      setModalExcluirVisible(false);
      setCategoriaParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria.");
      setModalExcluirVisible(false);
    }
  };

  const handleSubmit = async () => {
    if (!nomeGasto || !valor || !setor) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const valorLimpo = valor.replace(/[^\d]/g, "");
      const valorEmCentavos = parseInt(valorLimpo, 10);

      if (!user?.uid) {
        alert("Usuário não autenticado.");
        return;
      }

      // Buscar o ícone correspondente à categoria selecionada
      let iconeGasto = null;
      if (setor === "saida" && gasto) {
        const categoriaSelecionada = categorias.find(
          (cat) => cat.nome === gasto
        );
        iconeGasto = categoriaSelecionada ? categoriaSelecionada.icone : null;
      }

      await addDoc(collection(db, "financeiro"), {
        nome: nomeGasto,
        valor: valorEmCentavos,
        setor,
        gasto: setor === "saida" ? gasto : null,
        icone: setor === "saida" ? iconeGasto : null, // <-- salvando o ícone
        descricao,
        userId: user.uid,
        data: Timestamp.now(),
      });

      alert("Dados salvos com sucesso!");

      setNomeGasto("");
      setValor("");
      setSetor("");
      setGasto("");
      setDescricao("");

      router.push("/home");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Não foi possível salvar os dados.");
    }
  };

  return (
    <View style={styles.containerBox}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Modal Categorias */}
        <Modal
          animationType="slide"
          transparent
          visible={modalCategoriasVisible}
          onRequestClose={() => setModalCategoriasVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Gerenciar Categorias</Text>

              <FlatList
                data={categorias}
                keyExtractor={(item) => item.nome}
                style={{ maxHeight: 200, marginBottom: 10 }}
                renderItem={({ item }) => (
                  <View style={styles.categoriaItem}>
                    <Text style={styles.categoriaNome}>
                      {item.icone} {item.nome}
                    </Text>
                    <TouchableOpacity
                      style={styles.btnExcluir}
                      onPress={() => pedirExcluirCategoria(item.nome)}
                    >
                      <Text style={styles.textExcluir}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Nova categoria"
                placeholderTextColor="#666"
                value={novaCategoria}
                onChangeText={setNovaCategoria}
              />

              <TouchableOpacity onPress={() => setModalIconesVisible(true)}>
                <Text style={{ marginVertical: 8, color: "#00D09E" }}>
                  {iconeSelecionado
                    ? `Ícone: ${iconeSelecionado}`
                    : "Selecionar ícone"}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                  onPress={() => setModalCategoriasVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Fechar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#00D09E" }]}
                  onPress={adicionarCategoria}
                >
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                    Adicionar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal ícones */}
        <Modal
          animationType="slide"
          transparent
          visible={modalIconesVisible}
          onRequestClose={() => setModalIconesVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Escolha um Ícone</Text>
              <FlatList
                data={iconesDisponiveis}
                numColumns={4}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ margin: 10 }}
                    onPress={() => {
                      setIconeSelecionado(item);
                      setModalIconesVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 28 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Modal excluir */}
        <Modal
          animationType="fade"
          transparent
          visible={modalExcluirVisible}
          onRequestClose={() => setModalExcluirVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { maxWidth: 300 }]}>
              <Text style={styles.modalTitle}>Confirmar exclusão</Text>
              <Text style={{ marginVertical: 20, fontSize: 16 }}>
                Deseja remover a categoria{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {categoriaParaExcluir}
                </Text>
                ?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                  onPress={() => setModalExcluirVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#FF4C4C" }]}
                  onPress={excluirCategoria}
                >
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Formulário */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do gasto</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui"
            placeholderTextColor="#888"
            value={nomeGasto}
            onChangeText={setNomeGasto}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valor</Text>
          <TextInputMask
            type={"money"}
            style={styles.input}
            placeholder="Digite aqui"
            placeholderTextColor="#888"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Setor</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={setor}
              onValueChange={(itemValue) => setSetor(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Escolha..." value="" />
              <Picker.Item label="Entrada" value="entrada" />
              <Picker.Item label="Saída" value="saida" />
            </Picker>
          </View>
        </View>

        {setor === "saida" && (
          <View style={styles.inputGroup}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={styles.label}>Gasto</Text>
              <TouchableOpacity onPress={() => setModalCategoriasVisible(true)}>
                <Text style={{ color: "#00D09E", fontWeight: "bold" }}>
                  Gerenciar Categorias
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={gasto}
                onValueChange={(itemValue) => setGasto(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Escolha..." value="" />
                {categorias.map((cat) => (
                  <Picker.Item
                    key={cat.nome}
                    label={`${cat.icone} ${cat.nome}`}
                    value={cat.nome}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Escreva algo..."
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#E5F7EA",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    backgroundColor: "#E5F7EA",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
    borderWidth: 0,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: "#00D09E",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#222",
    textAlign: "center",
  },
  categoriaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  categoriaNome: {
    fontSize: 16,
    color: "#222",
  },
  btnExcluir: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  textExcluir: {
    color: "#fff",
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#00D09E",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
