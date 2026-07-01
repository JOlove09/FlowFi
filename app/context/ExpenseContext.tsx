import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  sendBudgetAlert,
} from "../../utils/notifications";

// =========================
// STORAGE KEYS
// =========================

const EXPENSE_KEY = "expenses";

const BUDGET_KEY = "budget";

const CATEGORY_KEY = "categoryUsage";

// =========================
// EXPENSE TYPE
// =========================

export type Expense = {

  amount: string;

  category: string;

  date: string;
};

// =========================
// CONTEXT TYPE
// =========================

type ExpenseContextType = {

  expenses: Expense[];

  budget: number;

  setBudget: (
    value: number
  ) => void;

  addExpense: (
    expense: Expense
  ) => void;

  deleteExpense: (
    index: number
  ) => void;

  updateExpense: (
    index: number,
    updated: Expense
  ) => void;

  getSuggestedCategory:
    () => string | null;
};

// =========================
// CONTEXT
// =========================

export const ExpenseContext =
  createContext<ExpenseContextType | null>(
    null
  );

// =========================
// PROVIDER
// =========================

export const ExpenseProvider = ({
  children,
}: any) => {

  // =========================
  // STATES
  // =========================

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [budget, setBudgetState] =
    useState<number>(0);

  const [
    categoryUsage,
    setCategoryUsage,
  ] = useState<
    Record<string, number>
  >({});

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    loadExpenses();

    loadBudget();

    loadCategoryUsage();

  }, []);

  // =========================
  // LOAD EXPENSES
  // =========================

  const loadExpenses = async () => {

    try {

      const data =
        await AsyncStorage.getItem(
          EXPENSE_KEY
        );

      if (data) {

        setExpenses(
          JSON.parse(data)
        );
      }

    } catch (err) {

      console.log(
        "Load expenses error:",
        err
      );
    }
  };

  // =========================
  // LOAD BUDGET
  // =========================

  const loadBudget = async () => {

    try {

      const data =
        await AsyncStorage.getItem(
          BUDGET_KEY
        );

      if (data) {

        setBudgetState(
          Number(data)
        );
      }

    } catch (err) {

      console.log(
        "Load budget error:",
        err
      );
    }
  };

  // =========================
  // LOAD CATEGORY
  // =========================

  const loadCategoryUsage =
    async () => {

      try {

        const data =
          await AsyncStorage.getItem(
            CATEGORY_KEY
          );

        if (data) {

          setCategoryUsage(
            JSON.parse(data)
          );
        }

      } catch (err) {

        console.log(
          "Load category error:",
          err
        );
      }
    };

  // =========================
  // SAVE EXPENSES
  // =========================

  const saveExpenses = async (
    data: Expense[]
  ) => {

    try {

      await AsyncStorage.setItem(
        EXPENSE_KEY,
        JSON.stringify(data)
      );

    } catch (err) {

      console.log(
        "Save expenses error:",
        err
      );
    }
  };

  // =========================
  // SAVE BUDGET
  // =========================

  const saveBudget = async (
    value: number
  ) => {

    try {

      await AsyncStorage.setItem(
        BUDGET_KEY,
        value.toString()
      );

    } catch (err) {

      console.log(
        "Save budget error:",
        err
      );
    }
  };

  // =========================
  // SAVE CATEGORY
  // =========================

  const saveCategoryUsage =
    async (
      data: Record<string, number>
    ) => {

      try {

        await AsyncStorage.setItem(
          CATEGORY_KEY,
          JSON.stringify(data)
        );

      } catch (err) {

        console.log(
          "Save category error:",
          err
        );
      }
    };

  // =========================
  // ADD EXPENSE
  // =========================

  const addExpense = async (
    expense: Expense
  ) => {

    const updated = [

      ...expenses,

      {
        ...expense,

        date:
          new Date().toISOString(),
      },
    ];

    // SAVE

    setExpenses(updated);

    saveExpenses(updated);

    // =========================
    // CATEGORY LEARNING
    // =========================

    const updatedUsage = {

      ...categoryUsage,

      [expense.category]:

        (
          categoryUsage[
            expense.category
          ] || 0
        ) + 1,
    };

    setCategoryUsage(
      updatedUsage
    );

    saveCategoryUsage(
      updatedUsage
    );

    // =========================
    // BUDGET CHECK
    // =========================

    if (budget <= 0)
      return;

    const totalSpent =
      updated.reduce(

        (sum, item) =>

          sum +
          Number(item.amount),

        0
      );

    if (
      totalSpent >= budget
    ) {

      await sendBudgetAlert(
      "Budget Alert",
      "You have reached your budget limit!"
    );
    }
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const deleteExpense = (
    index: number
  ) => {

    const updated =
      expenses.filter(
        (_, i) => i !== index
      );

    setExpenses(updated);

    saveExpenses(updated);
  };

  // =========================
  // UPDATE EXPENSE
  // =========================

  const updateExpense = (

    index: number,

    updatedExpense: Expense

  ) => {

    const updated = [...expenses];

    updated[index] = {

      ...updatedExpense,

      date:
        updated[index].date,
    };

    setExpenses(updated);

    saveExpenses(updated);
  };

  // =========================
  // UPDATE BUDGET
  // =========================

  const updateBudget = (
    value: number
  ) => {

    setBudgetState(value);

    saveBudget(value);
  };

  // =========================
  // SUGGEST CATEGORY
  // =========================

  const getSuggestedCategory =
    (): string | null => {

      const sorted =
        Object.entries(
          categoryUsage
        ).sort(

          (a, b) => b[1] - a[1]
        );

      return sorted.length > 0
        ? sorted[0][0]
        : null;
    };

  // =========================
  // PROVIDER
  // =========================

  return (

    <ExpenseContext.Provider
      value={{

        expenses,

        budget,

        setBudget:
          updateBudget,

        addExpense,

        deleteExpense,

        updateExpense,

        getSuggestedCategory,
      }}
    >

      {children}

    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = React.useContext(
    ExpenseContext
  );

  if (!context) {
    throw new Error(
      "useExpense must be used inside ExpenseProvider"
    );
  }

  return context;
};