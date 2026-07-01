import { ExpenseContext } from "@/context/ExpenseContext";
import { Picker } from "@react-native-picker/picker";
import { useContext, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExpensesScreen() {
  const context = useContext(ExpenseContext);
  if (!context) return null;

  const { expenses, deleteExpense, updateExpense } = context;

  // ✅ EDIT POPUP STATE
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // 🔥 OPEN EDIT
  const handleEdit = (item: any, index: number) => {
    setEditIndex(index);
    setEditAmount(item.amount);
    setEditCategory(item.category);
    setShowEditModal(true);
  };

  // 💾 SAVE EDIT
  const saveEdit = () => {
    if (editIndex === null) return;

    updateExpense(editIndex, {
  amount: editAmount,
  category: editCategory,
  date: new Date().toISOString(),
});

    setShowEditModal(false);
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        {/* ✏️ EDIT */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEdit(item, index)}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        {/* ❌ DELETE */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteExpense(index)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💸 Expenses</Text>

      <FlatList
  data={expenses}
  keyExtractor={(_, i) => i.toString()}
  renderItem={renderItem}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 160,
  }}
/>

      {/* 🔥 EDIT MODAL */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Expense</Text>

            {/* Amount */}
            <TextInput
              value={editAmount}
              onChangeText={setEditAmount}
              style={styles.input}
              keyboardType="numeric"
            />

            {/* Category */}
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={editCategory}
                onValueChange={(val) => setEditCategory(val)}
              >
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Travel" value="Travel" />
                <Picker.Item label="Shopping" value="Shopping" />
                <Picker.Item label="Electricity" value="Electricity" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6fa",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  category: {
    fontSize: 14,
    color: "#666",
  },

  amount: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  editBtn: {
    backgroundColor: "#00B894",
    padding: 6,
    borderRadius: 6,
    marginRight: 10,
  },

  editText: {
    color: "#fff",
    fontSize: 12,
  },

  deleteBtn: {
    backgroundColor: "#ff4d4d",
    padding: 6,
    borderRadius: 6,
  },

  deleteText: {
    color: "#fff",
    fontSize: 12,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  pickerBox: {
    backgroundColor: "#f1f2f6",
    borderRadius: 10,
  },

  saveBtn: {
    flex: 1,
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 10,
    marginLeft: 5,
    alignItems: "center",
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#d63031",
    padding: 12,
    borderRadius: 10,
    marginRight: 5,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});