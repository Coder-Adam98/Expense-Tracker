import { useState, useRef } from "react"; // UPDATE 1: Added 'useRef' import to handle moving focus between inputs on Enter key
import "./App.css"

const App = () => {
  const [expense, setExpense] = useState(() => {
    const saved = localStorage.getItem("expense");
    return saved ? JSON.parse(saved) : [];
  });

  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  // UPDATE 2: Created a ref object to target the amount input directly
  const amountInputRef = useRef(null);

  const addExpense = (e) => {
    e.preventDefault();

    if (!item.trim() || !amount) return;
    
    const newExpense = {
      item: item,
      amount: Number(amount),
    };

    // UPDATE 3: Added localStorage save step so items persist when added
    const updatedExpenses = [...expense, newExpense];
    setExpense(updatedExpenses);
    localStorage.setItem("expense", JSON.stringify(updatedExpenses));

    setItem('');
    setAmount('');
  };

  // UPDATE 4: Added handleKeyDown function to jump from Item input to Amount input when Enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Stops premature form submission when typing the item name
      amountInputRef.current.focus(); // Shifts focus straight into the amount field
    }
  };

  // UPDATE 5: Added deleteExpense function so users can remove items and update localStorage
  const deleteExpense = (indexToDelete) => {
    const updated = expense.filter((_, index) => index !== indexToDelete);
    setExpense(updated);
    localStorage.setItem("expense", JSON.stringify(updated));
  };

  const getTotal = () => {
    return expense.reduce((sum, exp) => {
      return sum + Number(exp.amount);
    }, 0);
    // UPDATE 6: Removed 'console.log(sum)' from here because code after a 'return' statement is unreachable and 'sum' isn't available outside the reduce scope
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
          onKeyDown={handleKeyDown} // UPDATE 7: Attached keydown handler so hitting Enter moves focus to Amount
        />

        <input
          ref={amountInputRef} // UPDATE 8: Connected the ref so handleKeyDown knows which element to focus
          type="number" // UPDATE 9: Changed type from "text" to "number" for proper mobile keypad and native number validation
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
          <button onClick={() => deleteExpense(index)}>Delete</button> {/* UPDATE 11: Added delete button */}
        </div>
      ))}

      <h3>Total: ₹{getTotal()}</h3>
    </div>
  );
};

export default App;