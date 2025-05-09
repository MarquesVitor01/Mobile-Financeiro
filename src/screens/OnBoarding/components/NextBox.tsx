import React from "react";
import {
  Image,
  StyleSheet,
  View,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

type NextBoxProps = {
  image: ImageSourcePropType;
  onNext: () => void;
  showDots?: boolean;
  currentIndex?: number;
  total?: number;
};

export default function NextBox({
  image,
  onNext,
  showDots = false,
  currentIndex = 0,
  total = 2,
}: NextBoxProps) {
  const router = useRouter();
  const handleSignUp = () => router.push("/cadastro");

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      <TouchableOpacity onPress={onNext} accessibilityRole="button">
        <Text style={styles.nextText}>
          {currentIndex === 0 ? "Tenha controle dos seus gastos e acompanhe sua evolução mês a mês." : "Registre despesas, visualize relatórios e tome decisões com mais clareza."}
        </Text>
      </TouchableOpacity>

      {showDots && (
        <View style={styles.dotsContainer}>
          {Array.from({ length: total }).map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}
      <TouchableOpacity onPress={handleSignUp} style={styles.cadastroButton}>
        <Text style={styles.cadastroText}>
          {currentIndex === 0 ? "Pular" : "Continuar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F1FFF3",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "center",
  },
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#DFF7E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: 240,
    height: 240,
  },
  nextText: {
    color: "#0E3E3E",
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    padding: 10
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#B0CFC7",
  },
  activeDot: {
    backgroundColor: "#00D09E",
  },
  cadastroButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#00D09E",
    borderRadius: 25,
    marginBottom: 20,
  },
  cadastroText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
});
