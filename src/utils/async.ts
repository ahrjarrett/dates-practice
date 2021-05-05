// Andrew Jarrett  4 days ago
// @naor z is right, the readonly array models the arguments of the function you give to tryCatchK. their type is unknown until you actually give tryCatchK the function that you want to “lift” (might be the wrong word) into a monadic context
// i shared a snippet of a use case, if you pop this into VS Code (make sure you’ve polyfilled fetch if in Node) you’ll see that all of fetch’s parameters are now saferFetch’s parameters, so we can call saferFetch as if it was fetch — we don’t need to pass any awkward Eithers or Options as parameters, which makes things easier on the caller
// as someone who is relatively new to the library/ typeclasses, i’ve actually found it really useful, and in some cases much simpler than trying to build up and transform monads myself (edited)

import { flow } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { is as typeIs } from "type-is";

import { Dictionary } from "../types";

type FetchError = { _tag: "FetchError"; error: string };
const fetchError = (error: string = ""): FetchError =>
  ({
    _tag: "FetchError",
    error,
  } as const);
type ReqNotOk = { _tag: "ReqNotOk"; error: string };
const reqNotOk = (error: string = ""): ReqNotOk => ({
  _tag: "ReqNotOk",
  error,
});
type ParseError = {
  _tag: "ParseError";
  error: string;
};
const parseError = (error: string = ""): ParseError => ({
  _tag: "ParseError",
  error,
});

type ApplicationError = FetchError | ReqNotOk | ParseError;

export const fetchSafe = flow(
  TE.tryCatchK(fetch, () => fetchError()),
  TE.chainEitherKW(
    E.fromPredicate(
      (response) => Boolean(response.ok),
      () => reqNotOk()
    )
  ),
  TE.chainW(
    TE.tryCatchK(
      (response) =>
        typeIs(response.headers.get("content-type") || "", [
          "application/json",
          "application/*+json",
        ])
          ? (response.json() as Promise<unknown>)
          : response.text(),
      () => parseError()
    )
  )
);

export const splitUriParams = (target: string) => {
  return target
    .split("&")
    .reduce((result: Dictionary<string>, pair: string) => {
      const [key, ...rest] = pair.split("=");
      return { ...result, [key]: rest.join("=") };
    }, {});
};

export const decodeUriEntities = (target: Dictionary<string>) =>
  Object.entries(target).reduce((acc, [k, v]) => ({
    ...acc,
    [decodeURIComponent(k)]: decodeURIComponent(v),
  }));
