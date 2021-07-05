import {MatchingResult} from './matchingResult';
import {findSingleUnambiguousMatch} from './singleMatching';

export type MatchFunc<U, S = U> = (userValue: U, sampleValue: S) => boolean;

export function findUnambiguousMatches<U, S = U>(userValues: U[], sampleValues: S[], checkFunc: MatchFunc<U, S>): MatchingResult<U, S> {

  const reductionFunc: (mr: MatchingResult<U, S>, c: U) => MatchingResult<U, S> = ({matches, notMatchedUser, notMatchedSample}, current) => {

    const maybeMatch = findSingleUnambiguousMatch(current, notMatchedSample, checkFunc);

    if (!maybeMatch) {
      return {matches, notMatchedUser: [...notMatchedUser, current], notMatchedSample};
    }

    const {match, remainingSampleValues} = maybeMatch;

    return {matches: [...matches, match], notMatchedSample: remainingSampleValues, notMatchedUser};
  };

  return userValues.reduce(reductionFunc, {matches: [], notMatchedUser: [], notMatchedSample: sampleValues});
}
