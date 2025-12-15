import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  "http://localhost:5000";

export default function Admin() {
  const [tab, setTab] = useState("orders");

  const [foods, setFoods] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Add food
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<any>(null);

  // Editing
  const [editId, setEditId] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    loadFoods();
    loadOrders();
  }, []);

  const loadFoods = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/foods`);
      setFoods(await res.json());
    } catch {
      Alert.alert("Error", "Unable to load foods");
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/orders`);
      setOrders(await res.json());
    } catch {
      Alert.alert("Error", "Unable to load orders");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const addFood = async () => {
    if (!name || !price) return Alert.alert("Missing fields");

    const form = new FormData();
    form.append("name", name);
    form.append("description", desc);
    form.append("price", price);

    if (image) {
      form.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "food.jpg",
      } as any);
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/foods`, {
        method: "POST",
        body: form,
      });

      setLoading(false);

      if (res.ok) {
        Alert.alert("Success", "Food added!");
        setName("");
        setDesc("");
        setPrice("");
        setImage(null);
        loadFoods();
      } else {
        Alert.alert("Failed", "Food not added");
      }
    } catch {
      setLoading(false);
      Alert.alert("Error", "Upload failed");
    }
  };

  const deleteFood = async (id: any) => {
    await fetch(`${BASE_URL}/api/foods/${id}`, { method: "DELETE" });
    loadFoods();
  };

  const updateFood = async (id: any) => {
    await fetch(`${BASE_URL}/api/foods/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        price: editPrice,
      }),
    });

    setEditId(null);
    loadFoods();
  };

  const updateOrderStatus = async (id: any, status: string) => {
    await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadOrders();
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <LinearGradient colors={["#000", "#E46A11"]} style={styles.header}>
        <Text style={styles.headerText}>Admin Panel</Text>
      </LinearGradient>

      {/* TABS */}
      <View style={styles.tabs}>
        {["orders", "add", "manage"].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.activeTab]}>
              {t === "orders"
                ? "Orders"
                : t === "add"
                ? "Add Food"
                : "Manage Foods"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ORDERS */}
      {tab === "orders" && (
        <View style={{ padding: 15 }}>
          <FlatList
            scrollEnabled={false}
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <Text style={{ fontWeight: "800" }}>Order ID: {item._id}</Text>
                <Text>Status: {item.status}</Text>
                <Text>Total: ₦{item.totalPrice}</Text>

                <Text>Campus: {item.campus}</Text>
                <Text>Hostel: {item.hostel}</Text>
                <Text>Room: {item.roomNumber}</Text>
                <Text>Payment: {item.paymentMethod}</Text>

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => updateOrderStatus(item._id, "paid")}
                >
                  <Text style={styles.btnTxt}>Mark Paid</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "green" }]}
                  onPress={() => updateOrderStatus(item._id, "completed")}
                >
                  <Text style={styles.btnTxt}>Completed</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* ADD FOOD */}
      {tab === "add" && (
        <View style={{ padding: 15 }}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
          />

          <TouchableOpacity style={styles.upload} onPress={pickImage}>
            <Text>Pick Image</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#E46A11" />
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={addFood}>
              <Text style={styles.addTxt}>Add Food</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* MANAGE FOOD */}
      {tab === "manage" && (
        <View style={{ padding: 15 }}>
          <FlatList
            scrollEnabled={false}
            data={foods}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.foodCard}>
                <Image
                  source={{ uri: `${BASE_URL}${item.image}` }}
                  style={styles.foodImg}
                />

                {editId === item._id ? (
                  <>
                    <TextInput
                      value={editName}
                      onChangeText={setEditName}
                      style={styles.input}
                    />
                    <TextInput
                      value={editPrice}
                      onChangeText={setEditPrice}
                      style={styles.input}
                    />

                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={() => updateFood(item._id)}
                    >
                      <Text style={styles.btnTxt}>Save</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodPrice}>₦{item.price}</Text>

                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: "red" }]}
                      onPress={() => deleteFood(item._id)}
                    >
                      <Text style={styles.btnTxt}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: "orange" }]}
                      onPress={() => {
                        setEditId(item._id);
                        setEditName(item.name);
                        setEditPrice(item.price.toString());
                      }}
                    >
                      <Text style={styles.btnTxt}>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 25,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  tabText: { fontSize: 16, fontWeight: "600", color: "#777" },
  activeTab: { color: "#E46A11", textDecorationLine: "underline" },

  orderCard: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  btnTxt: { color: "#fff", textAlign: "center", fontWeight: "700" },

  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  upload: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#E46A11",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  addTxt: { textAlign: "center", color: "#fff", fontWeight: "700" },

  foodCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  foodImg: { width: "100%", height: 150, borderRadius: 10 },

  foodName: { fontSize: 18, fontWeight: "700" },
  foodPrice: { fontSize: 16, color: "#E46A11", marginVertical: 6 },

  saveBtn: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
});
