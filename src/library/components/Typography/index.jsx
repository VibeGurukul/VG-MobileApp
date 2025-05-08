import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Typography = ({ children, style }) => {
  return (
    <Text style={[style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default Typography;

const styles = StyleSheet.create({});
