import React, { useRef, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import NextBox from "./components/NextBox";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Welcome to\nExpense Manager",
    image: require("../../../assets/images/background01.png"),
  },
  {
    key: "2",
    title: "Track your\nSpending Easily",
    image: require("../../../assets/images/background02.png"),
  },
];

export default function OnBoardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
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
    <View style={[styles.slide, { width, height }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
      </View>
      <NextBox
        image={item.image}
        onNext={handleNext}
        showDots
        currentIndex={currentIndex}
        total={slides.length}
      />
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
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    backgroundColor: "#00D09E",
    flex: 1,
  },
  titleContainer: {
    paddingTop: 100,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  titleText: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 39,
    color: "#fff",
  },
});
