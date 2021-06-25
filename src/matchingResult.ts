import {AmbiguousMatch, BaseMatch, Match} from './match';

export type BaseR = Record<string, unknown>

export interface BaseMatchingResult<U, S, M extends BaseMatch<U, S>> {
  matches: M[];
  notMatchedUser: U[];
  notMatchedSample: S[];
}

export type MatchingResult<U, S = U, R = BaseR> = BaseMatchingResult<U, S, Match<U, S, R>>;

export function matchingResultQuality<U, S = U, R = BaseR>({
  matches,
  notMatchedUser,
  notMatchedSample
}: MatchingResult<U, S, R>): number {
  return matches.length / (matches.length + notMatchedUser.length + notMatchedSample.length);
}


export type AmbiguousMatchingResult<U, S = U> = BaseMatchingResult<U, S, AmbiguousMatch<U, S>>;

export function ambiguousMatchingResultQuality<U, S = U>({matches}: AmbiguousMatchingResult<U, S>): number {
  return matches.map(({certainty}) => certainty).reduce((a, b) => a + b, 0);
}

