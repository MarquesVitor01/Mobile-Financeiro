import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "@/src/context/UserContext";
import { auth } from "@/src/config/firebaseConfig";
import { fetchUserData } from "@/src/context/UserContext";

import Input from "./Input";
import PasswordInput from "./PasswordInput";
import PrimaryButton from "./PrimaryButton";

export default function GreyBox() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      const userData = await fetchUserData(uid);

      if (!userData) {
        Alert.alert("Erro", "Usuário não encontrado no banco de dados.");
        return;
      }

      setUser(userData);
      router.push("/home");
    } catch (error) {
      console.log("Erro ao logar:", error);
      Alert.alert("Erro", "Credenciais inválidas ou erro na autenticação.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <PasswordInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
      />
      <PrimaryButton label="Log In" onPress={handleLogin} />

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push("/onBoarding")}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.fingerprintText}>
        Utilize <Text style={styles.highlight}>Fingerprint</Text> Para Acessar
      </Text>

      <TouchableOpacity onPress={() => router.push("/onBoarding")}>
        <Text style={styles.bottomText}>
          Não Possui Uma Conta?{" "}
          <Text style={styles.highlight}>Criar Conta</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F1FFF3",
    paddingTop: 70,
    padding: 24,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B1B1F",
    marginBottom: 24,
    textAlign: "center",
  },
  signUpButton: {
    backgroundColor: "#E1F3E7",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginTop: 16,
  },
  signUpText: {
    fontWeight: "bold",
    color: "#00D09E",
    fontSize: 16,
  },
  fingerprintText: {
    marginTop: 24,
    color: "#333",
    fontSize: 13,
  },
  bottomText: {
    marginTop: 16,
    fontSize: 13,
    textAlign: "center",
    color: "#333",
  },
  highlight: {
    color: "#00D09E",
    fontWeight: "bold",
  },
});
