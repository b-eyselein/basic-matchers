import {BaseR} from './matchingResult';
import {Match, MatchFunc} from './matching';

interface FindMatchResult<U, S = U, R = BaseR> {
  match: Match<U, S, R>;
  remainingSampleValues: S[];
}

export function findSingleUnambiguousMatch<U, S = U, R = BaseR>(userSolutionEntry: U, sampleValues: S[], checkFunc: MatchFunc<U, S, R>): FindMatchResult<U, S, R> | undefined {

  type ReduceObject = {
    match?: Match<U, S, R>;
    checkedSampleValues: S[];
  }

  const reductionFunc: (ro: ReduceObject, current: S) => ReduceObject = ({match, checkedSampleValues}, current) => {
    if (match) {
      // A match was already found, ignore this sample value
      return {match, checkedSampleValues: [...checkedSampleValues, current]};
    } else {
      const matchResult: R | undefined = checkFunc(userSolutionEntry, current);

      return matchResult
        ? {match: {userSolutionEntry, sampleSolutionEntry: current, matchResult}, checkedSampleValues}
        : {match: undefined, checkedSampleValues: [...checkedSampleValues, current]};
    }
  };

  const {match, checkedSampleValues} = sampleValues.reduce<ReduceObject>(reductionFunc, {match: undefined, checkedSampleValues: []});

  return match
    ? {match, remainingSampleValues: checkedSampleValues}
    : undefined;
}
