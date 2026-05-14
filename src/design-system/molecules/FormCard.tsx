import { Card } from "@/design-system/molecules/Card";

export function FormCard({
  title,
  description,
  children,
  actions,
  footer,
  maxWidth = "32rem",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div style={{ width: `min(100%, ${maxWidth})`, margin: "0 auto" }}>
      <Card title={title} description={description} actions={actions} footer={footer} padding="lg">
        <div style={{ display: "grid", gap: "1rem" }}>{children}</div>
      </Card>
    </div>
  );
}
