import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { numberFromDate, yearsOld, now, yearsInMs } from "../utils/utils";
import { pipe, Predicate } from "fp-ts/function";

/**
 * Level 2:
 * Write another rule that accepts a date of birth as a string with the form “MM-DD-YYYY”.
 * If the age is less than 18 or greater than 55 the rule should fail.
 * Otherwise, the rule should pass.
 * Create a rule engine that composes both rules and produces a final result. A single failing rule should fail the composition.
 */

const isDate = (u: unknown): u is Date => u instanceof Date;

const lt = (upperBound: number) => (n: number) => upperBound > n;
const gt = (lowerBound: number) => (n: number) => lowerBound > n;

const and = <A>(condition1: Predicate<A>, condition2: Predicate<A>) => (
  value: A
) => condition1(value) && condition2(value);

const isBetween = ([minExclusive, maxExclusive]: [number, number]) => (
  u: Date,
  c?: t.Context
) => {
  const lowerBound = yearsOld(minExclusive);
  const upperBound = yearsOld(maxExclusive);

  return pipe(numberFromDate(u), and(lt(upperBound), gt(lowerBound)));
};

const justOver = new Date(yearsOld(48));
const justUnder = new Date(yearsOld(54));

console.log("justOver", justOver);
console.log("justUnder", justUnder);

console.log("isBetween([18, 55]", isBetween([18, 55])(justOver));
console.log("isBetween([18, 55]", isBetween([18, 55])(justUnder));

type ValidAge = t.TypeOf<typeof ValidAge>;

export const ValidAge = new t.Type<Date, string, unknown>(
  "ValidAge",
  (u): u is Date => u instanceof Date,
  (u, c) =>
    pipe(
      isDate(u) && isBetween([18, 55])(u, c) ? t.success(u) : t.failure(u, c)
    ),
  (d) => d.toLocaleDateString()
);

export interface DateFromDateStringC extends t.Type<Date, string, unknown> {}
const DateFromDateString: DateFromDateStringC = new t.Type<
  Date,
  string,
  unknown
>(
  "DateFromDateString",
  (u): u is Date => u instanceof Date,
  (u, c) =>
    pipe(
      t.string.validate(u, c),
      E.chain((s) => {
        const d = new Date(s);
        return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
      })
    ),
  (d) => d.toLocaleDateString()
);
export type DateFromDateString = t.TypeOf<typeof DateFromDateString>;

export const dateFromDateString: Predicate<string> = (u) =>
  DateFromDateString.is(u);

// export default dateFromDateString;
// export const __test__ = [{ args: "12-05-1987", expectation: true }];
