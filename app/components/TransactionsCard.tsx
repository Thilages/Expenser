import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const TransactionsCard = ({ date, transactions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  let total = 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  transactions.forEach((item) => {
    if (item.type == "credit") {
      total += item.amount;
    } else {
      total -= item.amount;
    }
  });
  const disFont = (disp) => {
    let totalDisp;
    if (disp > 0) {
      totalDisp = `+₹${Number(disp)}`;
    } else {
      totalDisp = `-₹${Math.abs(Number(disp))}`;
    }
    return totalDisp;
  };

  return (
    <View
      style={{ width: 300 }}
      className="w-full flex relative justify-between backdrop-blur-lg bg-[#2b3a42]/50  rounded-lg pr-3 my-1 shadow-lg"
    >
      {/* Header Row */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row justify-between items-center p-3"
      >
        {/* Date Section */}
        <View className="w-14 h-14 bg-[#68DED1] justify-center items-center rounded-lg">
          <Text className="text-black white font-msemibold text-sm">
            {formatDate(date).split(" ")[0]}
          </Text>
          <Text className="text-black font-mbold text-xl">
            {formatDate(date).split(" ")[1]}
          </Text>
        </View>

        {/* Info Section */}
        <View className="flex-1 flex-col justify-center ml-4">
          {/* Day of the Week */}
          <Text className="text-gray-400 font-mmedium text-sm">
            {new Date(date).toLocaleDateString("en-US", { weekday: "long" })}
          </Text>

          {/* Number of Transactions */}
          <Text className="text-gray-300 text-xs font-mextralight">
            {transactions.length}{" "}
            {transactions.length === 1 ? "Transaction" : "Transactions"}
          </Text>
        </View>

        {/* Amount Section */}
        <Text
          className={`font-mmedium text-lg font-semibold ${
            total > 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {disFont(total)}
        </Text>
      </TouchableOpacity>

      {isExpanded && <View className="h-[0.4px] bg-white mx-5 my-2"></View>}

      {/* Expandable Section */}
      {isExpanded ? (
        transactions.map((item, index) => (
          <View
            key={index}
            className={`px-8 py-2 justify-between items-center flex-row relative `}
          >
            <View>
              <Text className="text-white font-msemibold ">
                {item.name.toUpperCase()}
              </Text>
              <Text className="text-xs font-mextralight text-white">
                Ref.no:{item.refno}
              </Text>
            </View>

            <Text
              className={` font-mmedium ${
                item.type === "credit" ? "text-green-300" : "text-red-400"
              }`}
            >
              ₹{item.amount}
            </Text>
          </View>
        ))
      ) : (
        <></>
      )}
    </View>
  );
};

export default TransactionsCard;
