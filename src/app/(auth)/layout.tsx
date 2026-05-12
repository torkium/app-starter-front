export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main style={authLayoutStyle}>{children}</main>;
}

const authLayoutStyle: React.CSSProperties = {
  minHeight: "100vh",
  width: "min(100%, 42rem)",
  margin: "0 auto",
  padding: "4rem 1rem",
};
