import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import { SimpleLineIcons } from "@expo/vector-icons";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarButton: (props) => (
          <TouchableOpacity {...props} activeOpacity={1} />
        ),

        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          margin: 0,
          padding: 0,
          transform: [{ translateX: 93 }],
          paddingBottom: 0,
          paddingTop: 0,
          width: 170,
          height: 55,
          borderRadius: 50,
          backgroundColor: "#11191F",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderColor: "transparent",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarItemStyle: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <SimpleLineIcons
              name="home"
              size={19}
              color={focused ? "#68DED1" : "#778085"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <SimpleLineIcons
              name="pie-chart"
              size={20}
              color={focused ? "#68DED1" : "#778085"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="addTransactions"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <SimpleLineIcons
              name="plus"
              size={21}
              color={focused ? "#68DED1" : "#778085"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
