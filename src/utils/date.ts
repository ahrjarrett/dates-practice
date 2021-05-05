import { Newtype, iso } from "newtype-ts";
import { pipe, flow, Refinement, Predicate } from "fp-ts/function";
import { IO, map as ioMap } from "fp-ts/IO";

export type Milliseconds = Newtype<
  { readonly Milliseconds: unique symbol },
  number
>;

const fromNumberToDate = (n: number): Date => new Date(n);

export const isomorphismMilliseconds = iso<Milliseconds>();

// Constructors:
export const millisecondsFromNumber = isomorphismMilliseconds.wrap;
export const millisecondsFromDate = (d: Date): Milliseconds =>
  pipe(d.getTime(), millisecondsFromNumber);

// Deconstructors:
const millisecondsToNumber = isomorphismMilliseconds.unwrap;
export const toDate: (n: Milliseconds) => Date = flow(
  millisecondsToNumber,
  fromNumberToDate
);
const toString: (ms: Milliseconds) => string = flow(toDate, (d) =>
  d.toISOString()
);

// Predicates:
export const isDate: Refinement<unknown, Date> = (u): u is Date =>
  u instanceof Date;

const isValidNum = (u: unknown) =>
  typeof u === "number"
    ? !isNaN(u)
    : typeof u === "string"
    ? Boolean(parseInt(u, 10))
    : false;

// && !isNaN(u) ? true : typeof u === "string" && parseInt(u, 10) ? true : false;

export const isValid: Predicate<Date> = flow(
  millisecondsFromDate,
  toString,
  isValidNum
);

// export const now: IO<Milliseconds> = pipe(() => new Date(), ioMap());
