import { IO } from "fp-ts/IO";

export const unsafeFromString = (ds: string) => new Date(ds);
export const numberFromDate = (d: Date) => d.getTime();

export const now: IO<number> = () => numberFromDate(new Date());

// Helpers:
export const abs = Math.abs;
// Date-related helpers:
export const yearsInMs = (numberOfYears: number) =>
  numberOfYears * 365.25 * 24 * 60 * 60 * 1000;

export const absoluteDifference = (ms1: number, ms2: number) => abs(ms1 - ms2);
export const yearsOld = (age: number) =>
  absoluteDifference(now(), yearsInMs(age));
