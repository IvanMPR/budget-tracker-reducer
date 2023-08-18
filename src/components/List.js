import ListItem from "./ListItem";

export default function List(props) {
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
            isEditing={props.isEditing}
          />
        ))}
      </ul>
    </div>
  );
}
