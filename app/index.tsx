import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Cart from "./Cart";
import Home from "./Home";
import Orders from "./Orders";
import Profile from "./Profile";
import Admin from "./admin";
import Login from "./login";
import Signup from "./signup";

export default function Index() {
  const [screen, setScreen] = useState("Home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load stored user
  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    };
    loadUser();
  }, []);

  // Fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [screen]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E46A11" />
      </View>
    );
  }

  // If not logged in
  if (!user) {
    return showSignup ? (
      <Signup setShowSignup={setShowSignup} />
    ) : (
      <Login setShowSignup={setShowSignup} setUser={setUser} />
    );
  }

  // Screens
  const renderScreen = () => {
    switch (screen) {
      case "Cart":
        return <Cart user={user} />;

      case "Orders":
        return <Orders user={user} />;

      case "Profile":
        // FIX: Added setScreen here
        return (
          <Profile
            user={user}
            setUser={setUser}
            setScreen={setScreen}
          />
        );

      case "Admin":
        if (!user?.isAdmin) {
          return <Home user={user} />;
        }
        return <Admin />;

      default:
        return <Home user={user} />;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {renderScreen()}
      </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        {["Home", "Cart", "Orders", "Profile"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setScreen(tab)}>
            <Text
              style={[
                styles.tab,
                screen === tab ? styles.activeTab : undefined,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Show Admin tab only if user is admin */}
        {user?.isAdmin && (
          <TouchableOpacity onPress={() => setScreen("Admin")}>
            <Text
              style={[
                styles.tab,
                screen === "Admin" ? styles.activeTab : undefined,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    paddingVertical: 12,
  },
  tab: { color: "#fff", fontWeight: "600", fontSize: 14 },
  activeTab: { color: "#E46A11", textDecorationLine: "underline" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

