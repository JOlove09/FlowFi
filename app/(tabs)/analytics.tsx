import { ExpenseContext } from "@/context/ExpenseContext";
import { useContext } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BarChart,
  LineChart,
  PieChart,
} from "react-native-chart-kit";

export default function AnalyticsScreen() {
  const context = useContext(ExpenseContext);
  if (!context) return null;

  const { expenses, budget } = context;
  const screenWidth = Dimensions.get("window").width;

  // ==============================
  // 📊 CATEGORY TOTALS
  // ==============================
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((e) => {
    const cat = e.category || "Other";
    const amt = Number(e.amount) || 0;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
  });

  // ==============================
  // 📊 PIE DATA
  // ==============================
  const colors = ["#6C63FF", "#00C9A7", "#FF6B6B", "#FFA500", "#4D96FF"];

  const pieData = Object.keys(categoryTotals).map((cat, i) => ({
    name: cat,
    amount: categoryTotals[cat],
    color: colors[i % colors.length],
    legendFontColor: "#333",
    legendFontSize: 13,
  }));

  // ==============================
  // 📊 BAR DATA
  // ==============================
  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals) as number[],
      },
    ],
  };

  // ==============================
  // 📈 MONTHLY TREND
  // ==============================
  const monthlyTotals: Record<string, number> = {};

  expenses.forEach((e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const amt = Number(e.amount) || 0;

    monthlyTotals[key] = (monthlyTotals[key] || 0) + amt;
  });

  const sortedMonths = Object.keys(monthlyTotals).sort();

  const lineData = {
    labels: sortedMonths.map((m) => {
      const [year, month] = m.split("-");

      return new Date(
        Number(year),
        Number(month) - 1
      ).toLocaleString("default", {
        month: "short",
      });
    }), 
    datasets: [
      {
        data: sortedMonths.map((m) => monthlyTotals[m]),
      },
    ],
  };

  // ==============================
  // 💰 TOTAL
  // ==============================
  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const topCategory =
    Object.keys(categoryTotals).sort(
      (a, b) => categoryTotals[b] - categoryTotals[a]
    )[0] || "-";

    const recentExpenses = [...expenses]
  .sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  )
  .slice(0, 5);

const biggestExpense =
  expenses.length > 0
    ? expenses.reduce((max, e) =>
        Number(e.amount) > Number(max.amount)
          ? e
          : max
      )
    : null;

const budgetPercent =
  budget > 0
    ? Math.min(
        (total / budget) * 100,
        100
      )
    : 0;

  // ==============================
  // 🧠 SMART INSIGHTS
  // ==============================
  const insights: string[] = [];

  if (topCategory !== "-") {
    insights.push(`💡 Highest spending: ${topCategory}`);
  }

  if (budget > 0) {
    const percent = (total / budget) * 100;

    if (percent > 100) {
      insights.push(
  `⚠️ Overspent by ₹${(total - budget).toLocaleString("en-IN")}`
);
    } else if (percent > 80) {
      insights.push(`⚡ ${percent.toFixed(0)}% budget used`);
    } else {
      insights.push(`✅ Budget under control`);
    }
  }

  if (expenses.length > 0) {
    const avg = total / expenses.length;
    insights.push(
    `📊 Avg expense ₹${avg.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
  })}`
);
  }

  if (expenses.length > 15) {
    insights.push(`📈 High spending frequency`);
  }
  if (
  Object.keys(categoryTotals).length > 1
) {
  const sorted = Object.entries(
    categoryTotals
  ).sort((a, b) => b[1] - a[1]);

  insights.push(
    `💸 ${sorted[0][0]} accounts for most spending`
  );
}


  // ==============================
  // 📊 CHART CONFIG
  // ==============================
  
  if (expenses.length === 0) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 60 }}>
        📊
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        No expenses yet
      </Text>

      <Text>
        Add your first expense
      </Text>
    </View>
  );
}
  
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => "#6C63FF",
    labelColor: () => "#555",
    
  };

  const getCategoryIcon = (
  category: string
) => {
  switch (
    category?.toLowerCase()
  ) {
    case "shopping":
      return "🛍️";

    case "food":
      return "🍔";

    case "travel":
      return "✈️";

    case "medical":
      return "💊";

    case "electricity":
      return "⚡";

    default:
      return "📌";
  }
};

  return (
  <ScrollView
    style={styles.container}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 140,
    }}
  >
      <Text style={styles.appName}>FlowFi</Text>
      <Text style={styles.title}>📊 Analytics</Text>

      {/* SUMMARY */}
      <View style={styles.dashboardRow}>

  <View style={styles.dashboardCard}>
    <Text
      style={{
        color: "#666",
        marginBottom: 8,
      }}
    >
      Total Spending
    </Text>

    <Text
      style={{
        fontSize: 28,
        fontWeight: "bold",
      }}
    >
      ₹{Math.round(total).toLocaleString("en-IN")}
    </Text>

    <Text
      style={{
        color: "#666",
        marginTop: 8,
      }}
    >
      {expenses.length} expenses
    </Text>
  </View>

  <View style={styles.dashboardCard}>
    <Text
      style={{
        color: "#666",
        marginBottom: 8,
      }}
    >
      Monthly Overview
    </Text>

    <Text
      style={{
        fontSize: 24,
        fontWeight: "bold",
      }}
    >
      ₹{
        sortedMonths.length > 0
          ? Math.round(
              monthlyTotals[
                sortedMonths[
                  sortedMonths.length - 1
                ]
              ]
            ).toLocaleString("en-IN")
          : 0
      }
    </Text>

    <Text
      style={{
        color: "#666",
        marginTop: 8,
      }}
    >
      Current Month
    </Text>
  </View>

</View>


 {/* BUDGET */}
<View style={styles.cardLight}>
  <Text style={styles.section}>
    💰 Budget Tracking
  </Text>

  <Text
    style={{
      fontSize: 16,
      marginBottom: 8,
    }}
  >
    ₹{total.toLocaleString("en-IN")} / ₹
    {budget.toLocaleString("en-IN")}
  </Text>

  {budget > 0 && (
    <>
      <View
        style={{
          height: 14,
          backgroundColor: "#E5E7EB",
          borderRadius: 10,
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <View
          style={{
            width: `${Math.min(
              (total / budget) * 100,
              100
            )}%`,
            height: "100%",
            backgroundColor:
              total > budget
                ? "#EF4444"
                : "#6C63FF",
          }}
        />
      </View>

      <Text
        style={{
          marginTop: 10,
          fontWeight: "bold",
          color:
            total > budget
              ? "#EF4444"
              : "#10B981",
        }}
      >
        {((total / budget) * 100).toFixed(0)}%
        Used
      </Text>

      {total > budget ? (
        <Text
          style={{
            color: "#EF4444",
            marginTop: 5,
          }}
        >
          ⚠ Overspent by ₹
          {(total - budget).toLocaleString(
            "en-IN"
          )}
        </Text>
      ) : (
        <Text
          style={{
            color: "#10B981",
            marginTop: 5,
          }}
        >
          ₹
          {(budget - total).toLocaleString(
            "en-IN"
          )}{" "}
          remaining
        </Text>
      )}
    </>
  )}
</View>
<View style={styles.gridRow}>

  {/* TOP CATEGORY */}
  <View style={styles.gridCard}>
    <Text style={styles.section}>
      🏆 Top Spending Category
    </Text>

    <Text
      style={{
        fontSize: 18,
        fontWeight: "bold",
      }}
    >
      {topCategory}
    </Text>

    <Text>
      ₹{(
        categoryTotals[topCategory] || 0
      ).toLocaleString("en-IN")}
    </Text>
  </View>

  {/* BIGGEST EXPENSE */}
  <View style={styles.gridCard}>
    <Text style={styles.section}>
      💰 Biggest Expense
    </Text>

    {biggestExpense && (
      <>
        <Text>
          {biggestExpense.category}
        </Text>

        <Text
          style={{
            color: "#666",
          }}
        >
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          ₹{Number(
            biggestExpense.amount
          ).toLocaleString("en-IN")}
        </Text>
      </>
    )}
  </View>

</View>

{/* RECENT TRANSACTIONS */}
<View style={styles.cardLight}>
  <Text style={styles.section}>
    🕒 Recent Transactions
  </Text>

  {recentExpenses.map((item, index) => (
    <View
      key={index}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
        paddingBottom: 8,
      }}
    >
      <View>
        <Text
          style={{
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          {getCategoryIcon(item.category)}
          {" "}
          {item.category}
        </Text>

        <Text
          style={{
            color: "#666",
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {
  item.date
    ? new Date(item.date).toLocaleDateString("en-IN")
    : "No date"
}
          
        </Text>
      </View>

      <Text
        style={{
          fontWeight: "bold",
          color: "#6C63FF",
        }}
      >
        ₹{Number(item.amount).toLocaleString("en-IN")}
      </Text>
    </View>
  ))}
</View>

  <View style={styles.gridRow}>

  {/* SMART INSIGHTS */}
  <View style={styles.gridCard}>
    <Text style={styles.section}>
      Smart Insights
    </Text>

    {insights.map((item, i) => (
      <Text
        key={i}
        style={styles.insightText}
      >
        {item}
      </Text>
    ))}
  </View>

  {/* YEARLY TREND */}
  <View style={styles.gridCard}>
    <Text style={styles.section}>
      📅 Yearly Trend
    </Text>

    <Text
      style={{
        fontSize: 28,
        fontWeight: "bold",
        color: "#6C63FF",
        marginTop: 10,
      }}
    >
      ₹{total.toLocaleString("en-IN")}
    </Text>

    <Text
      style={{
        color: "#666",
        marginTop: 5,
      }}
    >
      Total spent this year
    </Text>

    <View style={{ marginTop: 20 }}>
      <Text>
        📊 {expenses.length} transactions
      </Text>

      <Text style={{ marginTop: 8 }}>
        🏆 Top: {topCategory}
      </Text>

      <Text style={{ marginTop: 8 }}>
        💰 Avg: ₹
        {(total / Math.max(expenses.length, 1)).toFixed(0)}
      </Text>
    </View>
  </View>

</View>


      {/* PIE */}

  {pieData.length > 0 && (
    <View style={styles.cardLight}>
      <Text style={styles.section}>
        Spending Breakdown
      </Text>

      <PieChart
        data={pieData}
        width={screenWidth - 50}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
</View>
  )}


  {/* BAR */}
  {barData.labels.length > 0 && (
    <View style={styles.cardLight}>
      <Text style={styles.section}>
        Category Comparison
      </Text>

      <BarChart
        data={barData}
        width={screenWidth - 50}
        height={220}
        yAxisLabel="₹"
        yAxisSuffix=""
        chartConfig={chartConfig}
      />
    </View>
  )}

  {/* LINE */}
  {lineData.labels.length > 0 && (
    <View style={styles.cardLight}>
      <Text style={styles.section}>
        Monthly Trend
      </Text>

      <LineChart
        data={lineData}
        width={screenWidth - 50}
        height={220}
        yAxisLabel="₹"
        yAxisSuffix=""
        chartConfig={chartConfig}
      />
    </View>
  )}

    </ScrollView>
  );
}

// ==============================
// 🎨 STYLES
// ==============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f6fa",
  },

  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C63FF",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#6C63FF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  cardLight: {
  backgroundColor: "#fff",
  padding: 15,
  borderRadius: 15,
  marginBottom: 20,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  elevation: 4,
},

  cardTitle: {
    color: "#ddd",
  },

  amount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  smallText: {
    color: "#ccc",
    fontSize: 12,
  },

  smallValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  chartBox: {
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 15,
  marginBottom: 20,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  elevation: 4,
},

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  insightText: {
    marginBottom: 6,
    color: "#333",
  },

  aiText: {
    color: "#444",
    fontStyle: "italic",
  },

  gridRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},

gridCard: {
  width: "48%",
  backgroundColor: "#fff",
  padding: 15,
  borderRadius: 15,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  elevation: 4,
},

dashboardRow: {
  flexDirection: "row",
  marginBottom: 20,
},

dashboardCard: {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 16,
  marginHorizontal: 5,

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,

  elevation: 3,
},

});