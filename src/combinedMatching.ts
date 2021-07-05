import {AmbiguousMatchAnalysis, Match} from './matchingResult';
import {findUnambiguousMatches, MatchFunc} from './certainMatching';
import {findAmbiguousMatches} from './ambiguousMatching';
import {AnyObject} from './singleMatching';

export interface CombinedMatchingResult<U, S = U, MA = AnyObject> {
  certainMatches: Match<U, S, MA>[];
  ambiguousMatches: Match<U, S, AmbiguousMatchAnalysis>[];
  notMatchedUser: U[];
  notMatchedSample: S[];
}

export function combinedMatching<U, S, MA>(userValues: U[], sampleValues: S[], certainMatchFunc: MatchFunc<U, S, MA>, assessAmbiguousMatchCertainty: (u: U, s: S) => number, certaintyThreshold = 0): CombinedMatchingResult<U, S, MA> {
  const {
    matches: certainMatches,
    notMatchedUser: remainingUserValues,
    notMatchedSample: remainingSampleValues
  } = findUnambiguousMatches(userValues, sampleValues, certainMatchFunc);


  const {
    matches: ambiguousMatches,
    notMatchedUser,
    notMatchedSample
  } = findAmbiguousMatches(remainingUserValues, remainingSampleValues, assessAmbiguousMatchCertainty, certaintyThreshold);


  return {certainMatches, ambiguousMatches, notMatchedUser, notMatchedSample};
}
