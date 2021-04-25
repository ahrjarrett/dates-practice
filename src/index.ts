import { isBetwixt, getNowIO } from "./predicates/exports";

// Here we swap max and min, since the "minimum" age is actually higher, or "later"
import { maximumAge as first, minimumAge as last } from "./config";

export const isCorrectAge = isBetwixt({ first, last });
