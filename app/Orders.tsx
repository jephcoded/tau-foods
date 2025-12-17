import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  "https://tau-foods.onrender.com";

export default function Orders({ user }: any) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();

    // Auto refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${BASE_URL}/api/orders/${user._id}`, { headers });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      Alert.alert("Error", "Unable to fetch orders");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.foodText}>
              {item.items[0]?.name} × {item.items[0]?.quantity}
            </Text>

            <Text style={styles.info}>
              Total: ₦{item.totalPrice}
            </Text>

            {/* LOCATION */}
            <Text style={styles.info}>
              Location: {item.campus}, {item.hostel}, {item.roomNumber}
            </Text>

            {/* PAYMENT METHOD */}
            <Text style={styles.info}>
              Payment: {item.paymentMethod}
            </Text>

            {/* STATUS */}
            <Text
              style={[
                styles.status,
                item.status === "completed"
                  ? styles.statusCompleted
                  : item.status === "paid"
                  ? styles.statusPaid
                  : styles.statusPending,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>

            <Text style={styles.date}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: {
    fontSize: 22,
    color: "#E46A11",
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  foodText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  status: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
  },
  statusPending: { backgroundColor: "gray" },
  statusPaid: { backgroundColor: "orange" },
  statusCompleted: { backgroundColor: "green" },
  date: {
    color: "#555",
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },
});
