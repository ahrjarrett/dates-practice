import { Predicate } from "fp-ts/function";
/**
 * Lvl 1
 *
 * Create a rule (function) that accepts a State (e.g. TX) as a string.
 *
 * When executed, the rule will return a pass/fail indication.
 * The rule should pass if the state has exactly two characters.
 * Otherwise, it should fail. Don’t worry about validating that the state is an actual US state.
 */
// export const validateStateLength: Predicate<string>;

const validateStateLength: Predicate<string> = (candidate) =>
  candidate.length === 2;

export default validateStateLength;

export const __test__ = [{ args: "TX", expectation: true }];
