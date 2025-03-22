import { PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';


export const fetchSMSByNumber = async (lastdate) => {
  const hasPermission = await requestSMSPermissions();
  if (!hasPermission) {
    console.log("SMS permission denied");
    return [];
  }

  const [y, m, d] = lastdate.split("-");
  const date = new Date(y, m - 1, d);
  const minDate = date.getTime();
  console.log("Min Date (UNIX):", minDate);

  const filter = {
    box: "inbox",
    minDate: minDate,
    indexFrom: 0,
    maxCount: 1000000,
  };

  return new Promise((resolve, reject) => {
    try {
      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.log("Failed to fetch SMS:", fail);
          reject(fail);
        },
        (count, smsList) => {
          console.log(`Total SMS fetched: ${count}`);

          const messages = JSON.parse(smsList);

          // Filter SMS messages from SBI UPI
          const filteredMessages = messages.filter((message) =>
            /^.{2,4}-SBIUPI$/.test(message.address)
          );

          const extractedDetails = filteredMessages.map((message) => {
            const lowerMessage = message.body.toLowerCase();
            const type = lowerMessage.includes("debit")
              ? "debit"
              : lowerMessage.includes("credit")
                ? "credit"
                : null;

            if (!type) return null;

            const amountMatch = message.body.match(
              /(?:debited\s*by|credited\s*by|by\s*Rs\.?|Rs\.?)\s*([0-9]+(?:\.[0-9]{1,2})?)/i
            );
            const refnoMatch = message.body.match(/\b\d{12}\b/);
            const nameMatch = lowerMessage.match(
              /(?:to|from)\s*([\w\s.]+?)(?=\s*ref\s*no|$)/i
            );


            const name = nameMatch ? nameMatch[1].trim() : "Unknown";

            // Convert UNIX timestamp to readable date
            const date = new Date(message.date)
              .toISOString()
              .split("T")[0]

            return {
              type: type,
              amount: amountMatch ? parseFloat(amountMatch[1]) : null,
              refno: refnoMatch ? refnoMatch[0] : null,
              name: name,
              date: date,
            };
          });

          // Filter out null or incomplete details
          const validTransactions = extractedDetails.filter(
            (detail) =>
              detail &&
              detail.type &&
              detail.amount &&
              detail.refno &&
              detail.name &&
              detail.date
          );

          resolve(validTransactions);
        }
      );
    } catch (error) {
      console.error("Error while fetching SMS:", error);
      reject(error);
    }
  });
};

export const requestSMSPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to your SMS to process transactions.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};
