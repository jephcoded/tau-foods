import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  "https://tau-foods.onrender.com";

export default function Cart({ user }: any) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [takeaway, setTakeaway] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // LOCATION
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [campus, setCampus] = useState("");
  const [hostel, setHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  // Load cart whenever screen opens
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    const data = await AsyncStorage.getItem("cart");
    if (data) setCartItems(JSON.parse(data));
  };

  // Update quantity
  const updateQuantity = (index: number, change: number) => {
    const updated = [...cartItems];
    updated[index].quantity += change;

    if (updated[index].quantity < 1) updated[index].quantity = 1;

    setCartItems(updated);
    AsyncStorage.setItem("cart", JSON.stringify(updated));
  };

  // Total
  const total =
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) +
    (takeaway ? 200 : 0);

  const handleCheckout = () => setShowLocationModal(true);

  const handleBankTransfer = async () => {
  
    if (!campus || !hostel || !roomNumber) return Alert.alert("Error", "Please fill location fields before proceeding");

    try {
      const token = await AsyncStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: user._id,
          items: cartItems,
          totalPrice: total,
          campus,
          hostel,
          roomNumber,
          paymentMethod: "Bank Transfer",
        }),
      });

      if (res.ok) {
        await AsyncStorage.removeItem("cart");
        setCartItems([]);
        setShowLocationModal(false);
        Alert.alert(
          "Order Placed",
          `Please transfer to account 7012053526 and tap 'Mark Paid' when you have transferred.`
        );
      } else {
        Alert.alert("Failed", "Could not place order");
      }
    } catch (err) {
      Alert.alert("Error", "Server error");
    }
  };

  const submitOrder = async () => {
    if (!campus || !hostel || !roomNumber)
      return Alert.alert("Error", "Please fill all fields");

    try {
      const token = await AsyncStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: user._id,
          items: cartItems,
          totalPrice: total,
          campus,
          hostel,
          roomNumber,
          paymentMethod,
        }),
      });

      if (res.ok) {
        Alert.alert("Order Placed!", "Your food is on the way!");

        await AsyncStorage.removeItem("cart");
        setCartItems([]);
        setShowLocationModal(false);
      } else {
        Alert.alert("Error", "Unable to place order");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Your Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(i, ind) => ind.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₦{item.price}</Text>

            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(index, -1)}
              >
                <Text style={styles.qtyTxt}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyNumber}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(index, 1)}
              >
                <Text style={styles.qtyTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* TAKEAWAY */}
      <TouchableOpacity
        style={styles.takeawayBox}
        onPress={() => setTakeaway(!takeaway)}
      >
        <Text style={styles.takeawayTxt}>Takeaway (+₦200)</Text>
        <Text>{takeaway ? "✔" : "○"}</Text>
      </TouchableOpacity>

      {/* PAYMENT */}
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentRow}>
        {["Cash", "Transfer", "POS"].map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.payBtn,
              paymentMethod === m && styles.payActive,
            ]}
            onPress={() => setPaymentMethod(m)}
          >
            <Text
              style={[
                styles.payTxt,
                paymentMethod === m && styles.payTxtActive,
              ]}
            >
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.total}>Total: ₦{total}</Text>

      <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
        <Text style={styles.checkoutTxt}>Confirm Order</Text>
      </TouchableOpacity>

      {/* LOCATION MODAL */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalHeader}>Delivery Location</Text>

            <Text style={styles.label}>Campus</Text>
            <View style={styles.row}>
              {["West Campus", "East Campus"].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.choiceBtn,
                    campus === c && styles.choiceActive,
                  ]}
                  onPress={() => setCampus(c)}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Hostel</Text>
            <View style={styles.row}>
              {["Boys Hostel", "Girls Hostel"].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[
                    styles.choiceBtn,
                    hostel === h && styles.choiceActive,
                  ]}
                  onPress={() => setHostel(h)}
                >
                  <Text>{h}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Room Number</Text>
            <TextInput
              style={styles.input}
              placeholder="215"
              value={roomNumber}
              onChangeText={setRoomNumber}
            />

            <TouchableOpacity style={styles.placeBtn} onPress={submitOrder}>
              <Text style={styles.placeTxt}>Place Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =================== STYLES ===================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E46A11",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "700" },
  price: { color: "#E46A11", fontSize: 16, marginTop: 3 },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtyBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qtyTxt: { color: "#fff", fontSize: 20 },
  qtyNumber: { marginHorizontal: 15, fontSize: 18 },

  takeawayBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  takeawayTxt: { fontWeight: "600", fontSize: 15 },

  sectionTitle: { marginTop: 20, fontWeight: "700", fontSize: 16 },

  paymentRow: { flexDirection: "row", gap: 10, marginVertical: 10 },
  payBtn: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  payActive: { backgroundColor: "#E46A11" },
  payTxt: { color: "#000" },
  payTxtActive: { color: "#fff", fontWeight: "700" },

  total: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 15,
  },

  checkoutBtn: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
  },
  checkoutTxt: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  // MODAL
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalHeader: { fontSize: 20, fontWeight: "800", marginBottom: 15 },

  label: { marginTop: 10, fontWeight: "600", fontSize: 15 },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },

  choiceBtn: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  choiceActive: { backgroundColor: "#E46A11" },

  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  placeBtn: {
    backgroundColor: "#E46A11",
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
  },
  placeTxt: { color: "#fff", textAlign: "center", fontWeight: "700" },

  cancelBtn: { padding: 10 },
  cancelTxt: { textAlign: "center", fontWeight: "600" },
});

