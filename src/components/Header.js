import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../assets/colors';

const Header = ({ title, subtitle, onBack }) => {
  return (
    <View style={[styles.header, !subtitle && styles.headerNarrow]}>
      {/* Title and Back Button Container */}
      <View style={styles.titleContainer}>
        {/* Back Button (Optional) */}
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="caret-left" size={30} color="black" />
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={styles.headerTitle}>{title}</Text>
        {onBack && (
          <TouchableOpacity style={{ width: '20%' }}>
            <Icon name="caret-left" size={30} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Subtitle (Optional) */}
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
  },
  headerNarrow: {
    paddingTop: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {
    width: '20%',
    justifyContent: 'center',
  },
  backButtonIcon: {
    left: 0,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    width: '60%',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default Header;