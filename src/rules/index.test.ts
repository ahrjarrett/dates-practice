import {
  default as predicate,
  oldestAgeInYears,
  youngestAgeInYears,
  now,
} from ".";

const YYYY = now.getFullYear();
const MM = now.getMonth();
const DD = now.getDate();

/**
 * These tests don't account for UTC offset!
 * That means they are non-determinstic, so if someone (or CI/CD) runs the test suite
 * between the hours of midnight at 5am (if they/the docker container are located in CST time,
 * they will FAIL. This is BAD, especially where CI/CD is concerned.
 *
 * We should use a library like `date-fns` instead!
 */

const validDob = new Date(1987, 11, 5, 11, 19, 42, 159);
const youngestDob = new Date(YYYY - youngestAgeInYears, MM, DD, 0, 0, 0, 0);
const oldestDob = new Date(
  YYYY - oldestAgeInYears,
  MM,
  DD,
  // This is to account for daylight saving being added as a law 55 years ago (1966)
  23 - 1,
  59,
  59,
  999
);

const tooYoung = new Date(YYYY - youngestAgeInYears, MM, DD + 1, 0, 0, 0, 0);
const tooOld = new Date(
  YYYY - oldestAgeInYears,
  MM,
  DD,
  // This is to account for daylight saving being added as a law 55 years ago (1966)
  0 - 1,
  0,
  0,
  0
);

export const mocks = [
  { args: validDob, expectation: true },
  { args: youngestDob, expectation: true },
  { args: oldestDob, expectation: true },
  { args: tooYoung, expectation: false },
  { args: tooOld, expectation: false },
];

describe.each`
  predicate    | args             | expected
  ${predicate} | ${mocks[0].args} | ${mocks[0].expectation}
  ${predicate} | ${mocks[1].args} | ${mocks[1].expectation}
  ${predicate} | ${mocks[2].args} | ${mocks[2].expectation}
  ${predicate} | ${mocks[3].args} | ${mocks[3].expectation}
  ${predicate} | ${mocks[4].args} | ${mocks[4].expectation}
`('"$args" applied to $predicate', ({ predicate, args, expected }) => {
  test(`returns ${expected}`, () => {
    expect(predicate(args)).toBe(expected);
  });
});
