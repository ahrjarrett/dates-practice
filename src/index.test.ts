import { IO, chain } from "fp-ts/IO";
import { pipe } from "fp-ts/function";

import { now } from "./predicates/exports";
import { maximumAge as first, minimumAge as last } from "./config";

import { isCorrectAge } from "./";

const getYear = (d: Date): IO<number> => () => d.getFullYear();
const getMonth = (d: Date): IO<number> => () => d.getMonth();
const getDate = (d: Date): IO<number> => () => d.getDate();

const YYYY = pipe(now, chain(getYear))();
const MM = pipe(now, chain(getMonth))();
const DD = pipe(now, chain(getDate))();

const validDob = new Date(1987, 11, 5, 11, 19, 42, 159);

const tooOld = new Date(
  YYYY - first,
  MM,
  DD,
  // This is to account for daylight saving being added as a law 55 years ago (1966)
  0 - 1,
  0,
  0,
  0
);

test("test", () => {
  expect(isCorrectAge(tooOld)).toBe(false);
  expect(isCorrectAge(validDob)).toBe(true);
});
