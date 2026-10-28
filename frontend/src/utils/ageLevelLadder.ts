export type ReadingLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export interface AgeLevelTier {
  minAge: number;
  maxAge: number;
  ageRangeLabel: string;
  readingLevel: ReadingLevel;
  stageName: string;
}

export const AGE_LEVEL_TIERS: ReadonlyArray<AgeLevelTier> = [
  { minAge: 2, maxAge: 3, ageRangeLabel: '2–3 yrs', readingLevel: 'A', stageName: 'Early Emergent' },
  { minAge: 4, maxAge: 5, ageRangeLabel: '4–5 yrs', readingLevel: 'B', stageName: 'Emergent Reader' },
  { minAge: 6, maxAge: 7, ageRangeLabel: '6–7 yrs', readingLevel: 'C', stageName: 'Early Fluent' },
  { minAge: 8, maxAge: 9, ageRangeLabel: '8–9 yrs', readingLevel: 'D', stageName: 'Developing Reader' },
  { minAge: 10, maxAge: 11, ageRangeLabel: '10–11 yrs', readingLevel: 'E', stageName: 'Intermediate Reader' },
  { minAge: 12, maxAge: 13, ageRangeLabel: '12–13 yrs', readingLevel: 'F', stageName: 'Advanced Junior' },
  { minAge: 13, maxAge: 14, ageRangeLabel: '13–14 yrs', readingLevel: 'G', stageName: 'Competent Reader' },
  { minAge: 14, maxAge: 15, ageRangeLabel: '14–15 yrs', readingLevel: 'H', stageName: 'Proficient Reader' },
  { minAge: 15, maxAge: 16, ageRangeLabel: '15–16 yrs', readingLevel: 'I', stageName: 'Advanced Reader' },
  { minAge: 16, maxAge: 18, ageRangeLabel: '16+ yrs', readingLevel: 'J', stageName: 'Young Adult' },
];

export function getTierByAge(age: number): AgeLevelTier {
  const match = AGE_LEVEL_TIERS.find((tier) => age >= tier.minAge && age <= tier.maxAge);
  if (match) {
    return match;
  }
  if (age < 2) {
    return AGE_LEVEL_TIERS[0];
  }
  return AGE_LEVEL_TIERS[AGE_LEVEL_TIERS.length - 1];
}

export function getTierByLevel(level: string): AgeLevelTier | undefined {
  const upper = level.trim().toUpperCase();
  return AGE_LEVEL_TIERS.find((tier) => tier.readingLevel === upper);
}

export function getCoincidingLevel(age: number): ReadingLevel {
  return getTierByAge(age).readingLevel;
}

export function getCoincidingAgeRange(level: string): { minAge: number; maxAge: number; ageRangeLabel: string } {
  const tier = getTierByLevel(level);
  if (tier) {
    return { minAge: tier.minAge, maxAge: tier.maxAge, ageRangeLabel: tier.ageRangeLabel };
  }
  return { minAge: 2, maxAge: 3, ageRangeLabel: '2–3 yrs' };
}
