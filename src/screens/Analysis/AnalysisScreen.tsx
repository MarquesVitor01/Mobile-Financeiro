import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GreyBox from "./components/GreyBox";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomBar from "@/src/components/BottomBar";
import { useRouter } from "expo-router";

export default function AnalysisScreen() {
  const totalBalance = 7783.0;
  const totalExpense = 1187.4;
  const rawPercentage = (totalExpense / totalBalance) * 100;
  const expensePercentage = parseFloat(rawPercentage.toFixed(1));

  const router = useRouter();

  const handleNavigate = (route: string) => {
    switch (route) {
      case "":
        router.push("/");
        break;
      case "":
        router.push("/");
        break;
      case "":
        router.push("/");
        break;
      case "":
        router.push("/");
        break;
      default:
        console.warn("Rota inválida:", route);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Account Balance</Text>
        </View>
        <MaterialCommunityIcons name="bell-circle" size={28} color="#fff" />
      </View>

      <View style={styles.main}>
        <View style={styles.contentRow}>
          <View style={styles.iconWrapper}>
            <View style={styles.circleBorder}>
              <FontAwesome name="car" size={44} color="#fff" />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoColumn}>
            <View style={styles.infoBox}>
              <FontAwesome name="credit-card" size={30} color="#fff" />
              <View style={styles.textContainer}>
                <Text style={styles.infoTitle}>Total Spent</Text>
                <Text style={styles.infoSubtitle}>R$ 1.187,40</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="chart-line"
                size={30}
                color="#fff"
              />
              <View style={styles.textContainer}>
                <Text style={styles.infoTitle}>Balance Left</Text>
                <Text style={styles.infoSubtitle}>R$ 6.595,60</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <GreyBox />
      <BottomBar onPress={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00D09E",
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  main: {
    paddingBlock: 30,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#fff",
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00B68D",
  },
  divider: {
    width: 1,
    height: 130,
    backgroundColor: "#fff",
    marginHorizontal: 25,
  },
  infoColumn: {
    justifyContent: "space-between",
    height: 130,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00B68D",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: 180,
  },
  textContainer: {
    marginLeft: 10,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  
});
