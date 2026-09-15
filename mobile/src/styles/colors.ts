const light = {
  primary: "#3B82F6",
  border: "#E2E8F0",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  danger: "#EF4444",
  warning: "#F59E0B",

  overviewFontBlue: "#3B82F6",
  overviewBgBlue: "#EFF6FF",
  overviewFontGreen: "#046B2A",
  overviewBgGreen: "#ECFFF3",
  overviewFontYellow: "#6B4506",
  overviewBgYellow: "#FEFCE8",
  overviewFontPurple: "#8B5CF6",
  overviewBgPurple: "#F5F3FF",
} as const;

const dark: Record<keyof typeof light, string> = {
  primary: "#60A5FA",
  border: "#1E293B",
  background: "#0B1220",
  surface: "#111827",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  danger: "#F87171",
  warning: "#FBBF24",

  overviewFontBlue: "#60A5FA",
  overviewBgBlue: "#1E293B",
  overviewFontGreen: "#4ADE80",
  overviewBgGreen: "#14251A",
  overviewFontYellow: "#FACC15",
  overviewBgYellow: "#2A2410",
  overviewFontPurple: "#A78BFA",
  overviewBgPurple: "#241E3D",
};

export type ColorScheme = "light" | "dark";
export type ThemeColors = Record<keyof typeof light, string>;

export const Colors: Record<ColorScheme, ThemeColors> = { light, dark };
