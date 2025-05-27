import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface DatePickerModalProps {
  visible: boolean;
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

export function DatePickerModal({ visible, onSelectDate, onClose }: DatePickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Calendar
            onDayPress={(day: { dateString: string; }) => {
              onSelectDate(day.dateString);
              onClose();
            }}
            markedDates={{}}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '90%',
  },
});
