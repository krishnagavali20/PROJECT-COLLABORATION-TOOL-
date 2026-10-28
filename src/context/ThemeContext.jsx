import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("nexus_theme");
      if (saved) return saved;
      return "dark"; // Default to dark mode as requested by user
    } catch {
      return "dark";
    }
  });

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      root.setAttribute("data-theme", "light");
    }

    try {
      localStorage.setItem("nexus_theme", theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
