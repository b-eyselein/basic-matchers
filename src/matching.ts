import {BaseR, MatchingResult} from './matchingResult';
import {findSingleUnambiguousMatch} from './singleMatching';

export type MatchFunc<U, S = U, R = BaseR> = (userValue: U, sampleValue: S) => R | undefined;

export interface Match<U, S = U, R = BaseR> {
  userSolutionEntry: U;
  sampleSolutionEntry: S;
  matchResult: R;
}

export function findUnambiguousMatches<U, S = U, R = BaseR>(userValues: U[], sampleValues: S[], checkFunc: MatchFunc<U, S, R>): MatchingResult<U, S, R> {

  type Res = MatchingResult<U, S, R>;

  const reductionFunc: (mr: Res, c: U) => Res = ({matches, notMatchedUser, notMatchedSample}, current) => {

    const maybeMatch = findSingleUnambiguousMatch(current, notMatchedSample, checkFunc);

    if (!maybeMatch) {
      return {matches, notMatchedUser: [...notMatchedUser, current], notMatchedSample};
    }

    const {match, remainingSampleValues} = maybeMatch;

    return {matches: [...matches, match], notMatchedSample: remainingSampleValues, notMatchedUser};
  };

  return userValues.reduce<Res>(
    reductionFunc,
    {matches: [], notMatchedUser: [], notMatchedSample: sampleValues}
  );
}

export function multiStepMatching<U, S = U, R = BaseR>(userValues: U[], sampleValues: S[], steps: MatchFunc<U, S, R>[]): MatchingResult<U, S, R> {

  type Res = MatchingResult<U, S, R>;

  const reductionFunc: (mr: Res, step: MatchFunc<U, S, R>) => Res = ({
    matches: currentMatches,
    notMatchedUser: userEntries,
    notMatchedSample: sampleEntries
  }, step) => {
    const {matches, notMatchedUser, notMatchedSample} = findUnambiguousMatches(userEntries, sampleEntries, step);

    return {matches: [...currentMatches, ...matches], notMatchedUser, notMatchedSample};
  };

  return steps.reduce<Res>(reductionFunc, {matches: [], notMatchedUser: userValues, notMatchedSample: sampleValues});
}
