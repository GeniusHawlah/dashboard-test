require("dotenv/config");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PROGRAMS = [
  {
    name: "Future Scientists Cohort",
    description:
      "A guided mentorship track for learners building confidence with core science habits, collaboration, and project-based learning.",
    price: 120000,
    applicationOpensAt: "2026-05-02",
    applicationClosesAt: "2026-05-30",
    startsAt: "2026-06-08",
    endsAt: "2026-08-01",
    coverSeed: "profak-program-1",
  },
  {
    name: "Girls in Science Mentorship",
    description:
      "A leadership-focused program helping young women strengthen their voice, confidence, and applied science skills.",
    price: 185000,
    applicationOpensAt: "2026-05-10",
    applicationClosesAt: "2026-06-05",
    startsAt: "2026-06-20",
    endsAt: "2026-09-05",
    coverSeed: "profak-program-2",
  },
  {
    name: "Robotics and Coding Studio",
    description:
      "Students explore robotics fundamentals, coding workflows, and how to turn ideas into working prototypes.",
    price: 240000,
    applicationOpensAt: "2026-05-18",
    applicationClosesAt: "2026-06-28",
    startsAt: "2026-07-06",
    endsAt: "2026-09-25",
    coverSeed: "profak-program-3",
  },
  {
    name: "Climate Action Innovation Lab",
    description:
      "A cohort centered on sustainability, environmental awareness, and practical solutions for community challenges.",
    price: 155000,
    applicationOpensAt: "2026-05-14",
    applicationClosesAt: "2026-06-24",
    startsAt: "2026-07-01",
    endsAt: "2026-08-20",
    coverSeed: "profak-program-4",
  },
  {
    name: "Future Health Leaders",
    description:
      "An applied mentorship pathway exploring health science, public wellbeing, and research-minded learning.",
    price: 310000,
    applicationOpensAt: "2026-05-25",
    applicationClosesAt: "2026-07-02",
    startsAt: "2026-07-15",
    endsAt: "2026-10-10",
    coverSeed: "profak-program-5",
  },
  {
    name: "Math Mastery Mentorship",
    description:
      "A supportive program for strengthening numerical thinking, logic, and problem-solving confidence.",
    price: 140000,
    applicationOpensAt: "2026-06-01",
    applicationClosesAt: "2026-06-18",
    startsAt: "2026-06-30",
    endsAt: "2026-08-15",
    coverSeed: "profak-program-6",
  },
  {
    name: "Data and AI Explorers",
    description:
      "Learners explore data literacy, introductory AI concepts, and the mindset needed for emerging technology.",
    price: 275000,
    applicationOpensAt: "2026-06-03",
    applicationClosesAt: "2026-07-09",
    startsAt: "2026-07-20",
    endsAt: "2026-10-05",
    coverSeed: "profak-program-7",
  },
  {
    name: "Physics Problem Solvers",
    description:
      "A guided track for building intuition around physics concepts through discussion, examples, and practice.",
    price: 165000,
    applicationOpensAt: "2026-05-07",
    applicationClosesAt: "2026-05-27",
    startsAt: "2026-06-12",
    endsAt: "2026-08-30",
    coverSeed: "profak-program-8",
  },
  {
    name: "Young Researchers Program",
    description:
      "Students learn how to ask better questions, structure investigations, and present findings with clarity.",
    price: 220000,
    applicationOpensAt: "2026-06-08",
    applicationClosesAt: "2026-07-15",
    startsAt: "2026-07-28",
    endsAt: "2026-10-20",
    coverSeed: "profak-program-9",
  },
  {
    name: "Science Communication Fellowship",
    description:
      "A cohort for learners who want to explain science well, present ideas clearly, and build public confidence.",
    price: 195000,
    applicationOpensAt: "2026-05-20",
    applicationClosesAt: "2026-06-12",
    startsAt: "2026-06-25",
    endsAt: "2026-09-18",
    coverSeed: "profak-program-10",
  },
  {
    name: "Tech for Impact Cohort",
    description:
      "Practical mentorship around technology, community relevance, and building useful solutions for everyday problems.",
    price: 335000,
    applicationOpensAt: "2026-06-10",
    applicationClosesAt: "2026-06-30",
    startsAt: "2026-07-14",
    endsAt: "2026-10-22",
    coverSeed: "profak-program-11",
  },
  {
    name: "Engineering Design Sprint",
    description:
      "A hands-on cohort centered on design thinking, iteration, testing, and building with purpose.",
    price: 260000,
    applicationOpensAt: "2026-05-04",
    applicationClosesAt: "2026-05-24",
    startsAt: "2026-06-16",
    endsAt: "2026-08-09",
    coverSeed: "profak-program-12",
  },
  {
    name: "Biomedical Discovery Track",
    description:
      "An exploration of biology, healthcare, and the scientific process behind modern biomedical innovation.",
    price: 420000,
    applicationOpensAt: "2026-06-05",
    applicationClosesAt: "2026-07-12",
    startsAt: "2026-07-24",
    endsAt: "2026-11-02",
    coverSeed: "profak-program-13",
  },
  {
    name: "Sustainability Champions",
    description:
      "Learners work through real-world sustainability challenges and develop project-based responses together.",
    price: 205000,
    applicationOpensAt: "2026-05-15",
    applicationClosesAt: "2026-06-14",
    startsAt: "2026-06-27",
    endsAt: "2026-09-14",
    coverSeed: "profak-program-14",
  },
  {
    name: "Space Science Club",
    description:
      "A curiosity-driven program exploring astronomy, space systems, and the science of what is beyond earth.",
    price: 390000,
    applicationOpensAt: "2026-06-12",
    applicationClosesAt: "2026-07-20",
    startsAt: "2026-08-01",
    endsAt: "2026-11-15",
    coverSeed: "profak-program-15",
  },
];

const DEFAULT_PROGRAM_BENEFITS = [
  "Certificate of Completion",
  "Access to Mentors",
  "Networking Opportunities",
  "Real-world Projects",
];

const DEFAULT_PROGRAM_REQUIREMENTS = [
  "Program commitment",
  "Willingness to learn",
  "Task completion",
  "Weekly time commitment",
];

function utcDate(dateString) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

function deriveCohort(startsAt) {
  const month = startsAt
    .toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    })
    .toUpperCase();
  const year = startsAt.getUTCFullYear();

  return `COHORT-${month}-${year}`;
}

async function resolveCreator() {
  const creatorEmail = "geniusdecode@gmail.com";

  const preferredCreator = await prisma.user.findFirst({
    where: { email: creatorEmail },
    select: {
      id: true,
      email: true,
      name: true,
      userId: true,
      role: true,
    },
  });

  if (preferredCreator) {
    return preferredCreator;
  }

  const fallbackCreator = await prisma.user.findFirst({
    where: {
      OR: [
        { email: creatorEmail },
        { userId: "geniusdecode" },
        { name: { equals: "geniusdecode", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      userId: true,
      role: true,
    },
  });

  if (!fallbackCreator) {
    throw new Error(
      "Could not find the geniusdecode account. Make sure geniusdecode@gmail.com exists in the database.",
    );
  }

  return fallbackCreator;
}

async function seedPrograms() {
  const now = new Date();
  const creator = await resolveCreator();

  await prisma.program.deleteMany({});

  for (const program of PROGRAMS) {
    const applicationOpensAt = utcDate(program.applicationOpensAt);
    const applicationClosesAt = utcDate(program.applicationClosesAt);
    const startsAt = utcDate(program.startsAt);
    const endsAt = utcDate(program.endsAt);
    const cohort = deriveCohort(startsAt);

    await prisma.program.create({
      data: {
        name: program.name,
        description: program.description,
        price: program.price,
        cohort,
        coverImage: `https://picsum.photos/seed/${program.coverSeed}/640/420`,
        applicationOpensAt,
        startsAt,
        endsAt,
        applicationClosesAt,
        programBenefits: DEFAULT_PROGRAM_BENEFITS,
        requirements: DEFAULT_PROGRAM_REQUIREMENTS,
        isActive: endsAt.getTime() >= now.getTime(),
        createdById: creator.id,
        updatedById: creator.id,
      },
    });
  }

  console.log(`Seeded ${PROGRAMS.length} programs using ${creator.email}.`);
}

seedPrograms()
  .catch((error) => {
    console.log("[seed:programs]", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
