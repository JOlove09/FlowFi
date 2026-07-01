import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { Mic } from "lucide-react-native";
import FloatingAI from "../../components/FloatingAI";
import { useExpense } from "../context/ExpenseContext";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function HomeScreen() {

  const router = useRouter();
  

  const [budget, setBudget] = useState("20000");

  const [income, setIncome] = useState("35000");

  const [editingBudget, setEditingBudget] = useState(false);

  const [editingIncome, setEditingIncome] = useState(false);

  const [showQuestions, setShowQuestions] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);

  const [userMessage, setUserMessage] =
  useState("");

  const [chatMessages, setChatMessages] =
  useState([
    {
      sender: "bot",
      text: "Hi 👋 Ask me about your expenses.",
    },
  ]);

  const [fontsLoaded] = useFonts({
    CormorantBold: require("../../assets/fonts/CormorantGaramond-Bold.ttf"),

    CormorantMedium: require("../../assets/fonts/CormorantGaramond-Regular.ttf"),

    CormorantSemiBold: require("../../assets/fonts/CormorantGaramond-SemiBold.ttf"),
  });

  const expenseContext = useExpense();

  const expenses = expenseContext?.expenses || [];

  const totalExpenses = expenses.reduce(
    (sum: number, item: any) => sum + Number(item.amount),
    0
  );

  const budgetNumber = Number(budget);

  const budgetPercent = Math.min(
    (totalExpenses / budgetNumber) * 100,
    100
  );

  // REQUEST NOTIFICATION PERMISSION
  useEffect(() => {

    async function requestPermission() {

      if (Platform.OS === "web") return;

      const { status } =
        await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        alert("Please enable notifications");
      }
    }

    requestPermission();

  }, []);

  // BUDGET EXCEEDED ALERT
  useEffect(() => {

    async function sendBudgetAlert() {

      if (Platform.OS === "web") return;

      if (budgetPercent >= 100) {

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Budget Limit Exceeded ⚠️",
            body: "You crossed your monthly budget in FlowFi.",
          },
          trigger: null,
        });

      }
    }

    sendBudgetAlert();

  }, [budgetPercent]);

  const categoryTotals = useMemo(() => {

    const totals: any = {};

    expenses.forEach((expense: any) => {

      const category = expense.category || "Other";

      if (!totals[category]) {
        totals[category] = 0;
      }

      totals[category] += Number(expense.amount);

    });

    return Object.entries(totals)

      .map(([category, amount]) => ({
        category,
        amount: Number(amount),
      }))

      .sort((a: any, b: any) => b.amount - a.amount);

  }, [expenses]);

  const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech Recognition is not supported in this browser."
    );
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onstart = () => {
    console.log("Listening...");
  };

  recognition.onresult = (event: any) => {
    const transcript =
      event.results[0][0].transcript.toLowerCase();

    setUserMessage(transcript);

    console.log("You said:", transcript);
  };

  recognition.onerror = (event: any) => {
    console.log("Speech error:", event.error);
  };
};

  const sendMessage = () => {
  if (!userMessage.trim()) return;

  const message = userMessage.toLowerCase();

  let reply =
    "Sorry, I don't understand that yet.";

  if (message.includes("top category")) {
    if (categoryTotals.length > 0) {
      reply =
        `Your highest spending category is ${categoryTotals[0].category} (₹${categoryTotals[0].amount})`;
    }
  }

  else if (
    message.includes("category breakdown")
  ) {
    reply = categoryTotals
      .map(
        (item: any) =>
          `${item.category}: ₹${item.amount}`
      )
      .join("\n");
  }

  else if (
    message.includes("food")
  ) {
    const food = expenses
      .filter(
        (e: any) =>
          e.category === "Food"
      )
      .reduce(
        (
          sum: number,
          item: any
        ) =>
          sum +
          Number(item.amount),
        0
      );

    reply =
      `You spent ₹${food} on Food.`;
  }

  else if (
    message.includes("transactions")
  ) {
    reply =
      `You have ${expenses.length} transactions recorded.`;
  }

  else if (
    message.includes("highest expense")
  ) {
    if (expenses.length > 0) {
      const highest =
        expenses.reduce(
          (prev: any, current: any) =>
            Number(current.amount) >
            Number(prev.amount)
              ? current
              : prev
        );

      reply =
        `Your highest expense is ₹${highest.amount} in ${highest.category}.`;
    }
  }

  else if (
    message.includes("lowest expense")
  ) {
    if (expenses.length > 0) {
      const lowest =
        expenses.reduce(
          (prev: any, current: any) =>
            Number(current.amount) <
            Number(prev.amount)
              ? current
              : prev
        );

      reply =
        `Your lowest expense is ₹${lowest.amount} in ${lowest.category}.`;
    }
  }

  else if (
    message.includes("remaining budget")
  ) {
    const remaining =
      Number(budget) -
      totalExpenses;

    reply =
      `Your remaining budget is ₹${remaining.toFixed(
        2
      )}`;
  }

  else if (
  message.includes("savings advice") ||
  message.includes("save money")
) {

  if (categoryTotals.length > 0) {

    const topCategory =
      categoryTotals[0];

    const savings =
      topCategory.amount * 0.1;

    reply =
      `${topCategory.category} is your highest expense category. Reducing it by 10% could save ₹${savings.toFixed(2)}.`;
  }
}

else if (
  message.includes("overspending") ||
  message.includes("budget warning")
) {

  if (budgetPercent >= 100) {

    reply =
      "⚠️ You have exceeded your budget and are currently overspending.";

  } else if (
    budgetPercent >= 80
  ) {

    reply =
      `⚠️ You have used ${budgetPercent.toFixed(1)}% of your budget. Try to reduce spending.`;

  } else {

    reply =
      `✅ You are within budget. Only ${budgetPercent.toFixed(1)}% has been used.`;
  }
}

else if (
  message.includes("show insights") ||
  message.includes("insights")
) {

  const average =
    expenses.length > 0
      ? totalExpenses / expenses.length
      : 0;

  reply =
    `📊 Insights\n\nTop Category: ${
      categoryTotals[0]?.category || "N/A"
    }\nTransactions: ${
      expenses.length
    }\nAverage Expense: ₹${average.toFixed(
      2
    )}`;
}

  else if (
    message.includes("budget")
  ) {
    reply =
      `Your budget is ₹${budget}. You have used ${budgetPercent.toFixed(
        1
      )}% of it.`;
  }

  else if (
    message.includes("income")
  ) {
    reply =
      `Your income is ₹${income}.`;
  }

  else if (
    message.includes("total") ||
    message.includes("spending")
  ) {
    reply =
      `Your total spending is ₹${totalExpenses.toFixed(
        2
      )}`;
  }

  setChatMessages((prev) => [
  ...prev,
  {
    sender: "user",
    text: userMessage,
  },
  {
    sender: "bot",
    text: reply,
  },
]);

Speech.speak(reply, {
  voice: "Google UK English Female",
  rate: 0.85,
  pitch: 1.1,
});

setShowQuestions(false);

setUserMessage("");
};


  if (!fontsLoaded) {

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#eef7ff",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (

    <View
    style={{
      flex: 1,
      flexDirection: "row",
    }}
  >

    <ScrollView
  style={styles.container}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 160,
  }}
>

      {/* LOGO */}

      <View style={styles.logoContainer}>

        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View>

          <Text style={styles.logoText}>
            FlowFi
          </Text>

          <Text style={styles.logoSubText}>
            Smart Finance Companion
          </Text>

        </View>

      </View>

      {/* WELCOME */}

      <Text style={styles.welcome}>
        Welcome Back 👋
      </Text>

      <Text style={styles.snapshot}>
        Here is your financial snapshot !!
      </Text>

      {/* TOTAL EXPENSE CARD */}

      <LinearGradient
        colors={["#20d3c2", "#2f9cf4", "#7648f6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.totalCard}
      >

        <Text style={styles.cardTitle}>
          Total Expenses
        </Text>

        <Text style={styles.totalAmount}>
          ₹ {totalExpenses.toFixed(2)}
        </Text>

        <Text style={styles.cardSubtitle}>
          {budgetPercent.toFixed(1)}% of budget used
        </Text>

      </LinearGradient>

      {/* BUDGET + INCOME */}

      <View style={styles.row}>

        {/* BUDGET */}

        <View style={styles.smallCard}>

          <Text style={styles.smallTitle}>
            Budget
          </Text>

          {
            editingBudget ? (

              <TextInput
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                style={styles.input}
              />

            ) : (

              <Text style={styles.smallAmount}>
                ₹ {budget}
              </Text>

            )
          }

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setEditingBudget(!editingBudget)}
          >

            <Text style={styles.editBtnText}>
              {editingBudget ? "Save" : "Edit"}
            </Text>

          </TouchableOpacity>

        </View>

        {/* INCOME */}

        <View style={styles.smallCard}>

          <Text style={styles.smallTitle}>
            Income
          </Text>

          {
            editingIncome ? (

              <TextInput
                value={income}
                onChangeText={setIncome}
                keyboardType="numeric"
                style={styles.input}
              />

            ) : (

              <Text style={styles.smallAmount}>
                ₹ {income}
              </Text>

            )
          }

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setEditingIncome(!editingIncome)}
          >

            <Text style={styles.editBtnText}>
              {editingIncome ? "Save" : "Edit"}
            </Text>

          </TouchableOpacity>

        </View>

      </View>

      {/* BUDGET USAGE */}

      <View style={styles.sectionCard}>

        <View style={styles.usageHeader}>

          <Text style={styles.sectionTitle}>
            Budget Usage
          </Text>

          <Text style={styles.percentText}>
            {budgetPercent.toFixed(0)}%
          </Text>

        </View>

        <View style={styles.progressBar}>

          <LinearGradient
            colors={["#20d3c2", "#2f9cf4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressFill,
              {
                width: `${budgetPercent}%`,
              },
            ]}
          />

        </View>

      </View>


      {/* FLOWFI ASSISTANT */}

<TouchableOpacity
  style={styles.assistantCard}
  onPress={() => router.push("/assistant")}
>
  <Text style={styles.assistantTitle}>
    🤖 FlowFi Assistant
  </Text>

  <Text style={styles.assistantSubtitle}>
    Ask about expenses, budgets, spending trends and more.
  </Text>

  <View style={styles.assistantButton}>
    <Text style={styles.assistantButtonText}>
      Start Chat
    </Text>
  </View>
</TouchableOpacity>

      {/* TOP CATEGORIES */}

      <View style={styles.sectionCard}>

        <Text style={styles.sectionTitle}>
          Top Categories
        </Text>

        {
          categoryTotals.map((item: any, index: number) => {

            const percent =
              totalExpenses > 0
                ? (item.amount / totalExpenses) * 100
                : 0;

            
            return (

              <View
                key={index}
                style={styles.categoryItem}
              >

                <View style={styles.categoryRow}>

                  <Text style={styles.categoryText}>
                    {item.category}
                  </Text>

                  <Text style={styles.categoryPercent}>
                    {percent.toFixed(1)}%
                  </Text>
                
                </View>

                <View style={styles.progressBar}>

                  <LinearGradient
                    colors={["#20d3c2", "#2f9cf4"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressFill,
                      {
                        width: `${percent}%`,
                      },
                    ]}
                  />

                </View>

              </View>

            );
          })
        }

      </View>

    </ScrollView>

    {chatOpen && (
  <View
    style={{
      position: "absolute",

      right: 20,

      bottom: 80,

      width: 320,

      height: 500,

      backgroundColor: "#fff",

      borderRadius: 20,

      overflow: "hidden",

      shadowColor: "#000",

      shadowOpacity: 0.15,

      shadowRadius: 12,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      elevation: 8,

      zIndex: 999,
    }}
  >
    {/* HEADER */}

    <View
      style={{
        backgroundColor: "#22C7A9",

        padding: 15,

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",

          fontSize: 18,

          fontWeight: "bold",
        }}
      >
        🤖 FlowFi Assistant
      </Text>

      <TouchableOpacity
        onPress={() =>
          setChatOpen(false)
        }
      >
        <Text
          style={{
            color: "#fff",

            fontSize: 18,

            fontWeight: "bold",
          }}
        >
          ✕
        </Text>
      </TouchableOpacity>
    </View>

    {/* MESSAGE AREA */}

    <ScrollView
  style={{
    flex: 1,
    padding: 15,
  }}
>
  {chatMessages.map(
    (msg: any, index) => (
      <View
        key={index}
        style={{
          marginBottom: 10,

          alignSelf:
            msg.sender === "user"
              ? "flex-end"
              : "flex-start",

          backgroundColor:
            msg.sender === "user"
              ? "#22C7A9"
              : "#F1F5F9",

          padding: 10,

          borderRadius: 12,

          maxWidth: "85%",
        }}
      >
        <Text
          style={{
            color:
              msg.sender === "user"
                ? "#fff"
                : "#334155",
          }}
        >
          {msg.text}
        </Text>
      </View>
    )
  )}
</ScrollView>


    {/* SUGGESTED QUESTIONS */}

<View
  style={{
    paddingHorizontal: 10,
    paddingBottom: 10,
  }}
>
  <TouchableOpacity
    onPress={() =>
      setShowQuestions(!showQuestions)
    }
    style={{
      backgroundColor: "#F1F5F9",
      padding: 12,
      borderRadius: 12,
    }}
  >
    <Text
      style={{
        fontWeight: "600",
      }}
    >
      ▼ Suggested Questions
    </Text>
  </TouchableOpacity>

  {showQuestions && (
    <View
      style={{
        marginTop: 8,
      }}
    >
      {[
        {
          label:
            "How much have I spent?",
          query: "spending",
        },
        {
          label:
            "What's my budget?",
          query: "budget",
        },
        {
          label:
            "Give me savings advice",
          query:
            "savings advice",
        },

        {
          label:
            "Am I overspending?",
          query:
            "overspending",
        },

        {
          label:
            "Show insights",
          query:
            "show insights",
        },
        {
          label:
            "Which category costs the most?",
          query: "top category",
        },
        {
          label:
            "How much budget is left?",
          query: "remaining budget",
        },
      ].map((item) => (
        <TouchableOpacity
          key={item.query}
          onPress={() => {

  let reply = "";

  if (item.query === "spending") {
    reply =
      `Your total spending is ₹${totalExpenses.toFixed(2)}`;
  }

  else if (item.query === "budget") {
    reply =
      `Your budget is ₹${budget}. You have used ${budgetPercent.toFixed(1)}% of it.`;
  }

  else if (item.query === "top category") {
    reply =
      categoryTotals.length > 0
        ? `Your highest spending category is ${categoryTotals[0].category} (₹${categoryTotals[0].amount})`
        : "No category data available.";
  }

  else if (item.query === "remaining budget") {
    reply =
      `Your remaining budget is ₹${(
        Number(budget) - totalExpenses
      ).toFixed(2)}`;
  }

  else if (
  item.query ===
  "savings advice"
) {

  const topCategory =
    categoryTotals[0];

  const savings =
    topCategory
      ? topCategory.amount *
        0.1
      : 0;

  reply =
    `${topCategory?.category || "No category"} is your highest expense category. Reducing it by 10% could save ₹${savings.toFixed(
      2
    )}.`;
}

else if (
  item.query ===
  "overspending"
) {

  if (budgetPercent >= 100) {

    reply =
      "⚠️ You have exceeded your budget.";

  } else if (
    budgetPercent >= 80
  ) {

    reply =
      `⚠️ You have used ${budgetPercent.toFixed(1)}% of your budget.`;

  } else {

    reply =
      "✅ You are within budget.";
  }
}

else if (
  item.query ===
  "show insights"
) {

  const average =
    expenses.length > 0
      ? totalExpenses /
        expenses.length
      : 0;

  reply =
    `Top Category: ${
      categoryTotals[0]
        ?.category || "N/A"
    } | Transactions: ${
      expenses.length
    } | Avg Expense: ₹${average.toFixed(
      2
    )}`;
}

  setChatMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: item.label,
    },
    {
      sender: "bot",
      text: reply,
    },
  ]);

  Speech.speak(reply, {
  voice: "Google UK English Female",
  rate: 0.85,
  pitch: 1.1,
});

  setShowQuestions(false);

            
          }}
          style={{
            padding: 10,
            marginTop: 6,
            backgroundColor:
              "#E8F8F5",
            borderRadius: 10,
          }}
        >
          <Text>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>

    {/* INPUT BAR */}

    <View
      style={{
        flexDirection: "row",

        padding: 12,

        borderTopWidth: 1,

        borderColor: "#E2E8F0",
      }}
    >
      <TextInput
  value={userMessage}
  onChangeText={setUserMessage}
  placeholder="Ask FlowFi..."
  onSubmitEditing={sendMessage}
  returnKeyType="send"
  blurOnSubmit={false}
  style={{
    flex: 1,

    backgroundColor: "#F8FAFC",

    borderRadius: 12,

    paddingHorizontal: 12,

    height: 44,
  }}
/>

      <TouchableOpacity
  onPress={startListening}
  style={{
    marginRight: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
  }}
>
  <Mic
    size={22}
    color="#22C7A9"
  />
</TouchableOpacity>

      <TouchableOpacity
  onPress={sendMessage}
  style={{
          marginLeft: 10,

          backgroundColor: "#22C7A9",

          borderRadius: 12,

          justifyContent: "center",

          alignItems: "center",

          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            color: "#fff",

            fontWeight: "bold",
          }}
        >
          Send
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)}

    {!chatOpen && (
  <FloatingAI
    onPress={() =>
      setChatOpen(true)
    }
  />
)}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#eef7ff",
    padding: 20,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
  },

  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },

  logoText: {
    fontSize: 42,
    color: "#08122f",
    fontFamily: "CormorantBold",
  },

  logoSubText: {
    fontSize: 15,
    color: "#7f8aa3",
    fontFamily: "CormorantMedium",
    marginTop: -5,
  },

  welcome: {
    fontSize: 30,
    color: "#08122f",
    fontFamily: "CormorantBold",
  },

  snapshot: {
    fontSize: 20,
    color: "#7f8aa3",
    marginBottom: 25,
    fontFamily: "CormorantMedium",
  },

  totalCard: {
    borderRadius: 28,
    padding: 25,
    marginBottom: 18,
  },

  cardTitle: {
    color: "white",
    fontSize: 26,
    fontFamily: "CormorantMedium",
  },

  totalAmount: {
    color: "white",
    fontSize: 48,
    marginTop: 10,
    fontFamily: "CormorantBold",
  },

  cardSubtitle: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
    fontFamily: "CormorantMedium",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 18,
    borderRadius: 22,
    marginBottom: 18,
  },

  smallTitle: {
    fontSize: 22,
    color: "#7f8aa3",
    fontFamily: "CormorantMedium",
  },

  smallAmount: {
    fontSize: 34,
    color: "#08122f",
    marginVertical: 10,
    fontFamily: "CormorantBold",
  },

  editBtn: {
    backgroundColor: "#20d3c2",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 50,
  },

  editBtnText: {
    color: "white",
    fontSize: 18,
    fontFamily: "CormorantSemiBold",
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 26,
    paddingVertical: 5,
    marginVertical: 10,
    fontFamily: "CormorantBold",
  },

  sectionCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 22,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 28,
    color: "#08122f",
    marginBottom: 15,
    fontFamily: "CormorantBold",
  },

  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  percentText: {
    fontSize: 24,
    color: "#20d3c2",
    fontFamily: "CormorantBold",
  },

  progressBar: {
    height: 12,
    backgroundColor: "#dbe7f5",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
  },

  categoryItem: {
    marginBottom: 18,
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  categoryText: {
    fontSize: 22,
    color: "#08122f",
    fontFamily: "CormorantSemiBold",
  },

  categoryPercent: {
    fontSize: 22,
    color: "#08122f",
    fontFamily: "CormorantSemiBold",
  },

  assistantCard: {
  backgroundColor: "white",
  padding: 20,
  borderRadius: 22,
  marginBottom: 18,
},

assistantTitle: {
  fontSize: 28,
  color: "#08122f",
  fontFamily: "CormorantBold",
},

assistantSubtitle: {
  color: "#7f8aa3",
  marginTop: 8,
  fontSize: 18,
  fontFamily: "CormorantMedium",
},

assistantButton: {
  backgroundColor: "#7648f6",
  marginTop: 15,
  alignSelf: "flex-start",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 50,
},

assistantButtonText: {
  color: "white",
  fontSize: 18,
  fontFamily: "CormorantSemiBold",
},

});