import {AnyObject} from './singleMatching';

export interface AmbiguousMatchAnalysis {
  certainty: number;
}

export interface Match<U, S = U, MA = AnyObject> {
  userSolutionEntry: U;
  sampleSolutionEntry: S;
  matchAnalysis: MA;
}

export interface MatchingResult<U, S = U, MA = AnyObject> {
  matches: Match<U, S, MA>[];
  notMatchedUser: U[];
  notMatchedSample: S[];
}


export type AmbiguousMatchingResult<U, S = U, MA = AmbiguousMatchAnalysis> = MatchingResult<U, S, MA>;


export function certainMatchingResultQuality<U, S = U, R = AnyObject>({matches, notMatchedUser, notMatchedSample}: MatchingResult<U, S, R>): number {
  return matches.length / (matches.length + notMatchedUser.length + notMatchedSample.length);
}


export function ambiguousMatchingResultQuality<U, S = U>({matches}: AmbiguousMatchingResult<U, S>): number {
  return matches.reduce<number>((a, b) => a + b.matchAnalysis.certainty, 0);
}


