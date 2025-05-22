import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../assets/colors';

const Header = ({ title, subtitle, onBack }) => {
  return (
    <SafeAreaView style={[styles.header, !subtitle && styles.headerNarrow]}>
      {/* Title and Back Button Container */}
      <View style={styles.titleContainer}>
        <View style={{ width: '10%' }}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="caret-left" size={30} color="black" />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text style={styles.headerTitle}>{title}</Text>
        {onBack && (
          <TouchableOpacity style={{ width: '10%' }}>
            <Icon name="caret-left" size={30} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Subtitle (Optional) */}
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
  },
  headerNarrow: {
    paddingTop: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {

    justifyContent: 'center',
  },
  backButtonIcon: {
    left: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    width: '80%',
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