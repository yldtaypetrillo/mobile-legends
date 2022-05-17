import { useContext } from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { AuthContext } from "../context/authContext";

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Button
        onPress={signIn}
        title={"Click here to login"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
