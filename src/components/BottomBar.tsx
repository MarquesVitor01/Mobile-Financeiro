// components/BottomBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface BottomBarProps {
  onPress?: (route: string) => void;
}

export default function BottomBar({ onPress }: BottomBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress?.('inicio')} style={styles.iconButton}>
        <FontAwesome name="home" size={24} color="#052224" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress?.('sobre')} style={styles.iconButton}>
        <FontAwesome name="bell" size={24} color="#052224" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress?.('projetos')} style={styles.iconButton}>
        <FontAwesome name="folder" size={24} color="#052224" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress?.('inicio')} style={styles.iconButton}>
        <FontAwesome name="user" size={24} color="#052224" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#DFF7E2',
      paddingVertical: 40, // aumenta a altura
      borderTopColor: '#ddd',
      borderTopWidth: 1,
      borderTopLeftRadius: 50, 
      borderTopRightRadius: 50,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    iconButton: {
      alignItems: 'center',
    },
    label: {
      fontSize: 12,
      color: '#000',
      marginTop: 4,
    },
  });
  
