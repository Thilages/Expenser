import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import WeeklyBar from "./WeeklyBar";
import MonthlyBar from "./MonthlyBar";
import YearlyBar from "./YearlyBar";

const BarGraph = () => {
  const [selected, setSelected] = useState("Week");

  const options = ["Week", "Month", "Year"];

  return (
    <View className="mt-10 flex-col  justify-center items-center">
      {/* Selection Bar */}
      <View className="rounded-xl flex-row justify-center items-center gap-2 bg-[#202a32] px-4 py-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelected(option)}
            className={`px-3 py-2 rounded-lg ${
              selected === option ? "bg-[#68DED1]" : "bg-[#202a32]"
            }`}
          >
            <Text
              className={`${
                selected === option
                  ? "text-[#161c23] font-msemibold text-sm"
                  : "text-gray-400 font-mregular text-xs"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selected === "Week" ? (
        <WeeklyBar />
      ) : selected === "Month" ? (
        <MonthlyBar />
      ) : (
        <YearlyBar />
      )}
    </View>
  );
};

export default BarGraph;
