import {MatchingResult} from './matchingResult';
import {AnyObject, findSingleUnambiguousMatch} from './singleMatching';

export type MatchFunc<U, S = U, R = AnyObject> = (userValue: U, sampleValue: S) => R | undefined;

export function findUnambiguousMatches<U, S = U, R = AnyObject>(userValues: U[], sampleValues: S[], checkFunc: MatchFunc<U, S, R>): MatchingResult<U, S, R> {

  const reductionFunc: (mr: MatchingResult<U, S, R>, c: U) => MatchingResult<U, S, R> = ({matches, notMatchedUser, notMatchedSample}, current) => {

    const maybeMatch = findSingleUnambiguousMatch(current, notMatchedSample, checkFunc);

    if (!maybeMatch) {
      return {matches, notMatchedUser: [...notMatchedUser, current], notMatchedSample};
    }

    const {match, remainingSampleValues} = maybeMatch;

    return {matches: [...matches, match], notMatchedSample: remainingSampleValues, notMatchedUser};
  };

  return userValues.reduce(reductionFunc, {matches: [], notMatchedUser: [], notMatchedSample: sampleValues});
}
