import type { Entries } from "@/types";
import type { Habit } from "../types";
import { createHabit } from "../mappers";

const baseRules = ["daily", "weekly", "monthly", "custom"] as const;

const ruleHandlers = {
  daily: () => true,
  weekly: (rule: string) => {
    const [_, day] = rule.split(":");
    if (!day || Number.isNaN(day)) return false;
    return Number(day) >= 0 && Number(day) <= 6;
  },
  monthly: (rule: string) => {
    const [_, day] = rule.split(":");
    if (!day || Number.isNaN(day)) return false;
    return Number(day) >= 0 && Number(day) <= 30;
  },
  custom: (rule: string) => {
    const [_, type, days] = rule.split(":");
    if (!type || !days) return false;
    if (type !== "weekly" && type !== "monthly") return false;
    return days.split(",").every((day) => ruleHandlers[type](`${type}:${day}`));
  },
};

const isValidRule = (rule: string): boolean => {
  const baseRule = baseRules.find((base) => rule && base.startsWith(rule));
  if (!baseRule) return false;
  if (!ruleHandlers[baseRule]) return false;
  return ruleHandlers[baseRule](rule);
};

export const isValidHabit = (data: Partial<Habit>): boolean => {
  const habit = createHabit(data);

  return (Object.entries(habit) as Entries<Partial<Habit>>).every((entry) => {
    if (!entry) return false;

    const [key, value] = entry;

    switch (key) {
      case "title":
        return value && value.length > 3;
      // case "categories":
      //   return value && value.length > 0;
      case "userId":
        return !!value;
      case "rule":
        return isValidRule(value ?? "");
      default:
        return true;
    }
  });
};
