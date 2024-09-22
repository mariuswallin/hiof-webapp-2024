export default function StreakTotal(props: {
  totalStreak: number;
  streakCount: number;
}) {
  const { totalStreak, streakCount } = props;

  return (
    <p className="block my-4">
      Du har {streakCount} med totalt: {totalStreak} streaks
    </p>
  );
}
