import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const colors = [
  ["Background", "var(--background)"],
  ["Surface", "var(--surface-strong)"],
  ["Text", "var(--text)"],
  ["Primary", "var(--primary)"],
  ["Primary strong", "var(--primary-strong)"],
  ["Accent", "var(--accent)"],
  ["Accent strong", "var(--accent-strong)"],
  ["Highlight", "var(--highlight)"],
  ["Success", "var(--success)"],
  ["Warning", "var(--warning)"],
  ["Danger", "var(--danger)"],
] as const;

const radii = ["--radius-xs", "--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-pill"] as const;
const shadows = ["--shadow-xs", "--shadow-sm", "--shadow-md", "--shadow-lg"] as const;

const meta = {
  title: "Design System/Primitives/Tokens",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", width: "min(100%, 56rem)" }}>
      <section>
        <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)" }}>Colors</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "1rem" }}>
          {colors.map(([label, value]) => (
            <div key={label} style={{ display: "grid", gap: ".5rem" }}>
              <div style={{ height: "4rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: value }} />
              <div>
                <strong>{label}</strong>
                <div style={{ color: "var(--text-muted)", fontSize: ".84rem" }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)" }}>Typography</h2>
        <div style={{ display: "grid", gap: ".75rem" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--font-size-4xl)", lineHeight: "var(--line-height-tight)" }}>
            Fraunces display heading
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-md)", lineHeight: "var(--line-height-body)" }}>
            Instrument Sans body text keeps operational interfaces readable.
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)" }}>Radius & shadow</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))", gap: "1rem" }}>
          {radii.map((radius) => (
            <div key={radius} style={{ height: "4rem", border: "1px solid var(--border)", borderRadius: `var(${radius})`, background: "var(--surface-strong)", display: "grid", placeItems: "center", fontSize: ".8rem" }}>
              {radius}
            </div>
          ))}
          {shadows.map((shadow) => (
            <div key={shadow} style={{ height: "4rem", borderRadius: "var(--radius-md)", background: "var(--surface-strong)", boxShadow: `var(${shadow})`, display: "grid", placeItems: "center", fontSize: ".8rem" }}>
              {shadow}
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
