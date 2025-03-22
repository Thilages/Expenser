import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { getWeeklyTransaction } from "@/lib/database";
import { useSQLiteContext } from "expo-sqlite";

const WeeklyBar = () => {
  const [weeklyData, setweeklyData] = useState([]);
  const db = useSQLiteContext();

  useEffect(() => {
    getWeeklyData();
  }, []);

  const getWeeklyData = async () => {
    const data = await getWeeklyTransaction(db);
    setweeklyData(data);
  };

  // const weeklyData = [
  //   {
  //     label: "Mon",
  //     value: 200,
  //     frontColor: "#68DED1",
  //   },
  //   { label: "Tue", value: 150, frontColor: "#68DED1" },
  //   { label: "Wed", value: 250, frontColor: "#68DED1" },
  //   { label: "Thu", value: 120, frontColor: "#68DED1" },
  //   {
  //     label: "Fri",
  //     value: 280,
  //     frontColor: "#68DED1",
  //   },
  //   { label: "Sat", value: 190, frontColor: "#68DED1" },
  //   { label: "Sun", value: 200, frontColor: "#68DED1" },
  // ];

  return (
    <View className=" py-4 px-5 flex items-center justify-center">
      <BarChart
        data={weeklyData}
        barWidth={14} // Adjust bar width for aesthetics
        barBorderRadius={6}
        // Rounded corners for bars
        spacing={30} // Spacing between bars
        xAxisLabelTextStyle={{
          color: "#A3B3C5", // X-axis label color
          fontSize: 12,
        }}
        hideOrigin
        animationDuration={600}
        isAnimated
        yAxisThickness={0}
        xAxisThickness={0} // Hide Y-axis line
        hideRules={true} // Hide grid rules
        noOfSections={1} // Adjust sections for better scaling
        initialSpacing={70} // Add padding at the start
        backgroundColor="transparent" // Match the card's background
        activeOpacity={0.8} // Smooth interaction
        hideYAxisText={true} // Hide Y-axis labels if needed
        height={135}
        // Make the bars more visually appealing
      />
    </View>
  );
};

export default WeeklyBar;
