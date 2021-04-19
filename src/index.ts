import { pipe, Predicate } from "fp-ts/function";
import { IO, map, chain, bindTo, bind } from "fp-ts/IO";

type AgeRange = {
  min: number;
  max: number;
};

export const youngestAgeInYears = 18;
export const oldestAgeInYears = 55;
export const getNow: IO<Date> = () => new Date();
export const now = getNow();

const inc = (n: number) => n + 1;
const subtract = (subtrahend: number) => (minuend: number) =>
  minuend - subtrahend;

const getBeginningOfDay = (fa: IO<Date>): IO<Date> =>
  pipe(fa, chain(dateFromDate), setHours(0, 0, 0, 0), chain(fromNumber));

const getYear = (date: Date): number => {
  return date.getFullYear();
};

const setYear = (fa: IO<Date>) => (n: number) =>
  pipe(
    fa,
    map((d) => d.setFullYear(n))
  );

const getYearsAgo = (years: number) => (fa: IO<Date>): IO<Date> =>
  pipe(
    fa,
    chain(dateFromDate),
    map(getYear),
    map(subtract(years)),
    chain(setYear(fa)),
    chain(fromNumber)
  );

const getDate = (d: Date): IO<number> => () => d.getDate();

const setDate = (fa: IO<Date>) => (n: number): IO<number> =>
  pipe(
    fa,
    map((d) => d.setDate(n))
  );
const setHours = (hh: number, mm: number, ss: number, ms: number) => (
  fa: IO<Date>
): IO<number> =>
  pipe(
    fa,
    map((d) => d.setHours(hh, mm, ss, ms))
  );

const fromNumber = (n: number): IO<Date> => () => new Date(n);
const dateFromDate = (d: Date): IO<Date> => () => new Date(d);

const getTomorrow = (fa: IO<Date>): IO<Date> =>
  pipe(fa, chain(getDate), map(inc), chain(setDate(fa)), chain(fromNumber));

const getMax = (max: number): IO<Date> =>
  pipe(dateFromDate(now), getTomorrow, getBeginningOfDay, getYearsAgo(max));

const getMin = (min: number): IO<Date> =>
  pipe(dateFromDate(now), getBeginningOfDay, getYearsAgo(min));

const isWithinAgeRange = ({ min, max }: AgeRange): Predicate<Date> => (d) => {
  const doIO = pipe(
    dateFromDate(d),
    bindTo("d"),
    bind("min", () => getMin(min)),
    bind("max", () => getMax(max)),
    bind("return", ({ min, max, d }): IO<boolean> => () => d > min && d < max)
  );

  return doIO().return;
};

export default isWithinAgeRange({
  max: youngestAgeInYears,
  min: oldestAgeInYears,
});
