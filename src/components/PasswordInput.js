import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PasswordInput = ({ password, setPassword }) => {
  const [secureText, setSecureText] = useState(true);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry={secureText} // Toggles visibility
      />
      <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.icon}>
        <Icon name={secureText ? 'eye-slash' : 'eye'} size={20} color="#777" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    padding: 15,
  },
  icon: {
    padding: 10,
  },
});

export default PasswordInput;
