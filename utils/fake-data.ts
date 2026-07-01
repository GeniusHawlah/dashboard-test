import { faker } from "@faker-js/faker";
import { Gender, UserRole } from "@/utils/prisma";
import {
  PROGRAM_BENEFIT_SUGGESTIONS,
  PROGRAM_REQUIREMENT_SUGGESTIONS,
  TITLES,
} from "./constants";

const CLASSROOM_IDS = [
  "classroom-1",
  "classroom-2",
  "classroom-3",
  "classroom-4",
];

const CLASSES = [
  "JS 1",
  "JS 2",
  "JS 3",
  "SS 1",
  "SS 2",
  "SS 3",
];

const CLASS_LEVEL_IDS_FOR_FAKE_DATA = [
  "class-level-1",
  "class-level-2",
  "class-level-3",
];

const FEES = [
  "Mentorship Fee",
  "Program Resource Fee",
  "Workshop Fee",
];

const FEE_IDS = ["fee-1", "fee-2", "fee-3"];

const GUARDIAN_RELATIONSHIPS = [
  "Parent",
  "Guardian",
  "Aunt",
  "Uncle",
  "Sibling",
];

const RESULT_IDS = ["result-1", "result-2", "result-3"];
const STUDENT_IDS = ["student-1", "student-2", "student-3"];
const SUBJECT_IDS = ["subject-1", "subject-2", "subject-3"];
const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics"];
const TEACHER_IDS = ["teacher-1", "teacher-2", "teacher-3"];

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function timeInputValue(date: Date) {
  return date.toISOString().slice(11, 16);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function generateFakeStudentData() {
  const first = faker.person.firstName();
  const last = faker.person.lastName();

  const prefixes = ["70", "80", "81", "90", "91"];
  const prefix = faker.helpers.arrayElement(prefixes);
  const password = "Password@123456";
  const address = faker.location.streetAddress({ useFullAddress: true });

  return {
    email: faker.internet.email({ firstName: first, lastName: last }),
    firstName: first,
    lastName: last,
    password,
    confirmPassword: password,
    middleName: faker.helpers.arrayElement([faker.person.middleName(), "", ""]),
    gender: faker.helpers.arrayElement(["MALE", "FEMALE"]),
    address,
    dateOfBirth: faker.date.birthdate(),
    classroomId: faker.helpers.arrayElement(CLASSROOM_IDS),
    passport: faker.image.avatar(),
    phoneNumber: "+234" + prefix + faker.string.numeric(10 - prefix.length),
    guardianId: null,
    guardianData: {
      title: faker.helpers.arrayElement(TITLES),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.helpers.arrayElement(["MALE", "FEMALE"]),
      address,
      phoneNumber: "+234" + prefix + faker.string.numeric(10 - prefix.length),
      email: faker.internet.email(),
      relationship: faker.helpers.arrayElement(GUARDIAN_RELATIONSHIPS),
    },
  };
}

export function generateFakeStaffData() {
  const first = faker.person.firstName();
  const last = faker.person.lastName();

  const prefixes = ["70", "80", "81", "90", "91"];
  const prefix = faker.helpers.arrayElement(prefixes);
  const password = "Password@123456";
  const address = faker.location.streetAddress({ useFullAddress: true });

  return {
    title: faker.helpers.arrayElement(["Mr", "Miss", "Mrs", "Dr", "Prof."]),
    email: faker.internet.email({ firstName: first, lastName: last }),
    firstName: first,
    lastName: last,
    password,
    confirmPassword: password,
    gender: faker.helpers.arrayElement(["MALE", "FEMALE"]),
    address,
    dateOfBirth: faker.date.birthdate({ min: 22, max: 60, mode: "age" }),
    passport: faker.image.avatar(),
    idCard: `https://picsum.photos/seed/${faker.string.uuid()}/600/400`,
    phoneNumber: "+234" + prefix + faker.string.numeric(10 - prefix.length),
  };
}

export function generateFakeClassData() {
  const className = faker.helpers.arrayElement(CLASSES);
  const numberOfArms =
    className.startsWith("JS") || className.startsWith("SS")
      ? faker.number.int({ min: 1, max: 4 })
      : 0;

  return {
    name: className,
    description: faker.lorem.sentence(),
    numberOfArms,
  };
}

export function generateFakeSubjectData() {
  return {
    title: faker.helpers.arrayElement(SUBJECTS),
    code: "",
    category: "",
    description: faker.lorem
      .words({ min: 5, max: 12 })
      .replace(/^./, (c) => c.toUpperCase()),
    isActive: true,
    classLevelId: faker.helpers.arrayElement(CLASS_LEVEL_IDS_FOR_FAKE_DATA),
  };
}

export function generateFakeScoreData() {
  return {
    resultId: faker.helpers.arrayElement(RESULT_IDS),
    subjectId: faker.helpers.arrayElement(SUBJECT_IDS),
    caScore: faker.number.float({ min: 0, max: 40, fractionDigits: 2 }),
    examScore: faker.number.float({ min: 0, max: 60, fractionDigits: 2 }),
  };
}

function pickRandomUnique<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  const n = Math.min(count, copy.length);

  for (let i = 0; i < n; i++) {
    const index = faker.number.int({ min: 0, max: copy.length - 1 });
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

export function randomSubjectsForTeachers() {
  return {
    teacherId: faker.helpers.arrayElement(TEACHER_IDS),
    subjectIds: pickRandomUnique(SUBJECT_IDS, 5),
    classroomId: faker.helpers.arrayElement(CLASSROOM_IDS),
  };
}

export function generateFakeResultData() {
  return {
    userId: faker.helpers.arrayElement(STUDENT_IDS),
    session: "2026/2027",
    term: faker.helpers.arrayElement([
      "FIRST TERM",
      "SECOND TERM",
      "THIRD TERM",
    ]),
    published: true,
    locked: false,
  };
}

export function generateFakeFeeData() {
  const baseAmount = faker.number.int({ min: 10, max: 200 });

  return {
    title: faker.helpers.arrayElement(FEES),
    description: faker.lorem.sentence().replace(/^./, (c) => c.toUpperCase()),
    amount: baseAmount * 5000,
    classLevelId: faker.helpers.arrayElement([
      ...CLASS_LEVEL_IDS_FOR_FAKE_DATA,
      "",
    ]),
    isActive: true,
  };
}

export function generateFakePaymentData() {
  return {
    userId: faker.helpers.arrayElement(STUDENT_IDS),
    feeId: faker.helpers.arrayElement(FEE_IDS),
    dateDue: faker.date.soon({ days: 300 }),
  };
}

const PROGRAM_NAME_SUGGESTIONS = [
  "Science Leadership Cohort",
  "Girls in Science Accelerator",
  "Young Researchers Program",
  "Tech for Impact Cohort",
  "Climate Action Innovation Lab",
  "Future Health Leaders",
  "Digital Creativity Lab",
  "Leadership in STEM Forum",
] as const;

const EVENT_TITLE_SUGGESTIONS = [
  "Mentorship Kickoff Session",
  "Leadership Workshop",
  "Project Review Clinic",
  "Career Readiness Meetup",
  "Research Showcase",
  "Mentor Roundtable",
  "Goal Setting Session",
  "Innovation Lab Meetup",
] as const;

const EVENT_VENUE_SUGGESTIONS = [
  "Innovation Hub, Lagos",
  "Foundation Learning Centre",
  "Main Seminar Hall",
  "Mentorship Studio",
  "Virtual Meeting Room",
  "Science Lab Block",
  "Community Hall",
] as const;

export function generateFakeAdminData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const phonePrefix = faker.helpers.arrayElement(["70", "80", "81", "90"]);

  return {
    title: faker.helpers.arrayElement(TITLES),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    gender: faker.helpers.arrayElement([
      Gender.MALE,
      Gender.FEMALE,
    ]),
    dateOfBirth: dateInputValue(
      faker.date.birthdate({ min: 24, max: 65, mode: "age" }),
    ),
    phoneNumber: `+234${phonePrefix}${faker.string.numeric(10 - phonePrefix.length)}`,
    address: faker.location.streetAddress({ useFullAddress: true }),
    passport: faker.image.avatar(),
    idCard: `https://picsum.photos/seed/${faker.string.uuid()}/600/400`,
    role: UserRole.ADMIN,
  };
}

export function generateFakeProgramData() {
  const startsAt = addDays(new Date(), faker.number.int({ min: 28, max: 56 }));
  const suggestedName =
    PROGRAM_NAME_SUGGESTIONS[
      faker.number.int({ min: 0, max: PROGRAM_NAME_SUGGESTIONS.length - 1 })
    ] ?? "Science Leadership Cohort";

  return {
    name: suggestedName,
    description:
      "A structured mentorship track that balances learning, guidance, and practical project work.",
    price: String(faker.number.int({ min: 150000, max: 275000 })),
    isActive: true,
    applicationOpensAt: dateInputValue(addDays(startsAt, -28)),
    applicationClosesAt: dateInputValue(addDays(startsAt, -7)),
    startsAt: dateInputValue(startsAt),
    endsAt: dateInputValue(addDays(startsAt, 63)),
    programBenefits: [
      PROGRAM_BENEFIT_SUGGESTIONS[0] ?? "Certificate of Completion",
      PROGRAM_BENEFIT_SUGGESTIONS[1] ?? "Access to Mentors",
      PROGRAM_BENEFIT_SUGGESTIONS[2] ?? "Networking Opportunities",
    ],
    requirements: [
      PROGRAM_REQUIREMENT_SUGGESTIONS[0] ?? "Laptop or desktop access",
      PROGRAM_REQUIREMENT_SUGGESTIONS[1] ?? "Stable internet access",
      PROGRAM_REQUIREMENT_SUGGESTIONS[4] ?? "Program commitment",
    ],
    coverImage: `https://picsum.photos/seed/profak-program-${faker.string.alphanumeric(8)}/1280/800`,
  };
}

export function generateFakeEventData() {
  const eventDate = faker.date.soon({ days: 60 });
  const eventTimeHour = faker.number.int({ min: 8, max: 16 });
  const eventTimeMinute = faker.helpers.arrayElement(["00", "30"]);

  return {
    title:
      EVENT_TITLE_SUGGESTIONS[
        faker.number.int({ min: 0, max: EVENT_TITLE_SUGGESTIONS.length - 1 })
      ] ?? "Mentorship Session",
    description: faker.lorem.sentence(),
    note: faker.helpers.arrayElement([
      "Bring your notebook and questions.",
      "Arrive 15 minutes early.",
      "Prepare a short progress update.",
      "Optional attendance for mentors.",
      "Please confirm attendance before the event.",
    ]),
    venue: faker.helpers.arrayElement(EVENT_VENUE_SUGGESTIONS),
    venueLink: `https://maps.google.com/?q=${encodeURIComponent(
      faker.helpers.arrayElement(EVENT_VENUE_SUGGESTIONS),
    )}`,
    eventDate: dateInputValue(eventDate),
    eventTime: `${String(eventTimeHour).padStart(2, "0")}:${eventTimeMinute}`,
  };
}
