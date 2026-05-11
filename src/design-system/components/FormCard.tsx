import { Card } from "@/design-system/components/Card";

export function FormCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div style={{ width: "min(100%, 32rem)", margin: "0 auto" }}>
      <Card title={title} description={description} footer={footer}>
        <div style={{ display: "grid", gap: "1rem" }}>{children}</div>
      </Card>
    </div>
  );
}
