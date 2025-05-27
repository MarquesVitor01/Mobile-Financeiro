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
  Linking,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "@/src/config/firebaseConfig";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "expo-router";

// Adiciona item 'lembretes' logo após 'security'
const options = [
  { id: "edit", label: "Editar Nome", icon: "edit" },
  { id: "security", label: "Segurança", icon: "shield-alt" },
  { id: "lembretes", label: "Lembretes", icon: "bell" }, // novo item
  { id: "logout", label: "Sair", icon: "sign-out-alt" },
];

export default function GreyBox() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [newName, setNewName] = useState(user?.nome || "");
  const [modalHelpVisible, setModalHelpVisible] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");

  const handleUpdateName = async () => {
    if (!user) return;

    if (newName.trim().length < 3) {
      Alert.alert("Aviso", "O nome deve ter ao menos 3 caracteres.");
      return;
    }

    try {
      const userRef = doc(db, "usuarios", user.id);
      await updateDoc(userRef, { nome: newName.trim() });

      setUser({ ...user, nome: newName.trim() });
      setModalEditVisible(false);
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert(
        "Email enviado",
        "Link para redefinir a senha enviado para seu email."
      );
      setModalPasswordVisible(false);
    } catch {
      Alert.alert("Erro", "Não foi possível enviar o email de redefinição.");
    }
  };

  const handleOptionPress = (id: string) => {
    if (id === "edit") {
      setModalEditVisible(true);
    } else if (id === "security") {
      setModalPasswordVisible(true);
    } else if (id === "lembretes") {
      router.push("/lembretes");
    } else if (id === "logout") {
      signOut(auth)
        .then(() => {
          setUser(null);
          router.push("/login");
        })
        .catch(() => Alert.alert("Erro", "Não foi possível sair da conta."));
    }
  };

  const renderItem = ({ item }: { item: (typeof options)[0] }) => (
    <TouchableOpacity
      style={[
        styles.optionBox,
        item.id === "logout" && styles.logoutButton,
      ]}
      activeOpacity={0.7}
      onPress={() => handleOptionPress(item.id)}
    >
      <FontAwesome5
        name={item.icon as any}
        size={24}
        color={item.id === "logout" ? "#fff" : "#fff"}
      />
      <Text
        style={[
          styles.optionLabel,
          item.id === "logout" && styles.logoutButtonText,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const handleHelp = () => {
    const phoneNumber = "5511940518638";
    const message = encodeURIComponent(helpMessage.trim());

    if (!message) {
      Alert.alert("Aviso", "Digite uma mensagem antes de enviar.");
      return;
    }

    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    Linking.openURL(url)
      .then(() => setModalHelpVisible(false))
      .catch(() => Alert.alert("Erro", "Não foi possível abrir o WhatsApp."));
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={require("../../../../assets/images/logo-verde.png")}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.nome || "Usuário"}</Text>
      </View>

      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.optionsList}
      />
      
      <TouchableOpacity
        style={[styles.button, styles.helpButton]}
        onPress={() => setModalHelpVisible(true)}
      >
        <Text style={styles.buttonText}>Precisa de Ajuda?</Text>
      </TouchableOpacity>

      <Modal
        visible={modalEditVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Digite seu novo nome"
              autoFocus
              maxLength={50}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateName}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalEditVisible(false)}
              >
                <Text style={[styles.buttonText, { color: "#00B07C" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalPasswordVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPasswordVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Redefinir Senha</Text>
            <Text style={styles.modalText}>
              Deseja receber um link para redefinir sua senha no seu email?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalPasswordVisible(false)}
              >
                <Text style={[styles.buttonText, { color: "#00B07C" }]}>
                  Não
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalHelpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalHelpVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Descreva sua necessidade.</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              value={helpMessage}
              onChangeText={setHelpMessage}
              placeholder="Digite sua mensagem"
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleHelp}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalHelpVisible(false)}
              >
                <Text style={[styles.buttonText, { color: "#00B07C" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  helpButton: {
    backgroundColor: "#00B07C",
    marginTop: 80,
    justifyContent: "center",
  },
  profile: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#00B07C",
  },
  optionsList: {
    paddingHorizontal: 10,
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  optionLabel: {
    fontSize: 18,
    marginLeft: 20,
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#00B07C",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 44,
    borderColor: "#00B07C",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 18,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#00B07C",
  },
  cancelButton: {
    backgroundColor: "#E0F4EF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
  },

  logoutButtonText: {
    color: "#fff",
  },
});
