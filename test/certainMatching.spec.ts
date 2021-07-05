import {findUnambiguousMatches, MatchFunc, MatchingResult} from '../src';

export const stringEqualityMatchFunc: MatchFunc<string> = (a, b) => a === b ? {} : undefined;

const userValues = ['XyZ', 'abc', 'Def', 'ghi'];
const sampleValues = ['def', 'jkl', 'abc', 'xYZ'];

describe('Certain Matching', () => {

  test('should match with equality', () => {
    const matchingResult: MatchingResult<string> = findUnambiguousMatches(userValues, sampleValues, stringEqualityMatchFunc);

    const expected: MatchingResult<string> = {
      matches: [
        {userSolutionEntry: 'abc', sampleSolutionEntry: 'abc', matchAnalysis: {}},
      ],
      notMatchedSample: ['def', 'jkl', 'xYZ'],
      notMatchedUser: ['XyZ', 'Def', 'ghi']
    };

    expect(matchingResult).toEqual(expected);
  });

});
