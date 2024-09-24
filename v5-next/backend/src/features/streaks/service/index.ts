import type { Result } from "@/types";
import type { Streak, StreakRepository, StreakService } from "../types";
import { streakRepository } from "../repository";

export const createStreakService = (
  streakRepository: StreakRepository
): StreakService => {
  const listByHabit = async (habitId: string): Promise<Result<Streak[]>> => {
    return streakRepository.listByHabit(habitId);
  };

  const addStreakToHabit = async (
    habitId: string,
    note: string
  ): Promise<Result<string>> => {
    return streakRepository.addStreakToHabit(habitId, note);
  };

  return {
    listByHabit,
    addStreakToHabit,
  };
};

export const streakService = createStreakService(streakRepository);
