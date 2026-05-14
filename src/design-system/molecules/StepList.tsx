import { cn } from "@/shared/utils/cn";

export type StepListItem = {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export type StepListProps = React.OlHTMLAttributes<HTMLOListElement> & {
  items: StepListItem[];
};

export function StepList({ items, className, ...props }: StepListProps) {
  return (
    <ol {...props} className={cn("ui-step-list", className)}>
      {items.map((item, index) => (
        <li className="ui-step-list__item" key={item.id ?? index}>
          <span className="ui-step-list__marker" aria-hidden="true">{index + 1}</span>
          <p className="ui-step-list__content">
            <strong>{item.title}</strong>
            {item.description ? <span>{item.description}</span> : null}
          </p>
        </li>
      ))}
    </ol>
  );
}
