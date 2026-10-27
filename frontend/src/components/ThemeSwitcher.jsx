import React from "react";
import { Check, Moon, Palette, Sun } from "lucide-react";
import useTheme from "../lib/useTheme";

const OPTIONS = [
  { value: "retro", label: "Retro", Icon: Palette },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const Active = OPTIONS.find((o) => o.value === theme)?.Icon ?? Palette;

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        id="theme-switcher"
        aria-label="Change theme"
        title="Change theme"
        className="btn btn-ghost btn-sm md:btn-md btn-circle"
      >
        <Active className="size-4 md:size-5" />
      </div>
      <ul
        tabIndex={0}
        role="menu"
        aria-label="Theme options"
        className="dropdown-content menu p-2 shadow-xl ring-1 ring-base-content/10 rounded-box w-40 mt-3 z-50 bg-base-200 font-mono"
      >
        {OPTIONS.map((option) => {
          const { value, label } = option;
          const OptionIcon = option.Icon;
          return (
            <li key={value} role="none">
              <button
                role="menuitemradio"
                aria-checked={theme === value}
                id={`theme-option-${value}`}
                onClick={() => {
                  setTheme(value);
                  document.activeElement?.blur();
                }}
                className={`flex items-center justify-between ${theme === value ? "active" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <OptionIcon className="size-4" />
                  {label}
                </span>
                {theme === value && <Check className="size-4" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
