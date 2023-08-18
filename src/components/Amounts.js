import Amount from "./Amount";

export default function Amounts({
  availableFunds,
  incomeFunds,
  expenseFunds,
  percentage,
}) {
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
