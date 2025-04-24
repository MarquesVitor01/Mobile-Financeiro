import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // ou react-native-vector-icons se estiver fora do Expo

export default function GreyBox() {
  return (
    <View style={styles.containerBox}>
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Name LastName"
        placeholderTextColor="#A9A9A9"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        placeholderTextColor="#A9A9A9"
      />
      <Text style={styles.label}>Número</Text>
      <TextInput
        style={styles.input}
        placeholder="(11) 99999-9999"
        placeholderTextColor="#A9A9A9"
      />
      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        placeholderTextColor="#A9A9A9"
      />
      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="********"
          secureTextEntry
        />
        <FontAwesome name="eye" size={20} color="#555" style={styles.eyeIcon} />
      </View>
      <Text style={styles.label}>Comfirmar Senha</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="********"
          secureTextEntry
        />
        <FontAwesome name="eye" size={20} color="#555" style={styles.eyeIcon} />
      </View>

      <Text style={styles.fingerprintText}>By continuing, you agree to</Text>
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
      <Text style={styles.bottomText}>
        Already have an account? Log In{" "}
        <Text style={{ color: "#00D09E" }}>Sign Up</Text>
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
