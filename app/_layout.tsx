import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { initializeDatabase } from "./../lib/database";
import "../global.css";
import { SQLiteProvider } from "expo-sqlite";
import { View } from "react-native";
import * as Font from "expo-font";
export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
        "Montserrat-BlackItalic": require("../assets/fonts/Montserrat-BlackItalic.ttf"),
        "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-BoldItalic": require("../assets/fonts/Montserrat-BoldItalic.ttf"),
        "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
        "Montserrat-ExtraBoldItalic": require("../assets/fonts/Montserrat-ExtraBoldItalic.ttf"),
        "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
        "Montserrat-ExtraLightItalic": require("../assets/fonts/Montserrat-ExtraLightItalic.ttf"),
        "Montserrat-Italic": require("../assets/fonts/Montserrat-Italic.ttf"),
        "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
        "Montserrat-LightItalic": require("../assets/fonts/Montserrat-LightItalic.ttf"),
        "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
        "Montserrat-MediumItalic": require("../assets/fonts/Montserrat-MediumItalic.ttf"),
        "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
        "Montserrat-SemiBoldItalic": require("../assets/fonts/Montserrat-SemiBoldItalic.ttf"),
        "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
        "Montserrat-ThinItalic": require("../assets/fonts/Montserrat-ThinItalic.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <SQLiteProvider
      databaseName="transaction.db"
      onInit={initializeDatabase} // Initialize database schema
      useSuspense={false} // Optional: Enable Suspense for async operations
      onError={(error) => console.error("Database error:", error)} // Handle errors
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
