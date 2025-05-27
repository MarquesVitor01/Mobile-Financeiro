// src/components/Login/GreyBox.tsx
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.box}>
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <PasswordInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton
            label="Entrar"
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push("/onBoarding")}
          >
            <Text style={styles.signUpText}>Criar Conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fingerprintText}>
          Utilize <Text style={styles.highlight}>Fingerprint</Text> para acessar
        </Text>

        <TouchableOpacity onPress={() => router.push("/onBoarding")}>
          <Text style={styles.bottomText}>
            Não possui uma conta?{" "}
            <Text style={styles.highlight}>Crie uma agora</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1FFF3",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#007B5E",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 1,
  },
  box: {
    width: "100%",

    marginBottom: 30,
  },
  loginButton: {
    marginTop: 15,
    backgroundColor: "#00B07C",
  },
  signUpButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
    marginVertical: 8,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: "#00D09E",
    backgroundColor: "#fff"
  },
  signUpText: {
    fontWeight: "700",
    color: "#00B07C",
    fontSize: 16,
  },
  fingerprintText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  bottomText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
  },
  highlight: {
    color: "#00B07C",
    fontWeight: "700",
  },
});
