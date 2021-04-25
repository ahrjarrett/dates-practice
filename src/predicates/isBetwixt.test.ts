import { IO, chain } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import { isBetwixt, now } from "./exports";
import { maximumAge as first, minimumAge as last } from "../config";

function predicate(d: Date) {
  return isBetwixt({ first, last })(d);
}

const getYear = (d: Date): IO<number> => () => d.getFullYear();
const getMonth = (d: Date): IO<number> => () => d.getMonth();
const getDate = (d: Date): IO<number> => () => d.getDate();

const YYYY = pipe(now, chain(getYear))();
const MM = pipe(now, chain(getMonth))();
const DD = pipe(now, chain(getDate))();

/**
 * These tests don't account for UTC offset!
 * That means they are non-determinstic, so if someone (or CI/CD) runs the test suite
 * between the hours of midnight at 5am (if they/the docker container are located in CST time,
 * they will FAIL. This is BAD, especially where CI/CD is concerned.
 *
 * We should use a library like `date-fns` instead!
 */

const validDob = new Date(1987, 11, 5, 11, 19, 42, 159);
const youngestDob = new Date(YYYY - last, MM, DD, 0, 0, 0, 0);
const oldestDob = new Date(
  YYYY - first,
  MM,
  DD,
  // This is to account for daylight saving being added as a law 55 years ago (1966)
  23 - 1,
  59,
  59,
  999
);

const tooYoung = new Date(YYYY - last, MM, DD + 1, 0, 0, 0, 0);
const tooOld = new Date(
  YYYY - first,
  MM,
  DD,
  // This is to account for daylight saving being added as a law 55 years ago (1966)
  0 - 1,
  0,
  0,
  0
);

export const mocks = [
  { name: "valid DOB", args: validDob, expectation: true },
  { name: "youngest acceptable DOB", args: youngestDob, expectation: true },
  { name: "oldest acceptable DOB", args: oldestDob, expectation: true },
  { name: "too young by 1 millisecond", args: tooYoung, expectation: false },
  { name: "too old by 1 millisecond", args: tooOld, expectation: false },
];

describe("isBetwixt", () => {
  describe.each`
    name             | args             | expected
    ${mocks[0].name} | ${mocks[0].args} | ${mocks[0].expectation}
    ${mocks[1].name} | ${mocks[1].args} | ${mocks[1].expectation}
    ${mocks[2].name} | ${mocks[2].args} | ${mocks[2].expectation}
    ${mocks[3].name} | ${mocks[3].args} | ${mocks[3].expectation}
    ${mocks[4].name} | ${mocks[4].args} | ${mocks[4].expectation}
  `(
    `$name :: 
      [object Date] $args
  `,
    ({ name, args, expected }) => {
      test(`passing ${args} -> predicate returns: ${expected}
      
      `, () => {
        expect(predicate(args)).toBe(expected);
      });
    }
  );
});
