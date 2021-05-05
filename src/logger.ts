import { flow } from "fp-ts/function";
import * as Console from "fp-ts/Console";
import * as TE from "fp-ts/TaskEither";

export const tap = <A>(a: A) => (template: (a: A) => string) => {
  console.group();
  console.log(template(a));
  console.groupEnd();
  return a;
};

export const log = (template: (a: unknown) => string) => <A>(a: A) =>
  tap(a)(template);

export const warn = flow(Console.warn, TE.fromIO);
