import type { Result } from "@/types";
import { habitRepository, type HabitRepository } from "../repository";
import type { CreateHabitDto, Habit, UpdateHabitDto } from "../types";
import { ResultHandler } from "@/lib/result";
import { canEdit, isValidHabit } from "../utils/validator";
import { createHabit } from "../mappers";
import type { Streak, StreakService } from "@/features/streaks/types";
import { streakService } from "@/features/streaks/service";

export const createHabitService = (
  habitRepository: HabitRepository,
  streakService: StreakService
) => {
  const getById = async (
    id: string,
    user_id: string
  ): Promise<Result<Habit | undefined>> => {
    return habitRepository.getById(id, user_id);
  };

  const list = async (): Promise<Result<Habit[]>> => {
    return habitRepository.list();
  };

  const listHabitStreaks = async (
    id: string,
    userId: string
  ): Promise<Result<Habit & { streaks: Streak[] }>> => {
    const habit = await habitRepository.getById(id, userId);
    const streaks = await streakService.listByHabit(id);
    if (!streaks.success)
      return ResultHandler.failure(streaks.error.message, streaks.error.code);
    if (!habit.success)
      return ResultHandler.failure(habit.error.message, habit.error.code);

    return ResultHandler.success({ ...habit.data, streaks: streaks.data });
  };

  const listByUser = async (
    userId: string,
    query?: Record<string, string>
  ): Promise<Result<Habit[]>> => {
    return habitRepository.listByUser(userId, query);
  };

  const create = async (data: CreateHabitDto): Promise<Result<string>> => {
    const habit = createHabit(data);

    if (!isValidHabit(habit)) {
      return ResultHandler.failure("Invalid habit data", "BAD_REQUEST");
    }
    return habitRepository.create(habit);
  };

  const update = async (data: UpdateHabitDto, userId: string) => {
    const habit = createHabit({ ...data, userId });

    if (!isValidHabit(habit))
      return ResultHandler.failure("Invalid habit data", "BAD_REQUEST");

    if (!canEdit(habit, userId))
      return ResultHandler.failure("Can not edit this habit", "UNAUTHORIZED");

    return habitRepository.update(habit);
  };

  // ! Kan vurdere å bruke query-params
  const publish = async (id: string, user_id: string) => {
    const result = await habitRepository.getById(id, user_id);
    if (!result.success)
      return ResultHandler.failure(result.error.message, result.error.code);
    if (!result.data)
      return ResultHandler.failure("Habit not found", "NOT_FOUND");
    const habit = result.data;

    return habitRepository.update({ ...habit, publishedAt: new Date() });
  };

  const remove = async (id: string, user_id: string) => {
    return habitRepository.remove(id, user_id);
  };

  return {
    list,
    create,
    update,
    getById,
    listByUser,
    remove,
    publish,
    listHabitStreaks,
  };
};

export const habitService = createHabitService(habitRepository, streakService);

export type HabitService = ReturnType<typeof createHabitService>;
