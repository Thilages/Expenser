import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { getRecentTransactions } from "@/lib/database";
import TransactionsCard from "../components/TransactionsCard";

const Transactions = () => {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const data = await getRecentTransactions(db);

      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

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

        <View className="relative h-full p-5 pt-20 justify-center items-center">
          {/* Top Bar */}
          <View className="w-48 rounded-xl px-4 flex-row items-center justify-center h-10 bg-[#202a32]">
            <AntDesign
              name="profile"
              color="white"
              className="mr-2"
              size={17}
            />
            <Text className="font-mregular text-white">Transactions</Text>
          </View>

          {/* Transactions List */}
          <FlatList
            data={Object.entries(transactions)}
            keyExtractor={([date], index) => `${date}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              paddingVertical: 16,
              gap: 12,
              paddingBottom: 60,
              width: 300, // Add gap for spacing
            }}
            renderItem={({ item: [date, transactions] }) => (
              <TransactionsCard date={date} transactions={transactions} />
            )}
            ListEmptyComponent={() => (
              <Text className="text-gray-400 mt-5">No transactions found.</Text>
            )}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Transactions;
