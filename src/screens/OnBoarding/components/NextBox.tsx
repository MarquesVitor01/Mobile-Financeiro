import React from "react";
import {
  Image,
  StyleSheet,
  View,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
} from "react-native";

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
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      <TouchableOpacity onPress={onNext} accessibilityRole="button">
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      {showDots && (
        <View style={styles.dotsContainer}>
          {Array.from({ length: total }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F1FFF3",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 40,
    paddingBottom: 20,
    flex: 1,
    width: "100%",
    justifyContent: "center"
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
  },
  dotsContainer: {
    flexDirection: "row",
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
});
