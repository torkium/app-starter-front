import { Button, type ButtonProps } from "@/design-system/primitives/atoms/Button";

export type IconButtonProps = Omit<ButtonProps, "children" | "size"> & {
  "aria-label": string;
  children: React.ReactNode;
};

export function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <Button {...props} size="icon">
      {children}
    </Button>
  );
}
