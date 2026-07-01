export const EDUCATION_TRACKS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "tertiary", label: "Tertiary" },
] as const;

export type EducationTrack = (typeof EDUCATION_TRACKS)[number]["value"];

export const EDUCATION_LEVEL_GROUPS = {
  primary: [
    { value: "PRIMARY_1", label: "Primary 1" },
    { value: "PRIMARY_2", label: "Primary 2" },
    { value: "PRIMARY_3", label: "Primary 3" },
    { value: "PRIMARY_4", label: "Primary 4" },
    { value: "PRIMARY_5", label: "Primary 5" },
    { value: "PRIMARY_6", label: "Primary 6" },
  ],
  secondary: [
    { value: "JS_1", label: "JS 1" },
    { value: "JS_2", label: "JS 2" },
    { value: "JS_3", label: "JS 3" },
    { value: "SS_1", label: "SS 1" },
    { value: "SS_2", label: "SS 2" },
    { value: "SS_3", label: "SS 3" },
  ],
  tertiary: [
    { value: "YEAR_1", label: "Year 1" },
    { value: "YEAR_2", label: "Year 2" },
    { value: "YEAR_3", label: "Year 3" },
    { value: "YEAR_4", label: "Year 4" },
    { value: "YEAR_5", label: "Year 5" },
    { value: "YEAR_6", label: "Year 6" },
    { value: "YEAR_7", label: "Year 7" },
  ],
} as const;

export const EDUCATION_LEVEL_VALUES = [
  "PRIMARY_1",
  "PRIMARY_2",
  "PRIMARY_3",
  "PRIMARY_4",
  "PRIMARY_5",
  "PRIMARY_6",
  "JS_1",
  "JS_2",
  "JS_3",
  "SS_1",
  "SS_2",
  "SS_3",
  "YEAR_1",
  "YEAR_2",
  "YEAR_3",
  "YEAR_4",
  "YEAR_5",
  "YEAR_6",
  "YEAR_7",
] as const;

export type EducationLevelValue = (typeof EDUCATION_LEVEL_VALUES)[number];

export const DEFAULT_EDUCATION_TRACK: EducationTrack = "secondary";
export const DEFAULT_EDUCATION_LEVEL: EducationLevelValue = "JS_1";

export function getEducationLevelGroup(track: EducationTrack) {
  return EDUCATION_LEVEL_GROUPS[track];
}
