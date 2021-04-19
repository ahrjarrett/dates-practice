import { pipe, Predicate } from "fp-ts/function";
import { of, IO, map, chain, bindTo, bind } from "fp-ts/IO";

type AgeRange = {
  min: number;
  max: number;
};

const now = new Date();
export const getNowIO: IO<Date> = () => now;
export const youngestAgeInYears = 18;
export const oldestAgeInYears = 55;

const inc = (n: number) => n + 1;
const subtract = (subtrahend: number) => (minuend: number) =>
  minuend - subtrahend;

const getBeginningOfDay = (d: Date): IO<Date> =>
  pipe(of(d), chain(cloneDate), chain(setHours(0, 0, 0, 0)), chain(fromNumber));

const getYear = (date: Date): number => {
  return date.getFullYear();
};

const setYear = (d: Date) => (n: number): IO<number> =>
  pipe(
    of(d),
    map((d) => d.setFullYear(n))
  );

const getYearsAgo = (years: number) => (d: Date): IO<Date> =>
  pipe(
    of(d),
    chain(cloneDate),
    map(getYear),
    map(subtract(years)),
    chain(setYear(d)),
    chain(fromNumber)
  );

const getDate = (d: Date): IO<number> => () => d.getDate();

const setDate = (d: Date) => (n: number): IO<number> =>
  pipe(
    of(d),
    map((d) => d.setDate(n))
  );
const setHours = (hh: number, mm: number, ss: number, ms: number) => (
  d: Date
): IO<number> =>
  pipe(
    of(d),
    map((d) => d.setHours(hh, mm, ss, ms))
  );

const fromNumber = (n: number): IO<Date> => () => new Date(n);
const cloneDate = (d: Date): IO<Date> => () => new Date(d);

const getTomorrow = (d: Date): IO<Date> =>
  pipe(of(d), chain(getDate), map(inc), chain(setDate(d)), chain(fromNumber));

const getMax = (max: number): IO<Date> =>
  pipe(
    getNowIO,
    chain(cloneDate),
    chain(getTomorrow),
    chain(getBeginningOfDay),
    chain(getYearsAgo(max))
  );

const getMin = (min: number): IO<Date> =>
  pipe(
    getNowIO,
    chain(cloneDate),
    chain(getBeginningOfDay),
    chain(getYearsAgo(min))
  );

const isWithinAgeRange = ({ min, max }: AgeRange): Predicate<Date> => (d) => {
  const doIO = pipe(
    cloneDate(d),
    bindTo("d"),
    bind("min", () => getMin(min)),
    bind("max", () => getMax(max)),
    bind("return", ({ min, max, d }) => () => d > min && d < max)
  );

  return doIO().return;
};

export default isWithinAgeRange({
  max: youngestAgeInYears,
  min: oldestAgeInYears,
});
