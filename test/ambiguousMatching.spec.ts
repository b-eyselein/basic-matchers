import {findAmbiguousMatches, levenshtein, MatchingResult} from '../src';

const levenshteinMatchAssessment: (a: string, b: string) => number = (a, b) => {
  const distance = levenshtein(a, b);

  const longerStringLength = Math.max(a.length, b.length);

  return (longerStringLength - distance) / longerStringLength;
};

describe('Ambiguous Matching', () => {

  test('should match with levenshtein distance', () => {
    const userValues = ['XyZ', 'Abc', 'Def', 'ghi'];
    const sampleValues = ['def', 'abc', 'jkl', 'xYZ'];

    const matchingResult: MatchingResult<string> = findAmbiguousMatches(userValues, sampleValues, levenshteinMatchAssessment);

    const expected: MatchingResult<string> = {
      matches: [
        {userSolutionEntry: 'XyZ', sampleSolutionEntry: 'xYZ', certaintyPercentage: 1 / 3},
        {userSolutionEntry: 'Abc', sampleSolutionEntry: 'abc', certaintyPercentage: 2 / 3},
        {userSolutionEntry: 'Def', sampleSolutionEntry: 'def', certaintyPercentage: 2 / 3}
      ],
      notMatchedSample: [],
      notMatchedUser: ['ghi']
    };

    expect(matchingResult).toEqual(expected);
  });

});
