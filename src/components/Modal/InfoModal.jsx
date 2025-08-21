import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import Typography from '../../library/components/Typography';
import { useTheme } from '../../context/ThemeContext';
// import { colors } from '../../assets/colors';

const InfoModal = ({ title, description, visible, onClose }) => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Typography style={styles.title}>{title}</Typography>
          <Typography style={styles.message}>{description}</Typography>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Typography style={styles.buttonText}>OK</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;
