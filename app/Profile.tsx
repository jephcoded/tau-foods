import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  "http://localhost:5000";

export default function Profile({ user, setUser, setScreen }: any) {
  const [profile, setProfile] = useState<any>(null);

  // Modals
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Edit profile fields
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Password change fields
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = user.token;
      const res = await fetch(`${BASE_URL}/api/users/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
      setNewName(data.name);
      setNewEmail(data.email);
    } catch (err) {
      Alert.alert("Error", "Unable to fetch profile");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });

      if (res.ok) {
        Alert.alert("Success", "Profile updated");
        setEditVisible(false);
        fetchProfile();
      } else {
        Alert.alert("Failed", "Error updating profile");
      }
    } catch (err) {
      Alert.alert("Error", "Server Error");
    }
  };

  const changePassword = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/users/change-password/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            oldPassword: oldPass,
            newPassword: newPass,
          }),
        }
      );

      if (res.ok) {
        Alert.alert("Success", "Password changed");
        setPasswordVisible(false);
      } else {
        Alert.alert("Failed", "Incorrect password");
      }
    } catch (err) {
      Alert.alert("Error", "Unable to change password");
    }
  };

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setEditVisible(true)}
      >
        <Text style={styles.optionText}>✏️ Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setPasswordVisible(true)}
      >
        <Text style={styles.optionText}>🔐 Change Password</Text>
      </TouchableOpacity>

      {/* ADMIN BUTTON (ONLY YOU) */}
      {profile.email === "okezie@gmail.com" && (
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => setScreen("Admin")}
        >
          <Text style={styles.adminText}>🛠️ Go To Admin Panel</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Name"
              style={styles.input}
            />

            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Email"
              style={styles.input}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setEditVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={passwordVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              value={oldPass}
              onChangeText={setOldPass}
              secureTextEntry
              placeholder="Old Password"
              style={styles.input}
            />

            <TextInput
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry
              placeholder="New Password"
              style={styles.input}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={changePassword}>
              <Text style={styles.saveText}>Change</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setPasswordVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#E46A11",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  label: { color: "#777", marginTop: 5 },
  value: { fontSize: 18, fontWeight: "700" },

  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: { fontSize: 16, fontWeight: "600" },

  adminBtn: {
    backgroundColor: "#E46A11",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  adminText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  logoutBtn: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: { color: "#fff", textAlign: "center", fontWeight: "700" },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 15 },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#E46A11",
    padding: 12,
    borderRadius: 10,
  },
  saveText: { textAlign: "center", color: "#fff", fontWeight: "700" },
  cancelBtn: { marginTop: 10 },
  cancelText: { textAlign: "center", fontWeight: "700" },
});
