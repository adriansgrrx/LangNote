import { useCallback, useEffect, useState } from "react";

export const THEMES = ["retro", "light", "dark"];

const THEME_COLORS = {
  retro: "#ece3ca",
  light: "#ffffff",
  dark: "#1d232a",
};

const getInitialTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");
  return THEMES.includes(current) ? current : "retro";
};

/**
 * Global theme state, persisted to localStorage and applied to <html>.
 * index.html sets the initial theme before React mounts to avoid a flash.
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[theme]);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    if (THEMES.includes(next)) setThemeState(next);
  }, []);

  return { theme, setTheme };
}
