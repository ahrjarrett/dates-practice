import { Predicate } from "fp-ts/function";

export type TestCase<A> = {
  name: string;
  args: A;
  rule: Predicate<A>;
  expected: boolean;
};

export type Dictionary<A> = Record<string, A>;
