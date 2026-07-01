import { useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useExpense } from "../context/ExpenseContext";

export default function AssistantScreen() {
  const context = useExpense();

if (!context) {
  return null;
}

const { expenses, budget } = useExpense();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm FlowFi Assistant 👋 Ask me about your expenses, budget, spending, or categories.",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMessage = message;
    const lower = userMessage.toLowerCase();

    let reply = "Sorry, I don't understand that yet.";

    const totalSpent = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    // Biggest expense
    const biggestExpense = [...expenses].sort(
      (a, b) => Number(b.amount) - Number(a.amount)
    )[0];

    // Category totals
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((item) => {
      const category = item.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(item.amount);
    });

    const topCategory =
      Object.keys(categoryTotals).length > 0
        ? Object.keys(categoryTotals).reduce((a, b) =>
            categoryTotals[a] > categoryTotals[b] ? a : b
          )
        : "None";

    // Responses
    if (
      lower.includes("total") ||
      lower.includes("spent")
    ) {
      reply = `You have spent ₹${totalSpent.toLocaleString(
        "en-IN"
      )} in total.`;
    } else if (lower.includes("budget")) {
      const remaining = budget - totalSpent;

      reply = `Your budget is ₹${budget.toLocaleString(
        "en-IN"
      )}. ${
        remaining >= 0
          ? `₹${remaining.toLocaleString(
              "en-IN"
            )} remaining.`
          : `You exceeded budget by ₹${Math.abs(
              remaining
            ).toLocaleString("en-IN")}.`
      }`;
    } else if (
      lower.includes("biggest") ||
      lower.includes("highest")
    ) {
      if (biggestExpense) {
        reply = `Your biggest expense was ₹${Number(
          biggestExpense.amount
        ).toLocaleString("en-IN")} on ${
          biggestExpense.category
        }.`;
      }
    } else if (
      lower.includes("top category") ||
      lower.includes("category")
    ) {
      reply = `Your top spending category is ${topCategory} with ₹${(
        categoryTotals[topCategory] || 0
      ).toLocaleString("en-IN")}.`;
    } else if (
      lower.includes("hello") ||
      lower.includes("hi")
    ) {
      reply =
        "Hello 👋 How can I help with your finances today?";
    }

    setMessages([
      ...messages,
      {
        sender: "user",
        text: userMessage,
      },
      {
        sender: "bot",
        text: reply,
      },
    ]);

    setMessage("");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F7FB",
        padding: 15,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 15,
        }}
      >
        🤖 FlowFi Assistant
      </Text>

      <FlatList
        data={messages}
        keyExtractor={(_, index) =>
          index.toString()
        }
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf:
                item.sender === "user"
                  ? "flex-end"
                  : "flex-start",
              backgroundColor:
                item.sender === "user"
                  ? "#6C63FF"
                  : "#E5E7EB",
              padding: 12,
              borderRadius: 15,
              marginBottom: 10,
              maxWidth: "80%",
            }}
          >
            <Text
              style={{
                color:
                  item.sender === "user"
                    ? "#fff"
                    : "#000",
              }}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask FlowFi..."
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#ddd",
            height: 50,
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 10,
            backgroundColor: "#6C63FF",
            paddingHorizontal: 20,
            justifyContent: "center",
            borderRadius: 12,
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
  );
}