import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ title, subtitle }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FF6F60',
        padding: 20,
        paddingTop: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center'
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
        textAlign: 'center'
    },
});

export default Header;