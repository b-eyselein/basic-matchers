import {BaseR} from './matchingResult';

export interface BaseMatch<U, S = U> {
  userSolutionEntry: U;
  sampleSolutionEntry: S;
}

export interface Match<U, S = U, R = BaseR> extends BaseMatch<U, S> {
  matchResult: R;
}

export interface AmbiguousMatch<U, S = U> extends BaseMatch<U, S> {
  certainty: number;
}

