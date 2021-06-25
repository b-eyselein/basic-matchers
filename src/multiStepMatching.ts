import {BaseR, MatchingResult} from './matchingResult';
import {findUnambiguousMatches, MatchFunc} from './matching';

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
