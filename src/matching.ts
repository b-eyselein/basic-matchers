import {BaseR, MatchingResult} from './matchingResult';
import {findSingleUnambiguousMatch} from './singleMatching';

export type MatchFunc<U, S = U, R = BaseR> = (userValue: U, sampleValue: S) => R | undefined;

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
