import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-gifted-charts/dist/PieChart";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getLastMonthTotal, getMonthlyData } from "@/lib/database";
import { useSQLiteContext } from "expo-sqlite";

const MontlyCard = () => {
  const [spendingData, setspendingData] = useState([]);
  const [total, settotal] = useState(6969);
  const [monthDiff, setmonthDiff] = useState(12);
  const db = useSQLiteContext();
  const date = new Date();
  const fullMonthName = date.toLocaleString("en-US", { month: "long" });

  useEffect(() => {
    fethcMonthlyData();
  }, []);

  const fethcMonthlyData = async () => {
    try {
      const [currentMonthData, currentMonthTotal] = await getMonthlyData(db);

      const lastMonthTotal = await getLastMonthTotal(db);

      const percentageDifference = (
        ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) *
        100
      ).toFixed(2);

      const isIncrease = currentMonthTotal > lastMonthTotal;

      setspendingData(currentMonthData);
      settotal(currentMonthTotal);
      setmonthDiff({ value: Math.abs(percentageDifference), isIncrease });
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  return (
    <View
      className="h-32 px-4 py-3 relative w-full justify-between mt-7 rounded-2xl border bg-[#272f35] border-slate-700 backdrop-blur-10"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <View className="flex flex-row justify-between items-center h-full">
        {/* Left Section */}
        <View className="flex flex-col ">
          <Text className="text-white text-sm font-mextralight">
            {fullMonthName}
          </Text>
          <View className="mt-1 flex-row">
            <Text className="text-white text-3xl   font-msemibold">
              ₹{Math.round(total)}.00
            </Text>
          </View>
          <View className="flex-row mt-3">
            <View className="flex-row justify-center items-center">
              <AntDesign
                name={monthDiff.isIncrease ? "upcircle" : "downcircle"}
                className="mr-1"
                color={monthDiff.isIncrease ? "red" : "green"}
              />
              <Text className="text-white font-mlight text-sm">
                {monthDiff.isIncrease ? "Increased" : "Decreased"} by{" "}
                <Text className="font-msemibold">{monthDiff.value}%</Text>
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: "#202a32",
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PieChart
            data={spendingData}
            radius={35}
            donut
            isAnimated
            animationDuration={500}
            innerCircleColor="#202a32"
            innerRadius={30}
            centerLabelComponent={() => (
              <Text className="text-white font-msemibold ml-1">
                {Math.round(spendingData[0].value)}%
              </Text>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default MontlyCard;
