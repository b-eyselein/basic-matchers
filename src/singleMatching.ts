import {MatchFunc} from './certainMatching';
import {Match} from './matchingResult';

interface FindMatchResult<U, S = U> {
  match: Match<U, S>;
  remainingSampleValues: S[];
}

export function findSingleUnambiguousMatch<U, S = U>(userSolutionEntry: U, sampleValues: S[], checkFunc: MatchFunc<U, S>): FindMatchResult<U, S> | undefined {

  type ReduceObject = {
    match?: Match<U, S>;
    checkedSampleValues: S[];
  }

  const reductionFunc: (ro: ReduceObject, current: S) => ReduceObject = ({match, checkedSampleValues}, sampleSolutionEntry) => {
    if (match) {
      // A match was already found, ignore this sample value
      return {match, checkedSampleValues: [...checkedSampleValues, sampleSolutionEntry]};
    } else {
      return checkFunc(userSolutionEntry, sampleSolutionEntry)
        ? {match: {userSolutionEntry, sampleSolutionEntry, certaintyPercentage: 'CERTAIN'}, checkedSampleValues}
        : {match: undefined, checkedSampleValues: [...checkedSampleValues, sampleSolutionEntry]};
    }
  };

  const {match, checkedSampleValues} = sampleValues.reduce<ReduceObject>(reductionFunc, {match: undefined, checkedSampleValues: []});

  return match
    ? {match, remainingSampleValues: checkedSampleValues}
    : undefined;
}
