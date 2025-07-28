import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Typography from "../../library/components/Typography";

const EmptyComponent = ({ style }) => {
  return (
    <View style={[{ flex: 1, alignItems: "center" }, style]}>
      <Typography style={{ fontWeight: "bold", letterSpacing: 0.6 }}>
        No Item Available
      </Typography>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({});
