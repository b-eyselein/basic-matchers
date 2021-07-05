import {findUnambiguousMatches, MatchFunc} from './certainMatching';
import {MatchingResult} from './matchingResult';

export function multiStepCertainMatching<U, S = U>(userValues: U[], sampleValues: S[], steps: MatchFunc<U, S>[]): MatchingResult<U, S> {

  const reductionFunc: (mr: MatchingResult<U, S>, step: MatchFunc<U, S>) => MatchingResult<U, S> =
    ({matches: currentMatches, notMatchedUser: userEntries, notMatchedSample: sampleEntries}, step) => {
      const {matches, notMatchedUser, notMatchedSample} = findUnambiguousMatches(userEntries, sampleEntries, step);

      return {matches: [...currentMatches, ...matches], notMatchedUser, notMatchedSample};
    };

  return steps.reduce(reductionFunc, {matches: [], notMatchedUser: userValues, notMatchedSample: sampleValues});
}
