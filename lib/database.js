import * as SQLite from 'expo-sqlite';


export const extractData = async (uri) => {

  let allTransactions = []
  const response = await fetch(uri)
  const jsonData = await response.json()


  for (const date in jsonData) {
    jsonData[date].forEach((item => {
      const formatedTransaction = {
        date: date,
        type: item.type,
        amount: item.amount,
        refno: item.refno,
        name: item.name
      }
      allTransactions.push(formatedTransaction)
    }))
  }

  console.log(allTransactions)
  return allTransactions
}

export const initializeDatabase = async (db) => {
  try {
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        refno TEXT NOT NULL,
        name TEXT NOT NULL
      );`
    );
  } catch (error) {
    console.log(error)
  }
};

export const storeDataFromJson = async (uri, db) => {

  const data = await extractData(uri)
  try {

    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid data provided. Expecting a non-empty array.");
      return;
    }
    const uniqueDates = [...new Set(data.map(transaction => transaction.date))];

    for (const uniqueDate of uniqueDates) {
      console.log(uniqueDate, "unique");
      await db.runAsync('DELETE FROM transactions WHERE date = ?', [uniqueDate]);
    }


    for (const date in data) {

      const transaction = data[date]
      console.log(transaction)
      const result = await db.runAsync('INSERT INTO transactions (date, amount, name, refno, type) VALUES (?, ?, ?, ?,?)',
        transaction.date, transaction.amount, transaction.name, transaction.refno, transaction.type);
      console.log(result.lastInsertRowId, result.changes)

    }


  } catch (error) {
    console.log(error)
  }
};

export const getLastDate = async (db) => {

  try {
    console.log("works")
    const result = await db.getFirstAsync('SELECT * FROM transactions ORDER BY date DESC')

    return result.date
  } catch (error) {
    console.log(error)
  }
}

export const addDataToDB = async (db, data) => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid data provided. Expecting a non-empty array.");
      return;
    }

    const uniqueDates = [...new Set(data.map(transaction => transaction.date))];

    for (const uniqueDate of uniqueDates) {
      console.log(uniqueDate, "unique");
      await db.runAsync('DELETE FROM transactions WHERE date = ?', [uniqueDate]);
    }


    for (const date in data) {
      const transaction = data[date]
      // console.log(transaction)
      const result = await db.runAsync('INSERT INTO transactions (date, amount, name, refno, type) VALUES (?, ?, ?, ?,?)',
        transaction.date, transaction.amount, transaction.name, transaction.refno, transaction.type);
      console.log(result.lastInsertRowId, result.changes)
    }


  } catch (error) {
    console.log(error)
  }
}


export const deleteAllData = async (db) => {
  await db.runAsync('DELETE FROM transactions')
  console.log("deleted successfully")
}


export const getDataFromDB = async (db) => {
  const result = await db.getAllAsync('SELECT * FROM transactions WHERE date LIKE ? ORDER BY date DESC',
    ['2025-02%'])
  result.forEach((item) => console.log(item, "\n"))
  console.log("\n")

}

export const manuallyAddDataToDB = async (transaction, db) => {
  try {
    const result = await db.runAsync('INSERT INTO transactions (date, amount, name, refno, type) VALUES (?, ?, ?, ?,?)',
      transaction.date, transaction.amount, transaction.name, transaction.refno, transaction.type);
  } catch (error) {

  }
}

export const getRecentTransactions = async (db, offset) => {
  const transactions = {}
  try {
    const data = await db.getAllAsync("SELECT * FROM transactions ORDER BY date DESC LIMIT 50")
    await data.forEach((item) => {
      if (!transactions[item.date]) {
        transactions[item.date] = []
      }
      transactions[item.date].push(item)
    })
    return transactions

  } catch (error) {
    console.log(error)
  }
}

export const getWeeklyTransaction = async (db) => {
  const weeklyTransaction = {};
  let sevenDayEarlier = new Date();

  sevenDayEarlier.setDate(sevenDayEarlier.getDate() - 7);
  sevenDayEarlier = sevenDayEarlier.toISOString().split("T")[0];

  try {
    const data = await db.getAllAsync(
      "SELECT * FROM transactions WHERE date > ? ORDER BY date ASC",
      sevenDayEarlier
    );

    // Create a summary object to calculate totals
    const weeklySummary = {};

    data.forEach((item) => {
      const day = getWeekDay(item.date);

      // Initialize the day's amount if not already present
      if (!weeklySummary[day]) {
        weeklySummary[day] = 0;
      }

      // Add the amount (normal value, not absolute here)
      weeklySummary[day] += item.amount;
    });

    // Convert the summary object to an array of {label, value} objects with absolute values
    const result = Object.entries(weeklySummary).map(([day, total]) => ({
      label: day,
      value: Math.abs(total),
      frontColor: "#68DED1" // Ensure absolute value
    }));


    return result; // Return the array of objects
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getWeekDay = (receivedDate) => {
  const date = new Date(receivedDate);
  const day = date.toLocaleDateString("en-US", { weekday: "short" }); // Example: "Mon", "Tue", etc.
  return day;
};


export const getMonthlyData = async (db) => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1); // Set the day to 1
  const TfirstDay = firstDay.toISOString().split("T")[0];
  // console.log("First day of the month:", TfirstDay);

  try {
    const data = await db.getAllAsync(
      "SELECT * FROM transactions WHERE date > ? ORDER BY date ASC",
      [TfirstDay]
    );
    // console.log("Fetched data:", data);
    const total = getTotal(data);
    return [calculateSpendingData(total), total] // Process the fetched data
  } catch (error) {
    console.error("Error fetching monthly data:", error);
  }
};

const getTotal = (data) => {
  let total = 0; // Initialize total to zero

  data.forEach((item) => {
    try {
      let amount = item.amount;

      // Convert to string if it's not already, then sanitize
      if (typeof amount === "string") {
        amount = parseFloat(amount.replace(/,/g, '').trim());
      } else if (typeof amount === "number") {
        amount = parseFloat(amount); // No sanitization needed for numbers
      } else {
        console.log(`Invalid amount detected: ${item.amount}`);
        amount = 0; // Default to 0 for invalid values
      }


      if (!isNaN(amount)) {
        // Adjust total based on the transaction type
        if (item.type === "credit") {
          total += amount;
        } else {
          total -= amount;
        }
      } else {
        console.log(`Unable to parse amount: ${item.amount}`);
      }
    } catch (error) {
      console.error("Error processing item:", item, error);
    }
  });

  return Math.abs(total); // Return the absolute value of the total
};



const calculateSpendingData = (totalSpending, maxSpending = 12000) => {
  // Calculate the percentage of spending
  const spendingPercentage = (totalSpending / maxSpending) * 100;

  // Ensure the spending percentage does not exceed 100%
  const limitedSpendingPercentage = Math.min(spendingPercentage, 100);

  // Calculate the remaining percentage
  const remainingPercentage = 100 - limitedSpendingPercentage;

  // Prepare the data for the chart
  const spendingData = [
    { value: limitedSpendingPercentage, color: "#68DED1" }, // Spent amount
    { value: remainingPercentage, color: "#161c23" }, // Remaining amount
  ];

  return spendingData;
};


export const getLastMonthTotal = async (db) => {
  const date = new Date()
  const newDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).toISOString().split("T")[0]
  const lastMonthStart = new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString().split("T")[0]

  const data = await db.getAllAsync("SELECT * FROM transactions WHERE date > ? and date < ?", [lastMonthStart, newDate])
  // console.log(data)
  const total = getTotal(data)
  return total
  // const data = await db.getAllAsync("")
}

export const getTodaySpending = async (db) => {
  const date = new Date()
  const newDate = date.toISOString().split("T")[0]
  const data = await db.getAllAsync("SELECT * FROM transactions WHERE date >= ?", newDate)
  const total = getTotal(data)
  return total
}

