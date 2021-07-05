import {findAmbiguousMatches, levenshtein} from '../src';
import {AmbiguousMatchingResult} from '../src/matchingResult';

const userValues = ['XyZ', 'abc', 'Def', 'ghi'];
const sampleValues = ['def', 'jkl', 'abc', 'xYZ'];

export const levenshteinMatchAssessment: (a: string, b: string) => number = (a, b) => {
  const distance = levenshtein(a, b);

  const longerStringLength = Math.max(a.length, b.length);

  return (longerStringLength - distance) / longerStringLength;
};

describe('Ambiguous Matching', () => {

  test('should match nothing if not possible', () => {
    const actual = findAmbiguousMatches(['a'], ['b'], levenshteinMatchAssessment);

    const expected: AmbiguousMatchingResult<string> = {
      matches: [],
      notMatchedUser: ['a'],
      notMatchedSample: ['b']
    };

    expect(actual).toEqual(expected);
  });

  test('should match with levenshtein distance', () => {
    const matchingResult: AmbiguousMatchingResult<string> = findAmbiguousMatches(userValues, sampleValues, levenshteinMatchAssessment);

    const expected: AmbiguousMatchingResult<string> = {
      matches: [
        {userSolutionEntry: 'XyZ', sampleSolutionEntry: 'xYZ', matchAnalysis: {certainty: 1 / 3}},
        {userSolutionEntry: 'abc', sampleSolutionEntry: 'abc', matchAnalysis: {certainty: 1}},
        {userSolutionEntry: 'Def', sampleSolutionEntry: 'def', matchAnalysis: {certainty: 2 / 3}}
      ],
      notMatchedSample: ['jkl'],
      notMatchedUser: ['ghi']
    };

    expect(matchingResult).toEqual(expected);
  });

});
