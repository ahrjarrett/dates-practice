import { default as predicate } from "./rule-1";

const mocks = [{ args: "TX", expectation: true }];

describe.each`
  predicate    | args             | expected
  ${predicate} | ${mocks[0].args} | ${mocks[0].expectation}
`('"$args" applied to $predicate', ({ predicate, args, expected }) => {
  test(`returns ${expected}`, () => {
    expect(predicate(args)).toBe(expected);
  });
});
