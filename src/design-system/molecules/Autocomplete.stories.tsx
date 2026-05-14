import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Autocomplete, type AutocompleteOption } from "@/design-system/molecules/Autocomplete";
import { NumberFieldWithUnit } from "@/design-system/molecules/NumberFieldWithUnit";

type ProjectData = {
  owner: string;
  status: string;
};

const projects: AutocompleteOption<ProjectData>[] = [
  { id: "alpha", textValue: "Projet Alpha", label: "Projet Alpha", description: "Application web", meta: "Actif · Camille", data: { owner: "Camille", status: "active" } },
  { id: "billing", textValue: "Portail facturation", label: "Portail facturation", description: "Espace client", meta: "En revue · Nour", data: { owner: "Nour", status: "review" } },
  { id: "media", textValue: "Bibliothèque médias", label: "Bibliothèque médias", description: "Gestion de fichiers", meta: "Planifié · Sam", data: { owner: "Sam", status: "planned" } },
  { id: "support", textValue: "Centre support", label: "Centre support", description: "Back-office", meta: "Actif · Alex", data: { owner: "Alex", status: "active" } },
  { id: "analytics", textValue: "Tableau analytics", label: "Tableau analytics", description: "Reporting", meta: "Prototype · Lina", data: { owner: "Lina", status: "prototype" } },
];

const meta = {
  title: "Design System/Molecules/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 34rem)", minHeight: "22rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

function useProjectOptions(query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      return [];
    }

    return projects.filter((project) => project.textValue.toLowerCase().includes(q));
  }, [query]);
}

function AutocompleteStory() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AutocompleteOption<ProjectData> | undefined>();
  const options = useProjectOptions(query);

  return (
    <Autocomplete
      label="Projet"
      placeholder="Ex. portail, médias, support..."
      query={query}
      onQueryChange={setQuery}
      selectedOption={selected}
      suggestions={projects.slice(0, 3)}
      options={options}
      onSelect={setSelected}
      minQueryLength={2}
      emptyMessage="Aucun projet trouvé"
      sourceLabel="Données : API applicative interne"
    />
  );
}

function CompactRowStory() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AutocompleteOption<ProjectData> | undefined>(projects[1]);
  const options = useProjectOptions(query);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(12rem, 1fr) 8rem", gap: ".75rem", alignItems: "end" }}>
      <Autocomplete
        label="Élément"
        placeholder="Rechercher un projet"
        query={query}
        onQueryChange={setQuery}
        selectedOption={selected}
        suggestions={projects.slice(0, 3)}
        options={options}
        onSelect={setSelected}
        minQueryLength={2}
        compact
        sourceLabel="Données : API applicative interne"
      />
      <NumberFieldWithUnit label="Priorité" unit="/10" defaultValue={7} controlSize="sm" />
    </div>
  );
}

export const Default: Story = {
  render: () => <AutocompleteStory />,
};

export const Suggestions: Story = {
  args: {
    label: "Projet",
    defaultOpen: true,
    minQueryLength: 2,
    suggestions: projects.slice(0, 3),
    options: [],
    onSelect: () => undefined,
    sourceLabel: "Données : API applicative interne",
  },
};

export const Selected: Story = {
  args: {
    label: "Projet",
    selectedOption: projects[0],
    options: projects,
    onSelect: () => undefined,
  },
};

export const Compact: Story = {
  render: () => <CompactRowStory />,
};

export const Loading: Story = {
  args: {
    label: "Projet",
    query: "por",
    onQueryChange: () => undefined,
    defaultOpen: true,
    loading: true,
    options: [],
    onSelect: () => undefined,
    sourceLabel: "Données : API applicative interne",
  },
};

export const Empty: Story = {
  args: {
    label: "Projet",
    query: "inconnu",
    onQueryChange: () => undefined,
    defaultOpen: true,
    options: [],
    onSelect: () => undefined,
    emptyMessage: "Aucun projet trouvé",
  },
};

export const Error: Story = {
  args: {
    label: "Projet",
    query: "inconnu",
    onQueryChange: () => undefined,
    defaultOpen: true,
    error: "Recherche indisponible",
    options: [],
    onSelect: () => undefined,
  },
};
