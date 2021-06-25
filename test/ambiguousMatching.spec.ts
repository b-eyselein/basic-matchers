import {findAmbiguousMatches, levenshtein} from '../src';

const levenshteinMatchAssessment: (a: string, b: string) => number = (a, b) => {
  const distance = levenshtein(a, b);

  const longerStringLength = Math.max(a.length, b.length);

  return (longerStringLength - distance) / longerStringLength;
};

describe('Ambiguous Matching', () => {

  test('x', () => {
    const userValues = ['XyZ', 'Abc', 'Def', 'ghi'];
    const sampleValues = ['def', 'abc', 'jkl', 'xYZ'];

    const matchingResult = findAmbiguousMatches(userValues, sampleValues, levenshteinMatchAssessment);

    console.info(JSON.stringify(matchingResult, null, 2));
  });

});
