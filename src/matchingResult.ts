import {Match} from './matching';

export type BaseR = Record<string, unknown>

export interface MatchingResult<U, S = U, R = BaseR> {
  matches: Match<U, S, R>[];
  notMatchedUser: U[];
  notMatchedSample: S[];
}

export function matchingResultQuality<U, S = U, R = BaseR>({
  matches,
  notMatchedUser,
  notMatchedSample
}: MatchingResult<U, S, R>): number {
  return matches.length / (matches.length + notMatchedUser.length + notMatchedSample.length);
}
