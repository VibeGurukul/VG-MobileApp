import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { colors } from '../../assets/colors';
import Typography from '../../library/components/Typography';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ title, subtitle, onBack }) => {
  const { cart } = useSelector(state => state.cart);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.primary,
      padding: 10,
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
      paddingHorizontal: 20,
    },
    backButton: {
      justifyContent: 'center',
      tintColor: colors.white,
      alignSelf: 'flex-start',
    },
    backButtonIcon: {
      left: 0,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      width: '60%',
      color: 'white',
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'white',
      opacity: 0.9,
      textAlign: 'center',
      width: '80%',
      marginBottom: 10,
    },
  });

  return (
    <View style={[styles.header]}>
      {/* Title and Back Button Container */}
      <View style={[styles.titleContainer, !subtitle && { marginBottom: 20 }]}>
        <TouchableOpacity onPress={onBack} style={{ width: '20%' }}>
          {onBack && (
            <View style={styles.backButton}>
              <Icon name="caret-left" size={30} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <Typography style={styles.headerTitle}>{title}</Typography>
        <View style={{ width: '20%', alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{
              backgroundColor: colors.gray600,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
            }}
          >
            <Icon name="shopping-cart" size={20} color={colors.white} />
            {cart.length ? (
              <View
                style={{
                  backgroundColor: colors.youtube,
                  width: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 15,
                  position: 'absolute',
                  top: -2,
                  right: 0,
                  borderRadius: 999,
                }}
              >
                <Typography style={{ color: 'white', fontSize: 10 }}>
                  {cart.length}
                </Typography>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtitle (Optional) */}
      {subtitle && (
        <Typography style={styles.headerSubtitle}>{subtitle}</Typography>
      )}
    </View>
  );
};

export default Header;
