import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import {
  addDataToDB,
  getLastDate,
  storeDataFromJson,
  deleteAllData,
  getDataFromDB,
} from "../../lib/database";
import * as DocumentPicker from "expo-document-picker";
import { useSQLiteContext } from "expo-sqlite";

import { fetchSMSByNumber } from "../../lib/sms";

const AddTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [uri, setUri] = useState();
  const db = useSQLiteContext();

  const getTransactionFromJson = async () => {
    const result = await DocumentPicker.getDocumentAsync();

    if (result.canceled) {
      console.log("Document Selection Cancelled");
      return;
    } else {
      setUri(result.assets[0].uri);
    }
  };

  const extractFromSMS = async () => {
    try {
      setLoading(true);
      const lastDate = await getLastDate(db);
      console.log(lastDate);
      const messageTransactions = await fetchSMSByNumber(lastDate);
      console.log(messageTransactions);
      console.log("messages fetched");
      if (!messageTransactions || messageTransactions.length === 0) {
        console.log("No transactions found for the specified date.");
        return;
      }

      const result = await addDataToDB(db, messageTransactions);

      console.log("Data successfully added to the database.");
    } catch (error) {
      console.error("Error while extracting and saving SMS data:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    await deleteAllData(db);
  };

  return (
    <View style={{ backgroundColor: "#0B0D11" }} className="flex-1 p-4">
      <Text className="text-white text-2xl font-bold mb-4 text-center">
        Manage Transactions
      </Text>
      {loading ? <Text className="text-white">Loading</Text> : <></>}
      <TouchableOpacity
        onPress={getTransactionFromJson}
        className="bg-blue-500 py-3 rounded-lg mb-4"
      >
        <Text className="text-white text-center text-lg">Select JSON</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          setLoading(true); // Show loading indicator
          try {
            await storeDataFromJson(uri, db); // Wait for the operation to complete
          } catch (error) {
            console.error("Error while adding data to DB:", error); // Handle any errors
          } finally {
            setLoading(false); // Hide loading indicator
          }
        }}
        className="bg-green-500 py-3 rounded-lg mb-4"
      >
        <Text className="text-white text-center text-lg">Add to DB</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-yellow-500 py-3 rounded-lg mb-4"
        onPress={async () => await getDataFromDB(db)}
      >
        <Text className="text-black text-center text-lg">Get from DB</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleDelete}
        className="bg-red-500 py-3 rounded-lg mb-4"
      >
        <Text className="text-black text-center text-lg">delete Db</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={extractFromSMS}
        className="bg-purple-400 py-3 rounded-lg"
      >
        <Text className="text-black text-center text-lg">Get SMS</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTransactions;
