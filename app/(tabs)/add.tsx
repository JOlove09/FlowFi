import { ExpenseContext } from "@/context/ExpenseContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddExpense() {

  const context = useContext(ExpenseContext);
  const router = useRouter();

  if (!context) return null;

  const { addExpense } = context;

  const [amount, setAmount] = useState("");

  const [category, setCategory] =
    useState("");

  const [customCategory, setCustomCategory] =
    useState("");

  const [image, setImage] =
    useState<string | null>(null);

  const [base64Image, setBase64Image] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [date, setDate] =
    useState(new Date());

  const [showPicker, setShowPicker] =
    useState(false);

  // =========================
  // BACKEND URL
  // =========================

  const BASE_URL =
    "https://playtime-procurer-underdone.ngrok-free.dev";

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    { name: "Food", icon: "🍔" },
    { name: "Travel", icon: "✈️" },
    { name: "Shopping", icon: "🛍️" },
    { name: "Medical", icon: "⚕️" },
    { name: "Electricity", icon: "⚡" },
    { name: "Other", icon: "✨" },
  ];

  // =========================
  // PICK IMAGE
  // =========================

  const pickImage = async () => {

    try {

      const result =
        await ImagePicker.launchImageLibraryAsync({

          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,

          allowsEditing: false,

          quality: 1,

          base64: true,
        });

      if (!result.canceled) {

        const asset = result.assets[0];

        setImage(asset.uri);

        if (asset.base64) {

          setBase64Image(asset.base64);

        } else {

          Alert.alert(
            "Error",
            "Base64 image missing"
          );
        }
      }

    } catch (error) {

      console.log("IMAGE PICK ERROR:", error);
    }
  };

  // =========================
  // ANALYZE BILL
  // =========================

  const analyzeBill = async () => {

    if (!base64Image) {

      Alert.alert(
        "No Image",
        "Please select a bill image first"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/scan-bill`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            image:
              `data:image/jpeg;base64,${base64Image}`,
          }),
        }
      );

      const result = await response.json();

      console.log("FULL AI RESULT:", result);

      // =========================
      // AUTO SET AMOUNT
      // =========================

      if (result.amount) {

        setAmount(String(result.amount));
      }

      // =========================
      // AUTO SET CATEGORY
      // =========================

      if (result.category) {

        const predicted =
          result.category.toLowerCase();

        if (
          predicted.includes("food")
        ) {

          setCategory("Food");

        } else if (
          predicted.includes("travel")
        ) {

          setCategory("Travel");

        } else if (
          predicted.includes("shopping")
        ) {

          setCategory("Shopping");

        } else if (
          predicted.includes("medical")
        ) {

          setCategory("Medical");

        } else if (
          predicted.includes("electric")
        ) {

          setCategory("Electricity");

        } else {

          setCategory("Other");
        }
      }

      // =========================
      // AUTO SET DATE
      // =========================

if (result.date) {

  console.log("RAW DATE:", result.date);

  const parts = result.date.split("-");

  if (parts.length === 3) {

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);

    setDate(
      new Date(Date.UTC(year, month, day))
    );
  }
}

      Alert.alert(
        "AI Analysis Complete",
        `Amount: ₹${result.amount}\nCategory: ${result.category}`
      );

    } catch (error) {

      console.log("AI ERROR:", error);

      Alert.alert(
        "Error",
        "Failed to analyze bill"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // SAVE EXPENSE
  // =========================

  const saveExpense = () => {

    if (!amount) {

      Alert.alert(
        "Missing Amount",
        "Please enter amount"
      );

      return;
    }

    if (!category) {

      Alert.alert(
        "Missing Category",
        "Please select a category"
      );

      return;
    }

    const finalCategory =
      category === "Other"
        ? customCategory || "Other"
        : category;

    addExpense({
      amount,
      category: finalCategory,
      date: date.toISOString(),
    });

    setAmount("");
    setCategory("");
    setCustomCategory("");
    setImage(null);
    setBase64Image(null);
    setDate(new Date());

    router.back();
  };

  // =========================
  // UI
  // =========================

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={true}
    >

      <Text style={styles.brand}>
        FlowFi ✨
      </Text>

      <Text style={styles.title}>
        Add Expense
      </Text>

      {/* Amount */}

      <View style={styles.card}>

        <Text style={styles.label}>
          Amount
        </Text>

        <TextInput
          placeholder="₹ Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

      </View>

      {/* DATE */}

      <View style={styles.card}>

        <Text style={styles.label}>
          Expense Date
        </Text>

        {Platform.OS === "web" ? (

          <input
            type="date"
            value={date.toISOString().split("T")[0]}
            onChange={(e) =>
              setDate(new Date(e.target.value))
            }
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "none",
              backgroundColor: "#f1f3f6",
              fontSize: 16,
              outline: "none",
            }}
          />

        ) : (

          <>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >

              <Text style={styles.dateButtonText}>
                {date.toLocaleDateString("en-GB")}
              </Text>

            </TouchableOpacity>

            {showPicker && (

              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {

                  setShowPicker(false);

                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />

            )}

          </>

        )}

      </View>

      {/* OCR */}

      <View style={styles.card}>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={pickImage}
        >

          <Text style={styles.secondaryText}>
            📷 Pick Bill Image
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            { marginTop: 10 },
          ]}
          onPress={analyzeBill}
        >

          <Text style={styles.secondaryText}>

            {loading
              ? "Analyzing..."
              : "🔍 Analyze Bill"}

          </Text>

        </TouchableOpacity>

        {loading && (

          <ActivityIndicator
            size="large"
            style={{ marginTop: 15 }}
          />

        )}

      </View>

      {/* CATEGORY */}

      <View style={styles.card}>

        <Text style={styles.label}>
          Category
        </Text>

        <View style={styles.chips}>

          {categories.map((cat) => (

            <TouchableOpacity
              key={cat.name}
              style={[
                styles.chip,

                category === cat.name &&
                  styles.activeChip,
              ]}
              onPress={() =>
                setCategory(cat.name)
              }
            >

              <Text style={styles.icon}>
                {cat.icon}
              </Text>

              <Text
                style={[
                  styles.chipText,

                  category === cat.name &&
                    styles.activeText,
                ]}
              >

                {cat.name}

              </Text>

            </TouchableOpacity>

          ))}

        </View>

        {category === "Other" && (

          <TextInput
            placeholder="Custom category"
            value={customCategory}
            onChangeText={
              setCustomCategory
            }
            style={[
              styles.input,
              { marginTop: 10 },
            ]}
          />

        )}

      </View>

      {/* SAVE BUTTON */}

      <TouchableOpacity
        onPress={saveExpense}
      >

        <LinearGradient
          colors={["#6C63FF", "#8B7CFF"]}
          style={styles.saveBtn}
        >

          <Text style={styles.saveText}>
            Save Expense
          </Text>

        </LinearGradient>

      </TouchableOpacity>

      {/* IMAGE PREVIEW */}

{image && (

  <View style={styles.card}>

    <Text style={styles.previewTitle}>
      Bill Preview
    </Text>

    <Image
      source={{ uri: image }}
      style={styles.previewImage}
      resizeMode="contain"
    />

  </View>

)}  

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 20,
  },

  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C63FF",
    marginTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  label: {
    color: "#666",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#f1f3f6",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },

  dateButton: {
    backgroundColor: "#f1f3f6",
    padding: 14,
    borderRadius: 12,
  },

  dateButtonText: {
    fontSize: 16,
  },

  secondaryBtn: {
    backgroundColor: "#f1f3f6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryText: {
    fontWeight: "600",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: {
    backgroundColor: "#6C63FF",
  },

  chipText: {
    marginLeft: 6,
  },

  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  icon: {
    fontSize: 16,
  },

  saveBtn: {
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },


  previewImage: {
  width: "100%",
  height: 500,
  borderRadius: 12,
}
});