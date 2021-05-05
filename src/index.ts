import { Predicate } from "fp-ts/function";
import { rule1, rule2 } from "./rules";
import { log } from "./logger";

const predicates: Array<
  [keyof Candidate, Predicate<Candidate[keyof Candidate]>]
> = [
  ["state", rule1],
  ["dob", rule2],
];

type Candidate = { state: string; dob: Date };

const candidate: Candidate = {
  state: "TX",
  dob: new Date(1987, 11, 5, 2, 40, 23, 122),
} as const;

log((a: any) =>
  predicates.reduce((acc, [key, pred]) => acc && pred(candidate[key]), true)
);

const run = () => {};
// const run = ()
