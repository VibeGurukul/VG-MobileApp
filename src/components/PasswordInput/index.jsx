import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';

const PasswordInput = ({
  password,
  setPassword,
  editable = true,
  placeholder = 'Password',
  style,
  placeholderTextColor,
}) => {
  const [secureText, setSecureText] = useState(true);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 30,
      backgroundColor: colors.cardBackground,
    },
    input: {
      flex: 1,
      color: colors.textPrimary,
    },
    icon: {
      padding: 10,
    },
    disabledInput: {
      opacity: 0.6,
    },
  });

  return (
    <View style={[style, styles.inputContainer]}>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || colors.textQuaternary}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry={secureText}
        editable={editable}
      />
      <TouchableOpacity
        onPress={() => setSecureText(!secureText)}
        style={styles.icon}
        disabled={!editable}
      >
        <Icon
          name={secureText ? 'eye-slash' : 'eye'}
          size={20}
          color={colors.textTertiary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
