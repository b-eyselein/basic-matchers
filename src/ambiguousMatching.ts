import {AmbiguousMatchAnalysis, AmbiguousMatchingResult, ambiguousMatchingResultQuality, Match} from './matchingResult';

interface MatchGenerationResult<U, S = U> {
  match: Match<U, S, AmbiguousMatchAnalysis>;
  newNotMatchedSamples: S[];
}

function generateAllPossibleMatches<U, S = U>(userSolutionEntry: U, sampleSolutionEntries: S[], assessMatchCertainty: (u: U, s: S) => number, certaintyThreshold = 0): MatchGenerationResult<U, S>[] {

  const result: MatchGenerationResult<U, S>[] = [];

  const prior: S[] = [];
  const later: S[] = [...sampleSolutionEntries];

  while (later.length > 0) {
    // FIXME: do not use shift or else you always have to copy the array!
    const sampleSolutionEntry = later.shift()!;

    const certainty = assessMatchCertainty(userSolutionEntry, sampleSolutionEntry);

    if (certainty > certaintyThreshold) {
      result.push({
        match: {userSolutionEntry, sampleSolutionEntry, matchAnalysis: {certainty}},
        newNotMatchedSamples: [...prior, ...later]
      });
    }

    prior.push(sampleSolutionEntry);
  }

  return result;
}


export function findAmbiguousMatches<U, S = U>(userValues: U[], sampleValues: S[], assessMatchCertainty: (u: U, s: S) => number, certaintyThreshold = 0): AmbiguousMatchingResult<U, S> {

  const reductionFunc: (mr: AmbiguousMatchingResult<U, S>[], c: U) => AmbiguousMatchingResult<U, S>[] = (allMatchingResults, userSolutionEntry) =>
    allMatchingResults.flatMap(({matches, notMatchedUser, notMatchedSample}) => {

      const allPossibleMatches: MatchGenerationResult<U, S>[] = generateAllPossibleMatches(userSolutionEntry, notMatchedSample, assessMatchCertainty, certaintyThreshold)
        .filter(({match}) => match.matchAnalysis.certainty > certaintyThreshold);

      if (allPossibleMatches.length === 0) {
        return {matches, notMatchedUser: [...notMatchedUser, userSolutionEntry], notMatchedSample};
      } else {
        return allPossibleMatches.map(({match, newNotMatchedSamples}) => ({
          matches: [...matches, match],
          notMatchedUser,
          notMatchedSample: newNotMatchedSamples
        }));
      }
    });

  return userValues
    .reduce(reductionFunc, [{matches: [], notMatchedUser: [], notMatchedSample: sampleValues}])
    .sort((a, b) => ambiguousMatchingResultQuality(a) - ambiguousMatchingResultQuality(b))[0];
}
