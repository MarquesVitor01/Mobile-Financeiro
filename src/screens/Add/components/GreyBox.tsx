import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "@/src/config/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "expo-router";
import { TextInputMask } from 'react-native-masked-text';
import { useUser } from "@/src/context/UserContext"; 

export default function GreyBox() {
  const { user } = useUser();
  const [setor, setSetor] = useState("");
  const [gasto, setGasto] = useState("");
  const [nomeGasto, setNomeGasto] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    if (!nomeGasto || !valor || !setor) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const valorLimpo = valor.replace(/[^\d]/g, ""); 
      const valorEmCentavos = parseInt(valorLimpo, 10); 

      if (!user || !user.uid) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      await addDoc(collection(db, "financeiro"), {
        nome: nomeGasto,
        valor: valorEmCentavos, 
        setor,
        gasto: setor === "saida" ? gasto : null,
        descricao,
        userId: user.uid,
        data: Timestamp.now(),
      });

      Alert.alert("Sucesso", "Dados salvos com sucesso!");
      
      setNomeGasto("");
      setValor("");
      setSetor("");
      setGasto("");
      setDescricao("");

      router.push("/home"); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <View style={styles.containerBox}>
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
          type={'money'} 
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
          <Text style={styles.label}>Gasto</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={gasto}
              onValueChange={(itemValue) => setGasto(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Escolha..." value="" />
              <Picker.Item label="Comida" value="comida" />
              <Picker.Item label="Passeio" value="passeio" />
              <Picker.Item label="Compras" value="compras" />
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
    elevation: 2,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
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
});
