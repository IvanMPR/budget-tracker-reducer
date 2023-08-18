export default function Amount({ children, bgColor }) {
  const styles = { backgroundColor: bgColor };
  return (
    <div className="amount" style={styles}>
      {children}
    </div>
  );
}
