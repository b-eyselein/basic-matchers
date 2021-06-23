import {BaseR, MatchingResult} from './matchingResult';

export type MatchFunc<U, S = U, R = BaseR> = (userValue: U, sampleValue: S) => R | undefined;

export interface Match<U, S = U, R = BaseR> {
  userSolutionEntry: U;
  sampleSolutionEntry: S;
  matchResult: R;
}

interface FindMatchResult<U, S = U, R = BaseR> {
  match: Match<U, S, R>;
  remainingSampleValues: S[];
}

function findUnambiguousMatch<U, S = U, R = BaseR>(userSolutionEntry: U, sampleValues: S[], checkFunc: MatchFunc<U, S, R>): FindMatchResult<U, S, R> | undefined {

  interface ReduceObject {
    match?: Match<U, S, R>;
    checkedSampleValues: S[];
  }

  const {match, checkedSampleValues} = sampleValues.reduce<ReduceObject>(
    ({match, checkedSampleValues}, current) => {
      if (match) {
        return {match, checkedSampleValues: [...checkedSampleValues, current]};
      } else {
        const matchResult: R | undefined = checkFunc(userSolutionEntry, current);

        return matchResult
          ? {match: {userSolutionEntry, sampleSolutionEntry: current, matchResult}, checkedSampleValues}
          : {match: undefined, checkedSampleValues: [...checkedSampleValues, current]};
      }
    },
    {match: undefined, checkedSampleValues: []}
  );

  return match
    ? {match, remainingSampleValues: checkedSampleValues}
    : undefined;
}

export function findUnambiguousMatches<U, S = U, R = BaseR>(userValues: U[], sampleValues: S[], checkFunc: MatchFunc<U, S, R>): MatchingResult<U, S, R> {
  return userValues.reduce<MatchingResult<U, S, R>>(
    ({matches, notMatchedUser, notMatchedSample}, current) => {

      const maybeMatch = findUnambiguousMatch(current, notMatchedSample, checkFunc);

      if (!maybeMatch) {
        return {matches, notMatchedUser: [...notMatchedUser, current], notMatchedSample};
      }

      const {match, remainingSampleValues} = maybeMatch;

      return {matches: [...matches, match], notMatchedSample: remainingSampleValues, notMatchedUser};
    },
    {matches: [], notMatchedUser: [], notMatchedSample: sampleValues}
  );
}

export function multiStepMatching<U, S = U, R = BaseR>(userValues: U[], sampleValues: S[], steps: MatchFunc<U, S, R>[]): MatchingResult<U, S, R> {
  return steps.reduce<MatchingResult<U, S, R>>(
    ({matches: currentMatches, notMatchedUser: userEntries, notMatchedSample: sampleEntries}, step) => {
      const {matches, notMatchedUser, notMatchedSample} = findUnambiguousMatches(userEntries, sampleEntries, step);

      return {matches: [...currentMatches, ...matches], notMatchedUser, notMatchedSample};
    },
    {matches: [], notMatchedUser: userValues, notMatchedSample: sampleValues}
  );
}
