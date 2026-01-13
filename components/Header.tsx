type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h1 style={{ margin: 0 }}>{title}</h1>
      <div>
        <button disabled style={{ marginRight: "8px" }}>
          Sign In
        </button>
        <button disabled>Sign Up</button>
      </div>
    </header>
  );
}
