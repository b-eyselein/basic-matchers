import {MatchFunc} from './certainMatching';
import {Match} from './matchingResult';

export type AnyObject = Record<string, unknown>;

interface FindMatchResult<U, S = U, R = AnyObject> {
  match: Match<U, S, R>;
  remainingSampleValues: S[];
}

export function findSingleUnambiguousMatch<U, S = U, R = AnyObject>(userSolutionEntry: U, sampleValues: S[], checkFunc: MatchFunc<U, S, R>): FindMatchResult<U, S, R> | undefined {

  type ReduceObject = {
    match?: Match<U, S, R>;
    checkedSampleValues: S[];
  }

  const reductionFunc: (ro: ReduceObject, current: S) => ReduceObject = ({match, checkedSampleValues}, sampleSolutionEntry) => {
    if (match) {
      // A match was already found, ignore this sample value
      return {match, checkedSampleValues: [...checkedSampleValues, sampleSolutionEntry]};
    } else {

      const matchAnalysis = checkFunc(userSolutionEntry, sampleSolutionEntry);

      return matchAnalysis
        ? {match: {userSolutionEntry, sampleSolutionEntry, matchAnalysis}, checkedSampleValues}
        : {match: undefined, checkedSampleValues: [...checkedSampleValues, sampleSolutionEntry]};
    }
  };

  const {match, checkedSampleValues} = sampleValues.reduce<ReduceObject>(reductionFunc, {match: undefined, checkedSampleValues: []});

  return match
    ? {match, remainingSampleValues: checkedSampleValues}
    : undefined;
}
