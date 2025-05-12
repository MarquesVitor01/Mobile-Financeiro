import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "@/src/config/firebaseConfig";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "expo-router";

export default function GreyBox() {
  const router = useRouter();
  const categories = [
    { id: "1", name: "Editar", icon: "edit" },
    { id: "2", name: "Segurança", icon: "shield-alt" },
    { id: "5", name: "Sair", icon: "sign-out-alt" },
  ];
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.nome || "");

  const handleUpdateName = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "usuarios", user.id);
      await updateDoc(userRef, { nome: newName });

      setUser({ ...user, nome: newName });
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert(
        "Email enviado",
        "Um link para redefinição de senha foi enviado para seu email."
      );
      setPasswordModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar o email de redefinição de senha."
      );
    }
  };

  const handleItemPress = async (itemId: string) => {
    if (itemId === "1") {
      setModalVisible(true);
    } else if (itemId === "2") {
      setPasswordModalVisible(true);
    } else if (itemId === "5") {
      try {
        await signOut(auth);
        setUser(null);
        router.push("/login");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível sair da conta.");
      }
    }
  };

  const renderItem = ({ item }: { item: (typeof categories)[0] }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.box}
        onPress={() => handleItemPress(item.id)}
      >
        <FontAwesome5 name={item.icon as any} size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.label}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.containerBox}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../../../assets/images/logo-verde.png")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.nome}</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Modal para editar nome */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
              placeholder="Novo nome"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateName}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para alterar senha */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <Text style={styles.modalText}>
              Deseja alterar sua senha? Um link será enviado para seu email.
            </Text>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: "#00D09E" }]}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>Sim</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: "#FF3B30" }]}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.buttonText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F1FFF3",
    paddingTop: 170,
    paddingHorizontal: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    position: "relative",
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
    top: 25,
    alignSelf: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
  },
  profileName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#00D09E",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#00D09E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelText: {
    color: "#007BFF",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});