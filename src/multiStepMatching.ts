import {findUnambiguousMatches, MatchFunc} from './certainMatching';
import {MatchingResult} from './matchingResult';
import {AnyObject} from './singleMatching';

export function multiStepCertainMatching<U, S = U, R = AnyObject>(userValues: U[], sampleValues: S[], steps: MatchFunc<U, S, R>[]): MatchingResult<U, S, R> {

  const reductionFunc: (mr: MatchingResult<U, S, R>, step: MatchFunc<U, S, R>) => MatchingResult<U, S, R> =
    ({matches: currentMatches, notMatchedUser: userEntries, notMatchedSample: sampleEntries}, step) => {
      const {matches, notMatchedUser, notMatchedSample} = findUnambiguousMatches(userEntries, sampleEntries, step);

      return {matches: [...currentMatches, ...matches], notMatchedUser, notMatchedSample};
    };

  return steps.reduce(reductionFunc, {matches: [], notMatchedUser: userValues, notMatchedSample: sampleValues});
}
