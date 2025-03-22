import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const MonthlyBar = () => {
  const pieData = [
    { value: 1200, label: "Week 1", color: "#68DED1" },
    { value: 900, label: "Week 2", color: "#4FB8A7" },
    { value: 1100, label: "Week 3", color: "#3A8274" },
    { value: 1500, label: "Week 4", color: "#2A5C50" },
  ];

  return (
    <View className="flex items-center justify-center mt-4">
      <PieChart
        data={pieData}
        radius={80} // Size of the pie chart
        donut
        // Border around the pie chart
        showText // Display percentages
        textColor="#FFFFFF" // Text color inside the pie chart
        textSize={10} // Percentage text size
        strokeWidth={2} // Add a slight stroke around slices
      />
    </View>
  );
};

export default MonthlyBar;
