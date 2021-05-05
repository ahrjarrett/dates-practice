import { default as predicate } from "./rule-3";

export const mocks = [
  { args: "123-45-6789", expectation: { _tag: "Some", value: "123-45-6789" } },
  { args: "123456789", expectation: { _tag: "None" } },
];

describe.each`
  predicate    | args             | expected
  ${predicate} | ${mocks[0].args} | ${mocks[0].expectation}
`('"$args" applied to $predicate', ({ predicate, args, expected }) => {
  test(`returns ${expected}`, () => {
    expect(predicate(args)).toEqual(expected);
  });
});
