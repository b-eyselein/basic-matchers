import {AmbiguousMatchingResult, ambiguousMatchingResultQuality} from './matchingResult';
import {AmbiguousMatch} from './match';

interface MatchGenerationResult<U, S = U> {
  match: AmbiguousMatch<U, S>;
  newNotMatchedSamples: S[];
}

function generateAllPossibleMatches<U, S = U>(userSolutionEntry: U, sampleSolutionEntries: S[], assessMatchCertainty: (u: U, s: S) => number): MatchGenerationResult<U, S>[] {

  const result: MatchGenerationResult<U, S>[] = [];

  const prior: S[] = [];
  const later: S[] = sampleSolutionEntries;

  while (later.length > 0) {
    const sampleSolutionEntry = later.shift()!;

    const certainty = assessMatchCertainty(userSolutionEntry, sampleSolutionEntry);

    result.push({
      match: {userSolutionEntry, sampleSolutionEntry, certainty},
      newNotMatchedSamples: [...prior, ...later]
    });

    prior.push(sampleSolutionEntry);
  }

  return result;
}


export function findAmbiguousMatches<U, S = U>(
  userValues: U[],
  sampleValues: S[],
  assessMatchCertainty: (u: U, s: S) => number,
  certaintyThreshold = 0
): AmbiguousMatchingResult<U, S> {

  type Res = AmbiguousMatchingResult<U, S>;

  const reductionFunc: (mr: Res[], c: U) => Res[] = (allMatchingResults, userSolutionEntry) =>
    allMatchingResults.flatMap(({matches, notMatchedUser, notMatchedSample}) => {

      const allPossibleMatches: MatchGenerationResult<U, S>[] = generateAllPossibleMatches(userSolutionEntry, notMatchedSample, assessMatchCertainty)
        .filter(({match}) => match.certainty > certaintyThreshold);

      if (allPossibleMatches.length === 0) {
        return {matches, notMatchedUser: [...notMatchedUser, userSolutionEntry], notMatchedSample};
      } else {
        // FIXME: remove matched sampleSolutionEntry from notMatchedSample!
        return allPossibleMatches.map(({match, newNotMatchedSamples}) => {
          return {matches: [...matches, match], notMatchedUser, notMatchedSample: newNotMatchedSamples};
        });
      }
    });

  return userValues
    .reduce<Res[]>(reductionFunc, [{matches: [], notMatchedUser: [], notMatchedSample: sampleValues}])
    .sort((a, b) => ambiguousMatchingResultQuality(a) - ambiguousMatchingResultQuality(b))[0];
}
