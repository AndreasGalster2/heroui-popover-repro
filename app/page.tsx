"use client";

import { Dropdown, Label } from "@heroui/react";
import { LogOut, Monitor, Moon, Settings, Sun, User } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * 1:1 clone of the travel-web app-shell account block
 * (labs/app-shell/shell-client.tsx), stripped to the popover only.
 * ShellNav, SpotlightSearch, sidebar collapse and drawer chrome removed.
 *
 * Reproduces: `.dropdown__popover { max-w-[48svw] }` clamps this w-64
 * (256px) menu to ~187px on a 390px phone. The inline maxWidth workaround
 * from production is deliberately NOT applied here.
 */

export type ShellTheme = "light" | "dark" | "system";

const mockUser = {
  initials: "DP",
  name: "Demo Partner",
  email: "demo@northstar.demo",
};

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: ShellTheme;
  onChange: (theme: ShellTheme) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-zinc-700 dark:bg-zinc-800"
    >
      {(
        [
          { id: "light", icon: Sun, label: "Light" },
          { id: "dark", icon: Moon, label: "Dark" },
          { id: "system", icon: Monitor, label: "System" },
        ] as const
      ).map((option) => (
        <button
          key={option.id}
          type="button"
          aria-label={`${option.label} theme`}
          aria-pressed={theme === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors",
            theme === option.id
              ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300",
          )}
        >
          <option.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

// Popover menu hover normalized to the nav-item hover (same faded family).
const menuItemHover =
  "hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.06]";

export default function ReproPage() {
  const [theme, setThemeState] = React.useState<ShellTheme>("system");
  const setTheme = (next: ShellTheme) => setThemeState(next);

  // Light/dark force the class; system follows the OS (and live-updates).
  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      return;
    }
    if (theme === "light") {
      root.classList.remove("dark");
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => root.classList.toggle("dark", mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return (
    <div className="bg-slate-100 dark:bg-zinc-950">
      {/* 335px column mimicking the drawer width (86vw at 390px). */}
      <div className="mx-auto flex min-h-screen w-[335px] max-w-full flex-col border-x border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <p className="p-3 text-xs text-slate-400 dark:text-zinc-500">
          repro: account block cloned 1:1, popover has NO maxWidth
          workaround — viewport 390px, click the account row
        </p>
        <div className="mt-auto">
          <div className="border-t border-slate-100 px-2.5 pb-2 pt-1.5 dark:border-zinc-800">
            <Dropdown>
              <Dropdown.Trigger
                aria-label="Account menu"
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg text-left transition-colors hover:bg-slate-900/[0.04] hover:text-slate-900 dark:hover:bg-white/[0.06]",
                  "flex w-full px-2.5 py-2.5",
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                  {mockUser.initials}
                </span>
                <span className="min-w-0 flex-1 overflow-hidden">
                  <span className="block truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {mockUser.name}
                  </span>
                  <span className="block truncate text-xs text-slate-500 dark:text-zinc-400">
                    {mockUser.email}
                  </span>
                </span>
              </Dropdown.Trigger>
              <Dropdown.Popover placement="top start" className="w-64">
                <div className="border-b border-slate-100 px-3 py-2.5 dark:border-zinc-800">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {mockUser.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                    {mockUser.email}
                  </p>
                </div>
                <Dropdown.Menu aria-label="Account">
                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className={menuItemHover}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <Label>Profile</Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="settings"
                    textValue="Settings"
                    className={menuItemHover}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <Label>Settings</Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="theme"
                    textValue="Theme"
                    className={menuItemHover}
                  >
                    <div
                      className="flex w-full cursor-pointer items-center gap-2"
                      onClick={() =>
                        setTheme(
                          theme === "light"
                            ? "dark"
                            : theme === "dark"
                              ? "system"
                              : "light",
                        )
                      }
                    >
                      <Sun
                        data-testid="theme-icon"
                        className="mr-2 h-4 w-4"
                      />
                      <Label>Theme</Label>
                      <span
                        className="ml-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ThemeToggle theme={theme} onChange={setTheme} />
                      </span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="logout"
                    textValue="Log out"
                    variant="danger"
                    className={menuItemHover}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                    <Label>Log out</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
