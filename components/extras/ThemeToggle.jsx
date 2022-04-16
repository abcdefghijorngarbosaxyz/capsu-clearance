import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";
import { Switch } from "@headlessui/react";

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  const renderThemeToggle = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;
    const darkmode = currentTheme === "dark";

    return (
      <div>
        <Switch
          checked={darkmode}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative flex
          h-[32px] w-[64px] cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-cyan-500 transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  dark:bg-slate-700"
        >
          <span className="sr-only">Set Theme</span>
          <SunIcon className="absolute left-1 h-[20px] w-[20px] scale-0 text-slate-400 opacity-0 transition-all duration-500 ease-in dark:scale-100 dark:opacity-100" />
          <div
            aria-hidden="true"
            className={`${
              darkmode ? "translate-x-[16px]" : "-translate-x-[16px]"
            } pointer-events-none
            relative flex h-[28px] w-[28px] transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-500 ease-in-out`}
          >
            <SunIcon className="absolute h-[20px] w-[20px] scale-100 text-cyan-500 opacity-100 transition-all duration-300 ease-in dark:scale-0 dark:opacity-0" />
            <MoonIcon className="absolute h-[20px] w-[20px] scale-0 text-slate-700 opacity-0 transition-all duration-300 ease-in dark:scale-100 dark:opacity-100" />
          </div>
          <MoonIcon className="absolute right-1 h-[20px] w-[20px] scale-100 text-cyan-200 opacity-100 transition-all duration-500 ease-in dark:scale-0 dark:opacity-0" />
        </Switch>
      </div>
    );
  };
  return <div>{renderThemeToggle()}</div>;
};

export default ThemeToggle;
