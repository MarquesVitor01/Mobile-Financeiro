import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/config/firebaseConfig";
import { useRouter } from "expo-router";

export default function GreyBox() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const formatarData = (texto: string) => {
    const numeros = texto.replace(/\D/g, "");
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4)
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(
      4,
      8
    )}`;
  };

  const handleSignUp = async () => {
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome,
        email,
        numero,
        dataNascimento,
        criadoEm: new Date(),
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro ao criar conta", error.message);
      } else {
        Alert.alert("Erro ao criar conta", "Erro desconhecido.");
      }
    }
  };

  return (
    <View style={styles.containerBox}>
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Name LastName"
        placeholderTextColor="#A9A9A9"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Número</Text>
      <TextInput
        style={styles.input}
        placeholder="(11) 99999-9999"
        placeholderTextColor="#A9A9A9"
        value={numero}
        onChangeText={setNumero}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput
        style={styles.input}
        placeholder="01/01/2000"
        placeholderTextColor="#A9A9A9"
        value={dataNascimento}
        onChangeText={(text) => setDataNascimento(formatarData(text))}
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="********"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <FontAwesome name="eye" size={20} color="#555" style={styles.eyeIcon} />
      </View>

      <Text style={styles.label}>Confirmar Senha</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="********"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <FontAwesome name="eye" size={20} color="#555" style={styles.eyeIcon} />
      </View>

      <Text style={styles.fingerprintText}>By continuing, you agree to</Text>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
        <Text style={styles.loginText}>Criar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.bottomText}>
          Já possui uma conta?{" "}
          <Text style={{ color: "#00D09E" }}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F1FFF3",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 10,
    fontWeight: "600",
    color: "#0E3E3E",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#E1F3E7",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  inputPassword: {
    flex: 1,
    height: 45,
    backgroundColor: "#E1F3E7",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  loginButton: {
    backgroundColor: "#00D09E",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginTop: 10,
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotText: {
    color: "#000",
    marginTop: 10,
    fontSize: 12,
  },
  signUpButton: {
    backgroundColor: "#E1F3E7",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginTop: 10,
  },
  signUpText: {
    fontWeight: "bold",
    color: "#00D09E",
    fontSize: 16,
  },
  fingerprintText: {
    marginTop: 20,
    color: "#333",
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "40%",
    marginTop: 20,
  },
  bottomText: {
    marginTop: 20,
    fontSize: 12,
  },
});
