import { Card } from "@/design-system/components/Card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: "640px", margin: "4rem auto", padding: "0 1rem" }}>
      <Card title={title} description={description} footer={action} />
    </div>
  );
}
