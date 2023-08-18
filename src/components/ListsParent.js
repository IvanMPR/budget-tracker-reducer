import List from "./List";
import EditingModal from "./EditingModal";

export default function ListsParent(props) {
  return (
    <div className="lists">
      <div className="inc-list">
        <h2>Income</h2>
        {props.incomeEntries.length === 0 ? (
          <p>No income entries</p>
        ) : (
          <List
            type="inc-list"
            entriesType={props.incomeEntries}
            dispatch={props.dispatch}
            isEditing={props.isEditing}
          />
        )}
      </div>
      <div className="exp-list">
        <h2>Expense</h2>
        {props.expenseEntries.length === 0 ? (
          <p>No expense entries</p>
        ) : (
          <List
            type="exp-list"
            entriesType={props.expenseEntries}
            dispatch={props.dispatch}
            isEditing={props.isEditing}
          />
        )}
      </div>
      {props.isEditing && (
        <EditingModal
          descToEdit={props.descToEdit}
          amountToEdit={props.amountToEdit}
          dispatch={props.dispatch}
        />
      )}
    </div>
  );
}
