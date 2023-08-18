import { useState, useRef, useEffect, useReducer } from "react";

const initialState = {
  entries: JSON.parse(localStorage.getItem("entries")) || [],
  type: "inc",
  desc: "",
  amount: 0,
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
      const idToDelete = payload;
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== idToDelete),
      };
    case "editEntry":
      const idToEdit = payload;
      return { ...state };
    default:
      throw new Error("Invalid action type");
  }
}
// 'addEntry', 'editEntry', 'deleteEntry', 'moreInfo'
function App() {
  const [{ entries, type, desc, amount }, dispatch] = useReducer(
    reducer,
    initialState
  );
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
      <h1>Budget Tracker App - React</h1>
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
      />
    </div>
  );
}

function Amount({ children, bgColor }) {
  const styles = { backgroundColor: bgColor };
  return (
    <div className="amount" style={styles}>
      {children}
    </div>
  );
}

function Amounts({ availableFunds, incomeFunds, expenseFunds, percentage }) {
  return (
    <>
      <Amount bgColor="lightgray">
        <span className="label-span">Available funds: </span>
        <h2>{availableFunds}</h2>
      </Amount>
      <Amount bgColor="yellowgreen">
        <span className="label-span">Income: </span>
        <h3>{incomeFunds}</h3>
      </Amount>
      <Amount bgColor="orangered">
        <span className="label-span">Expense: </span>
        <h3>{expenseFunds}</h3>
        <span className="label-span">{percentage}%</span>
      </Amount>
    </>
  );
}

function RadioInputs({ children }) {
  return <div className="radio-inputs-div">{children}</div>;
}

function FormInputs({ dispatch, desc, amount, entries, type }) {
  const descriptionInput = useRef(null);

  useEffect(() => {
    descriptionInput.current.focus();
  }, [type, entries]);

  return (
    <form className="other-inputs">
      <input
        type="text"
        placeholder="Add description"
        className="value-inputs"
        onChange={(e) => dispatch({ type: "desc", payload: e.target.value })}
        value={desc}
        ref={descriptionInput}
      />
      <input
        type="number"
        placeholder="Add amount"
        className="value-inputs"
        onChange={(e) =>
          dispatch({ type: "value", payload: Number(e.target.value) })
        }
        value={amount}
      />
      <button
        type="submit"
        className="btn"
        onClick={(e) => {
          e.preventDefault();
          dispatch({ type: "addEntry" });
        }}
      >
        New entry
      </button>
    </form>
  );
}

function Inputs({ children }) {
  return <div className="inputs-div">{children}</div>;
}

function ListsParent({ incomeEntries, expenseEntries, dispatch }) {
  return (
    <div className="lists">
      <div className="inc-list">
        <h2>Income</h2>
        {incomeEntries.length === 0 ? (
          <p>No income entries</p>
        ) : (
          <List
            type="inc-list"
            entriesType={incomeEntries}
            dispatch={dispatch}
          />
        )}
      </div>
      <div className="exp-list">
        <h2>Expense</h2>
        {expenseEntries.length === 0 ? (
          <p>No expense entries</p>
        ) : (
          <List
            type="exp-list"
            entriesType={expenseEntries}
            dispatch={dispatch}
          />
        )}
      </div>
      {/* <EditingModal />: */}
    </div>
  );
}

function List(props) {
  return (
    <div className="single-list">
      <ul className={`list ${props.type}`}>
        {props.entriesType.map((entry) => (
          <ListItem
            entry={entry}
            key={entry.id}
            desc={entry.desc}
            amount={entry.amount}
            dispatch={props.dispatch}
          />
        ))}
      </ul>
    </div>
  );
}

function ListItem(props) {
  const [showInfo, setShowInfo] = useState(false);

  function handleInfo() {
    setShowInfo(!showInfo);
  }

  return (
    <li className="li-item">
      {props.entry.desc}
      {showInfo && <span className="created-at">{props.entry.time}</span>}
      <div>
        <span className="item-amount">{props.entry.amount}</span>
      </div>
      <div>
        <span className="btn-info">
          <i
            className="fa-solid fa-circle-info"
            title={"Click for date/time info"}
            onClick={handleInfo}
          ></i>
        </span>
        <span className="btn-edit" onClick={() => {}}>
          <i className="fa-solid fa-pen-to-square" title="Edit entry"></i>
        </span>
        <span className="btn-delete" onClick={() => {}}>
          <i
            className="fa-solid fa-trash"
            title="Delete entry"
            onClick={() =>
              props.dispatch({ type: "deleteEntry", payload: props.entry.id })
            }
          ></i>
        </span>
      </div>
    </li>
  );
}

function EditingModal() {
  return (
    <div className="editing-modal">
      <span className="close-modal" title="Close window">
        X
      </span>
      <h2>Edit entry</h2>
      <form className="editing-form">
        <input type="text" />
        <input type="number" />
        <button type="submit" className="btn" onClick={() => {}}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default App;
