import {combinedMatching, CombinedMatchingResult} from '../src';
import {levenshteinMatchAssessment} from './ambiguousMatching.spec';
import {stringEqualityMatchFunc} from './certainMatching.spec';

const userValues = ['XyZ', 'abc', 'Def', 'ghi'];
const sampleValues = ['def', 'jkl', 'abc', 'xYZ'];

describe('Combined Matching', () => {

  test('should match with equality and levenshtein distance', () => {

    const matchingResult: CombinedMatchingResult<string> = combinedMatching(userValues, sampleValues, stringEqualityMatchFunc, levenshteinMatchAssessment);

    const expected: CombinedMatchingResult<string> = {
      certainMatches: [
        {userSolutionEntry: 'abc', sampleSolutionEntry: 'abc', matchAnalysis: {}},
      ],
      ambiguousMatches: [
        {userSolutionEntry: 'XyZ', sampleSolutionEntry: 'xYZ', matchAnalysis: {certainty: 1 / 3}},

        {userSolutionEntry: 'Def', sampleSolutionEntry: 'def', matchAnalysis: {certainty: 2 / 3}}
      ],
      notMatchedSample: ['jkl'],
      notMatchedUser: ['ghi']
    };

    expect(matchingResult).toEqual(expected);
  });

});
