import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  "http://localhost:5000";

export default function Signup({ setShowSignup }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);
        Alert.alert("🎉 Welcome to TAUfoods", "Account created successfully!", [
          { text: "OK", onPress: () => setShowSignup(false) },
        ]);
      } else {
        Alert.alert("Signup Failed", data.message || "Try again later.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Unable to connect to server. Try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000", "#E46A11"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.brand}>TAUfoods 🍽️</Text>
        <Text style={styles.tagline}>Eat Smart, Live Well</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => setShowSignup(false)}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  brand: { color: "#fff", fontSize: 28, fontWeight: "800" },
  tagline: { color: "#fff", fontSize: 14, fontStyle: "italic", marginTop: 3 },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    elevation: 4,
    padding: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    borderColor: "#E46A11",
    borderWidth: 1.2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  switchText: {
    marginTop: 15,
    textAlign: "center",
    color: "#333",
  },
  link: {
    color: "#E46A11",
    fontWeight: "700",
  },
});


