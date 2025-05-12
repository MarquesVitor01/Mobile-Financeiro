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
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/src/config/firebaseConfig";
import { useUser } from "@/src/context/UserContext";

// Tipagem do usuário
type UserData = {
  id: any;
  uid: string;
  nome: string;
  email: string;
  numero: string;
  dataNascimento: string;
};

export default function GreyBox() {
  const router = useRouter();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Alert.alert("Erro", "Usuário não encontrado no banco de dados.");
        return;
      }

      const dataFromFirestore = docSnap.data();

      const userData: UserData = {
        id: uid, 
        uid: uid,
        nome: dataFromFirestore.nome,
        email: dataFromFirestore.email,
        numero: dataFromFirestore.numero,
        dataNascimento: dataFromFirestore.dataNascimento,
      };

      setUser(userData);
      router.push("/home");
    } catch (error) {
      console.log("Erro ao logar:", error);
      Alert.alert("Erro", "Credenciais inválidas ou erro na autenticação.");
    }
  };

  return (
    <View style={styles.containerBox}>
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="********"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <FontAwesome
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity>
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.fingerprintText}>
        Utilize{" "}
        <Text style={{ color: "#00D09E", fontWeight: "bold" }}>
          Fingerprint
        </Text>{" "}
        Para Acessar
      </Text>

      {/* <View style={styles.socialContainer}>
        <FontAwesome name="facebook-square" size={30} color="#4267B2" />
        <FontAwesome name="google" size={30} color="#DB4437" />
      </View> */}

      <Text style={styles.bottomText}>
        Não Possui Uma Conta?{" "}
        <Text style={{ color: "#00D09E" }}>Criar Conta</Text>
      </Text>
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
    marginBlock: 10,
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
