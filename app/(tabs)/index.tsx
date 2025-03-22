import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, ScrollView, View, Text, StatusBar } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MontlyCard from "../components/MontlyCard";
import BarGraph from "./../components/BarGraph";
import DailyCard from "../components/DailyCard";
import { useEffect } from "react";
import { router } from "expo-router";

export default function App() {
  return (
    <LinearGradient
      colors={["#161c23", "#2a343c"]}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView className="h-full">
        <StatusBar
          translucent
          backgroundColor="#161c23"
          barStyle="light-content"
        />
        <ScrollView className="min-h-full">
          <View className="relative h-full p-5 pt-20 justify-center items-center">
            {/* top bar */}
            <View className="w-48 rounded-xl px-4 flex-row items-center justify-center h-10 bg-[#202a32]">
              <Entypo name="bar-graph" color="white" className="mr-2" />
              <Text className="font-mregular text-white">Overview</Text>
            </View>
            {/* Monthly card */}
            <MontlyCard />
            {/* bargraph */}
            <BarGraph />
            {/* dailycard */}
            <DailyCard />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
