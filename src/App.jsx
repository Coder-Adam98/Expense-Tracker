import { useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [expense, setExpense] = useState(() => {
    const saved = localStorage.getItem("expense");
    return saved ? JSON.parse(saved) : [];
  });

  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  const amountInputRef = useRef(null);

  const addExpense = (e) => {
    e.preventDefault();

    if (!item.trim() || !amount) return;

    const newExpense = {
      item: item,
      amount: Number(amount),
    };

    const updatedExpenses = [...expense, newExpense];
    setExpense(updatedExpenses);
    localStorage.setItem("expense", JSON.stringify(updatedExpenses));

    setItem("");
    setAmount("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      amountInputRef.current.focus();
    }
  };

  const deleteExpense = (indexToDelete) => {
    const updated = expense.filter((_, index) => index !== indexToDelete);
    setExpense(updated);
    localStorage.setItem("expense", JSON.stringify(updated));
  };

  const getTotal = () => {
    return expense.reduce((sum, exp) => {
      return sum + Number(exp.amount);
    }, 0);
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <form onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Enter Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          ref={amountInputRef}
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      {expense.map((exp, index) => (
        <div key={index}>
          {/* UPDATE 10: Added spacing and styling delimiters between item, amount, and delete button */}
          <span>{exp.item} - </span>
          <span>₹{exp.amount} </span>
          <button onClick={() => deleteExpense(index)}>Delete</button>{" "}
          {/* UPDATE 11: Added delete button */}
        </div>
      ))}

      <h3>Total: ₹{getTotal()}</h3>
    </div>
  );
};

export default App;
