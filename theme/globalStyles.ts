import { StyleSheet } from "react-native";
import { COLORS } from "./themes";

export const globalStyles = StyleSheet.create({

  // ======================
  // SCREENS
  // ======================

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    padding: 20,
  },

  // ======================
  // CARDS
  // ======================

  card: {
    backgroundColor: COLORS.card,

    borderRadius: 22,

    padding: 18,

    marginBottom: 16,

    borderWidth: 1,

    borderColor: COLORS.border,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  kpiCard: {
    flex: 1,

    backgroundColor: COLORS.card,

    borderRadius: 22,

    padding: 18,

    borderWidth: 1,

    borderColor: COLORS.border,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  // ======================
  // ROWS
  // ======================

  row: {
    flexDirection: "row",

    gap: 12,

    marginBottom: 16,
  },

  // ======================
  // TEXT
  // ======================

  title: {
    fontSize: 28,

    fontWeight: "bold",

    color: COLORS.text,
  },

  sectionTitle: {
    fontSize: 22,

    fontWeight: "700",

    color: COLORS.text,

    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 14,

    color: COLORS.subText,

    marginBottom: 8,
  },

  amount: {
    fontSize: 34,

    fontWeight: "bold",

    color: COLORS.text,
  },

  bigAmount: {
    fontSize: 26,

    fontWeight: "bold",

    color: COLORS.text,
  },

  subtitle: {
    fontSize: 14,

    color: COLORS.subText,

    marginTop: 6,
  },

  label: {
    fontSize: 14,

    color: COLORS.subText,
  },

  value: {
    fontSize: 18,

    fontWeight: "600",

    color: COLORS.text,
  },

  // ======================
  // BUTTONS
  // ======================

  button: {
    backgroundColor: COLORS.primary,

    paddingVertical: 14,

    paddingHorizontal: 20,

    borderRadius: 16,

    alignItems: "center",
  },

  buttonText: {
    color: "#fff",

    fontWeight: "600",

    fontSize: 16,
  },

  // ======================
  // PROGRESS BAR
  // ======================

  progressBg: {
    height: 12,

    backgroundColor: "#E5E7EB",

    borderRadius: 20,

    overflow: "hidden",
  },

  progressFill: {
    height: 12,

    borderRadius: 20,
  },

  // ======================
  // CHARTS
  // ======================

  chartCard: {
    flex: 1,

    backgroundColor: COLORS.card,

    borderRadius: 22,

    padding: 15,

    borderWidth: 1,

    borderColor: COLORS.border,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  // ======================
  // TRANSACTION ITEM
  // ======================

  transactionRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: 12,

    borderBottomWidth: 1,

    borderBottomColor: "#F1F5F9",
  },

  transactionTitle: {
    fontSize: 15,

    fontWeight: "600",

    color: COLORS.text,
  },

  transactionDate: {
    fontSize: 12,

    color: COLORS.subText,

    marginTop: 2,
  },

  transactionAmount: {
    fontSize: 16,

    fontWeight: "bold",

    color: COLORS.primary,
  },

});