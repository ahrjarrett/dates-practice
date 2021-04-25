import { flow, pipe, Predicate } from "fp-ts/function";
import { Applicative1 } from "fp-ts/Applicative";
import { Kind, URIS } from "fp-ts/HKT";
import * as io from "fp-ts/IO";
import { chain, map, bind, bindTo, of } from "fp-ts/IO";
import IO = io.IO;

import { inc, subtract } from "../utils";

type Config = {
  first: number;
  last: number;
};

type Hours = [number, number, number, number];

export const now: IO<Date> = of(new Date());

// Date utils:
const getYear = (d: Date): number => d.getFullYear();
const getTime = (d: Date): number => d.getTime();
const getDate = (d: Date): number => d.getDate();
const toDate = (dts: Date | number): Date => new Date(dts);

/**
 * We use the Timestamp type to ensure we never mutate a date argument
 * (basically represents an isomorphism between a date and timestamp in milliseconds;
 * by converting to and from a Timestamp, we can never mutate a date on accident
 */
interface Timestamp {
  _tag: "Timestamp";
  value: number;
}

// Constructors:
const timestamp = (dts: Date | number): Timestamp => ({
  _tag: "Timestamp",
  value: pipe(dts, toDate, getTime),
});

// Deconstructors:
const fromTimestamp = (ts: Timestamp): Date => toDate(ts.value);

// Eq & Ord utils:
const equals = (x: Timestamp) => (y: Timestamp) => x.value === y.value;
const compare = (x: Timestamp) => (y: Timestamp) =>
  x.value > y.value ? 1 : equals(x)(y) ? 0 : -1;
const gt = (x: Timestamp) => (y: Timestamp): boolean => compare(x)(y) > 0;
const lt = (x: Timestamp) => (y: Timestamp): boolean => compare(x)(y) < 0;

/**
 * // No longer used, but was fun to implement //
 * const lift = <F extends URIS>(F: Applicative1<F>) => <A, B, C>(
 *   fabc: (a: A) => (b: B) => C
 * ) => (fa: Kind<F, A>) => (fb: Kind<F, B>): Kind<F, C> =>
 *   F.ap(F.map(fa, fabc), fb);
 *
 * const liftA2_: <A, B>(
 *   g: (x: A) => (y: A) => B
 * ) => (x: IO<A>) => (y: IO<A>) => IO<B> = (g) => (x) => (y) =>
 *   pipe(pipe(g, of, ap(y), ap(x)));
 *
 * const liftA2 = <A, B>(g: (x: A) => (y: A) => B) => (x: IO<A>) => (y: IO<A>) =>
 *   pipe(
 *     sequenceT(io.io)(x, y),
 *     map(([x, y]) => g(x)(y))
 *   );
 *
 * // Only works with monomorphic functions //
 * const lift: <F extends URIS>(
 *   F: Applicative1<F>
 * ) => <A, B>(
 *   fab: (x: A) => (y: A) => B
 * ) => (x: Kind<F, A>) => (y: Kind<F, A>) => Kind<F, B> = (F) => (f) => (x) => (
 *   y
 * ) => F.ap(F.map(x, f), y);
 *
 * const liftIO = lift(io.io);
 * const ioEquals = liftIO(equals);
 * const ioCompare = liftIO(compare);
 */

const setHours: (hours: Hours) => (dts: Date | number) => IO<Timestamp> = (
  hours
) =>
  flow(
    timestamp,
    fromTimestamp,
    of,
    map((d) => d.setHours(...hours)),
    map(timestamp)
  );

const getBeginningOfDay: (d: Date | number) => IO<Timestamp> = flow(
  setHours([0, 0, 0, 0])
);

const setYear: (dts: Date | number) => (n: number) => IO<Timestamp> = (dts) => (
  n
) =>
  pipe(
    timestamp(dts),
    fromTimestamp,
    of,
    map((d) => d.setFullYear(n)),
    map(timestamp)
  );

const getYearsAgo: (years: number) => (dts: Date | number) => IO<Timestamp> = (
  years
) => (dts) =>
  pipe(dts, toDate, getYear, subtract(years), of, chain(setYear(dts)));

const setDate = (dts: Date | number) => (n: number): IO<Timestamp> =>
  pipe(
    timestamp(dts),
    fromTimestamp,
    of,
    map((d) => d.setDate(n)),
    map(timestamp)
  );

const getTomorrow = (dts: Date | number): IO<Timestamp> =>
  pipe(toDate(dts), getDate, inc, of, chain(setDate(dts)));

const getFirst = (first: number): IO<Timestamp> =>
  pipe(
    now,
    chain(getBeginningOfDay),
    map(fromTimestamp),
    chain(getYearsAgo(first))
  );

const getLast = (last: number): IO<Timestamp> =>
  pipe(
    now,
    chain(getTomorrow),
    map(fromTimestamp),
    chain(getBeginningOfDay),
    map(fromTimestamp),
    chain(getYearsAgo(last))
  );

const isBetwixt = ({ first, last }: Config): Predicate<Date | number> => (
  dts: Date | number
) => {
  const run = pipe(
    timestamp(dts),
    of,
    bindTo("ts"),
    bind("first", () => getFirst(first)),
    bind("last", () => getLast(last)),
    bind("return", ({ first, last, ts }) => () => gt(ts)(first) && lt(ts)(last))
  );
  return run().return;
};

export default isBetwixt;
