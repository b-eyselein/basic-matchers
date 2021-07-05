export interface AmbiguousMatchAnalysis {
  certainty: number;
}

export interface Match<U, S = U, MA = AmbiguousMatchAnalysis> {
  userSolutionEntry: U;
  sampleSolutionEntry: S;
  matchAnalysis: MA;
}

export interface MatchingResult<U, S = U, MA = AmbiguousMatchAnalysis> {
  matches: Match<U, S, MA>[];
  notMatchedUser: U[];
  notMatchedSample: S[];
}

export function certainMatchingResultQuality<U, S = U>({matches, notMatchedUser, notMatchedSample}: MatchingResult<U, S>): number {
  return matches.length / (matches.length + notMatchedUser.length + notMatchedSample.length);
}

export function ambiguousMatchingResultQuality<U, S = U>({matches}: MatchingResult<U, S>): number {
  return matches.reduce<number>((a, b) => a + b.matchAnalysis.certainty, 0);
}
