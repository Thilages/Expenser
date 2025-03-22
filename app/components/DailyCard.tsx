import { getTodaySpending } from "@/lib/database";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

const DailyCard = () => {
  const [spending, setspending] = useState(69);
  const [percentage, setpercentage] = useState(6.9);
  const db = useSQLiteContext();
  useEffect(() => {
    fetchDailyData();
  }, []);

  const fetchDailyData = async () => {
    const data = await getTodaySpending(db);
    setspending(data);
    const percent = (data / 220) * 100;
    setpercentage(Math.round(percent));
  };

  return (
    <View
      className=" px-4 py-8 w-full relative mt-6 rounded-2xl border bg-[#11191F] border-slate-700 backdrop-blur-10"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <Text className="text-gray-300 text-sm font-mlight">
        Today's Spending
      </Text>
      <Text className="text-white text-2xl font-msemibold mt-2">
        ₹{Math.round(spending)}.00
      </Text>
      <View className="mt-3">
        <Progress.Bar
          progress={percentage / 100}
          width={290}
          color="#68DED1"
          unfilledColor="#161c23"
          borderColor="transparent"
        />
      </View>
      <Text className="text-white absolute font-mextralight text-xs right-10 bottom-10">
        {percentage}% of ₹220
      </Text>
    </View>
  );
};

export default DailyCard;
