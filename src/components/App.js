import { useEffect, useReducer } from "react";

import Amounts from "./Amounts";
import Inputs from "./Inputs";
import RadioInputs from "./RadioInputs";
import FormInputs from "./FormInputs";
import ListsParent from "./ListsParent";

const initialState = {
  entries: JSON.parse(localStorage.getItem("entries")) || [],
  type: "inc",
  desc: "",
  amount: 0,
  isEditing: false,
  idToEdit: null,
  descToEdit: "",
  amountToEdit: 0,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "type":
      return { ...state, type: payload };
    case "desc":
      return { ...state, desc: payload };
    case "value":
      return { ...state, amount: payload };
    case "addEntry":
      const newEntry = {
        id: crypto.randomUUID(),
        type: state.type,
        desc: state.desc,
        amount: state.amount,
        time: new Date().toLocaleString("en-us", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      if (newEntry.desc === "" || newEntry.amount === 0) {
        alert("Please fill in all fields");
        return state;
      }
      return {
        ...state,
        entries: [...state.entries, newEntry],
        desc: "",
        amount: 0,
      };
    case "deleteEntry":
      if (state.isEditing) return state;
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== payload),
      };
    case "openEditMode":
      if (state.isEditing) return state;
      return {
        ...state,
        isEditing: true,
        idToEdit: payload.id,
        descToEdit: payload.oldDesc,
        amountToEdit: payload.oldVal,
      };
    case "edit":
      // prevent empty input fields in editing modal
      if (payload.newDesc === "" || payload.newAmount === 0) {
        alert("Please fill in all fields");
        return state;
      }
      return {
        ...state,
        entries: state.entries.map((entry) => {
          if (entry.id !== state.idToEdit) return entry;

          return {
            ...entry,
            desc: payload.newDesc,
            amount: payload.newAmount,
          };
        }),
        isEditing: false,
        idToEdit: null,
        descToEdit: "",
        amountToEdit: 0,
      };
    case "closeModal":
      return {
        ...state,
        isEditing: false,
        idToEdit: null,
        descToEdit: "",
        amountToEdit: 0,
      };
    default:
      throw new Error("Invalid action type");
  }
}

function App() {
  const [
    { entries, type, desc, amount, isEditing, descToEdit, amountToEdit },
    dispatch,
  ] = useReducer(reducer, initialState);
  // derived state
  const incomeEntries = entries.filter((entry) => entry.type === "inc");
  const expenseEntries = entries.filter((entry) => entry.type === "exp");

  const incomeFunds = incomeEntries
    .map((entry) => Number(entry.amount))
    .reduce((acc, curr) => acc + curr, 0);

  const expenseFunds = expenseEntries
    .map((entry) => Number(entry.amount))
    .reduce((acc, curr) => acc + curr, 0);

  const availableFunds = incomeFunds - expenseFunds;

  const percentage = Math.round((expenseFunds / incomeFunds) * 100);
  // effects
  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  return (
    <div className="app">
      <h1>Budget Tracker App - useReducer Hook Practice</h1>
      <Amounts
        availableFunds={availableFunds}
        incomeFunds={incomeFunds}
        expenseFunds={expenseFunds}
        percentage={percentage}
      />
      <Inputs>
        <RadioInputs>
          <label>Income</label>
          <input
            type="radio"
            name="inputs"
            defaultChecked
            onChange={() => dispatch({ type: "type", payload: "inc" })}
          />
          <label>Expense</label>
          <input
            type="radio"
            name="inputs"
            onChange={() => dispatch({ type: "type", payload: "exp" })}
          />
        </RadioInputs>
        <FormInputs
          dispatch={dispatch}
          desc={desc}
          amount={amount}
          entries={entries}
          type={type}
        />
      </Inputs>
      <ListsParent
        incomeEntries={incomeEntries}
        expenseEntries={expenseEntries}
        dispatch={dispatch}
        isEditing={isEditing}
        descToEdit={descToEdit}
        amountToEdit={amountToEdit}
      />
    </div>
  );
}

export default App;
