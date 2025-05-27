import React, { useRef, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import NextBox from "./components/NextBox";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Organização Fincanceira.",
    image: require("../../../assets/images/background01.png"),
  },
  {
    key: "2",
    title: "Seu dinheiro sob controle",
    image: require("../../../assets/images/background02.png"),
  },
];

export default function OnBoardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x /
          event.nativeEvent.layoutMeasurement.width
      );
      setCurrentIndex(index);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  }, [currentIndex]);

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
      </View>
      <View style={styles.nextBoxContainer}>
        <NextBox
          image={item.image}
          onNext={handleNext}
          showDots
          currentIndex={currentIndex}
          total={slides.length}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    width: width,
    height: height,
    backgroundColor: "#00D09E",
  },
  titleContainer: {
    marginTop: 60,
    paddingHorizontal: 40,
  },
  titleText: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    color: "#fff",
    paddingVertical: 20,
    letterSpacing: 0.5,
  },
  nextBoxContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
