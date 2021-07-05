export interface Match<U, S = U> {
  userSolutionEntry: U;
  sampleSolutionEntry: S;
  certaintyPercentage: 'CERTAIN' | number;
}

export interface MatchingResult<U, S = U> {
  matches: Match<U, S>[];
  notMatchedUser: U[];
  notMatchedSample: S[];
}

export function certainMatchingResultQuality<U, S = U>({matches, notMatchedUser, notMatchedSample}: MatchingResult<U, S>): number {
  return matches.length / (matches.length + notMatchedUser.length + notMatchedSample.length);
}

export function ambiguousMatchingResultQuality<U, S = U>({matches}: MatchingResult<U, S>): number {
  return matches.reduce<number>((a, b) => a + (b.certaintyPercentage === 'CERTAIN' ? 100 : b.certaintyPercentage), 0);
}
