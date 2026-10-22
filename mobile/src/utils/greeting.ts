// Uses the user's timezone setting when available, falling back to the device's.
const getCurrentHour = (timeZone?: string) => {
  const now = new Date();
  if (!timeZone) return now.getHours();
  console.log("time zone: ", timeZone);
  try {
    const hour = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone,
    }).format(now);
    return Number(hour) % 24;
  } catch {
    return now.getHours();
  }
};

export const getGreeting = (timeZone?: string) => {
  const hour = getCurrentHour(timeZone);

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
};
