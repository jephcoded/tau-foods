import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  "http://localhost:5000";

export default function Home({ user }: any) {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${BASE_URL}/api/foods`, { headers });
      const data = await res.json();
      setFoods(data);
      setLoading(false);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      Alert.alert("Error", "Unable to fetch food items");
    }
  };

  // ==========================================================
  // FIXED ADD TO CART — SAFE FROM NULL & TYPESCRIPT WARNINGS
  // ==========================================================
  const addToCart = async (food: any) => {
    try {
      let cartString = await AsyncStorage.getItem("cart");

      let cart: any[] = [];
      if (cartString) {
        try {
          cart = JSON.parse(cartString);
          if (!Array.isArray(cart)) cart = [];
        } catch {
          cart = [];
        }
      }

      const index = cart.findIndex((i: any) => i._id === food._id);

      if (index >= 0) {
        cart[index].quantity += 1;
      } else {
        cart.push({
          _id: food._id,
          name: food.name,
          price: food.price,
          quantity: 1,
        });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      Alert.alert("Added", `${food.name} added to cart!`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E46A11" />
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* Header / Banner */}
      <LinearGradient
        colors={["#000", "#E46A11"]}
        style={styles.banner}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.brand}>TAUfoods 🍽</Text>
            <Text style={styles.slogan}>Eat Smart, Live Well</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Categories */}
      <View style={{ marginTop: 15 }}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["Burgers", "Rice", "Chicken", "Pizza", "Snacks"].map((cat, i) => (
            <View key={i} style={styles.catBox}>
              <Text style={styles.catText}>{cat}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Food Menu */}
      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Food Menu</Text>

        <FlatList
          data={foods}
          scrollEnabled={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={
                  item.image 
                    ? { uri: `${BASE_URL}${item.image}` }
                    : require("../assets/images/react-logo.png")
                }
                style={styles.image}
                defaultSource={require("../assets/images/react-logo.png")}
              />
              <View style={styles.foodInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.price}>₦{item.price}</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  banner: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logo: { width: 60, height: 60, borderRadius: 15 },
  brand: { color: "#fff", fontSize: 30, fontWeight: "800" },
  slogan: { color: "#fff", opacity: 0.8 },

  catBox: {
    backgroundColor: "#fff",
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  catText: { fontWeight: "600", color: "#333" },

  listContainer: { padding: 15 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E46A11",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
  },

  image: { width: "100%", height: 180 },

  foodInfo: { padding: 15 },
  name: { fontSize: 18, fontWeight: "700" },
  desc: { color: "#666", marginVertical: 5 },
  price: { fontSize: 17, color: "#E46A11", fontWeight: "700" },

  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "700" },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});


