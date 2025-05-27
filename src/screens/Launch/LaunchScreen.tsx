import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef } from "react";
import Button from "./components/Button";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function LaunchScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => router.push("/login");
  const handleSignUp = () => router.push("/onBoarding");

  return (
    <LinearGradient
      colors={["#E6FFF3", "#F1FFF3", "#FFFFFF"]}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.container}>
        <Animated.Image
          source={require("../../../assets/images/logo-verde.png")}
          style={[
            styles.logo,
            {
              transform: [{ scale: pulseAnim }],
              opacity: fadeAnim,
            },
          ]}
        />

        <Animated.Text
          style={[
            styles.textLogo,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          FinWise
        </Animated.Text>

        <Animated.Text
          style={[
            styles.textIndice,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          Controle suas finanças de forma simples {"\n"} e eficiente.
        </Animated.Text>

        <Animated.View
          style={[
            styles.buttonsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Button title="Entrar" onPress={handleLogin} />
          <Button
            title="Cadastrar-se"
            onPress={handleSignUp}
            variant="secondary"
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 125,
    marginBottom: 20,
  },
  textLogo: {
    fontFamily: "Poppins",
    color: "#00D09E",
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 15,
    textAlign: "center",
  },
  textIndice: {
    color: "#4B4544",
    fontFamily: "League Spartan",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 35,
    opacity: 0.9,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
