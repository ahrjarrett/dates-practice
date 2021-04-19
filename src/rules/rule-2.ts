type Predicate<A> = (a: A) => boolean;

export const youngestAgeInYears = 18;
export const oldestAgeInYears = 55;
export const getNow = () => new Date();
export const now = getNow();

const getBeginningOfDay = (d: Date) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getYearsAgo = (nYears: number, d: Date) => {
  const date = new Date(d);
  date.setFullYear(date.getFullYear() - nYears);
  return date;
};

const getTomorrow = (d: Date): Date => {
  const date = new Date(d);
  date.setDate(date.getDate() + 1);
  return date;
};

const isWithinAgeRange: (
  minimum: number,
  maximum: number
) => Predicate<Date> = (minimum, maximum) => (d) => {
  const candidate = new Date(d);
  const today = getBeginningOfDay(now);
  const tomorrow = getBeginningOfDay(getTomorrow(now));

  // Here we actually reverse max and min, since the minimum age in milliseconds is actually the higher number, & vice-versa:
  // TODO: Consider renaming these?
  const max = getYearsAgo(minimum, tomorrow);
  const min = getYearsAgo(maximum, today);
  return candidate > min && candidate < max;
};

export default isWithinAgeRange(youngestAgeInYears, oldestAgeInYears);
