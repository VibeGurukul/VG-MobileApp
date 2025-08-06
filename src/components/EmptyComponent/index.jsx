import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Typography from '../../library/components/Typography';
import { useTheme } from '../../context/ThemeContext';

const EmptyComponent = ({ style }) => {
  const { colors } = useTheme();
  return (
    <View style={[{ flex: 1, alignItems: 'center' }, style]}>
      <Typography
        style={{
          fontWeight: 'bold',
          letterSpacing: 0.6,
          color: colors?.textPrimary,
        }}
      >
        No Item Available
      </Typography>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({});
