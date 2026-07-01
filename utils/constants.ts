import { NavItemsInterface } from "./types";

type BrainBehindParagraph = {
  parts: {
    text: string;
    className?: string;
  }[];
};

export const brainBehindContent = {
  eyebrow: "Brain Behind Us",
  title: "Prof. Dotun Fakanle",
  alt: "Prof. Dotun Fakanle",
  socialHeading: "Follow his work",
  socialLinks: [
    {
      href: process.env.NEXT_PUBLIC_GoFinance_PERSONAL_FB_LINK?.trim() || "#",
      label: "Facebook",
      icon: "ri:facebook-fill",
    },
    {
      href: "#",
      label: "Instagram",
      icon: "ri:instagram-line",
    },
    {
      href: "#",
      label: "X",
      icon: "ri:twitter-x-line",
    },
    {
      href: "#",
      label: "LinkedIn",
      icon: "ri:linkedin-fill",
    },
    {
      href: "#",
      label: "YouTube",
      icon: "ri:youtube-fill",
    },
  ],
  paragraphs: [
    {
      parts: [
        {
          text: "Clinical Professor Olamidotun Fakanle",
          className: "font-semibold text-slate-900",
        },
        {
          text: " also known as ",
        },
        {
          text: "Dotmanfak",
          className: "font-semibold text-slate-900",
        },
        {
          text: ", is a ",
        },
        {
          text: "Psychiatric Nurse Practitioner, College Professor, and Leadership Mentor",
          className: "font-semibold text-slate-900",
        },
        {
          text: ". He brings together healthcare, teaching, and mentorship in a way that keeps the foundation grounded in service, excellence, and real-world impact.",
        },
      ],
    },
    {
      parts: [
        {
          text: "Through initiatives such as the Science Impact Initiative in Aramoko Ekiti, Nigeria, he champions opportunities that equip young people with ICT exposure, AI awareness, and practical health education. His work reflects a steady commitment to helping students learn confidently, lead responsibly, and grow with purpose.",
        },
      ],
    },
    {
      parts: [
        {
          text: "He maintains an active professional and community presence across several platforms, making it easy to stay connected with the ideas, projects, and programs he shares publicly.",
        },
      ],
    },
  ],
} satisfies {
  eyebrow: string;
  title: string;
  alt: string;
  socialHeading: string;
  socialLinks: {
    href: string;
    label: string;
    icon: string;
  }[];
  paragraphs: BrainBehindParagraph[];
};

export const DATABASE_NOT_READY_LOG_MESSAGE =
  "The database is missing required tables. Apply the Prisma migrations to this new database.";

export const ACCESS_TOKEN_COOKIE_NAME = "GoFinance:access-token";
export const AUTH_SESSION_COOKIE_NAME = "GoFinance:session";
export const AUTH_COOKIE_REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;

export const PROGRAM_BENEFIT_SUGGESTIONS = [
  "Certificate of Completion",
  "Access to Mentors",
  "Networking Opportunities",
  "Real-world Projects",
  "Career Guidance",
  "Exclusive Resources",
  "Personalized Mentorship",
  "Technical Workshops",
  "Career Coaching",
  "Certification",
  "Portfolio Development",
  "Project Feedback",
  "Peer Learning",
  "Industry Insights",
  "Showcase Opportunities",
] as const;

export const PROGRAM_REQUIREMENT_SUGGESTIONS = [
  "Laptop or desktop access",
  "Stable internet access",
  "Virtual session attendance",
  "In-person session attendance",
  "Program commitment",
  "Mentorship session attendance",
  "Task completion",
  "Project completion",
  "Group participation",
  "Willingness to learn",
  "Openness to feedback",
  "Peer collaboration",
  "Subject interest",
  "Computer literacy",
  "Digital communication skills",
  "English proficiency",
  "Basic subject knowledge",
  "Prior experience",
  "Portfolio submission",
  "CV/Resume submission",
  "Personal statement",
  "Recommendation letter",
  "Valid identification",
  "Student verification",
  "Recent graduate status",
  "Employment verification",
  "Minimum age requirement",
  "Eligible residency",
  "Weekly time commitment",
  "Full program availability",
  "Required software access",
  "Active email address",
  "Active phone number",
  "Application form completion",
  "Assessment completion",
  "Interview completion",
  "Code of conduct agreement",
  "Terms acceptance",
  "Privacy policy acceptance",
  "Professional conduct",
  "Attendance compliance",
  "Deadline compliance",
  "Mentor engagement",
  "Progress reporting",
  "Community participation",
  "Independent work ability",
  "Teamwork ability",
  "Career growth interest",
  "Leadership interest",
  "Continuous learning mindset",
  "Practical project readiness",
  "Networking participation",
  "Milestone completion",
  "Policy compliance",
] as const;

export const DASHBOARD_NAV_ITEMS: NavItemsInterface[] = [
  {
    title: "Dashboard",
    slug: "dashboard",
    icon: "material-symbols-light:dashboard-outline-rounded",
  },
  {
    title: "TestNav1",
    slug: "dashboard2",
    icon: "ph:users-three",
  },
  {
    title: "TestNav2",
    slug: "dashboard2",
    icon: "carbon:result",
  },
  {
    title: "TestNav3",
    slug: "dashboard2",
    icon: "ph:calendar-dots",
  },
];

export const NETWORK_ERROR_MESSAGE =
  "Network error, please check your connection.";

export const GENERAL_FORM_ERROR_MESSAGE =
  "Please fix the error(s) in the form.";

export const TITLES = [
  "Mr",
  "Mrs",
  "Ms",
  "Madam",
  "Alhaji",
  "Alhaja",
  "Dr.",
  "Rev.",
  "Miss",
  "Prof.",
  "Engr",
  "Chief",
  "Nee",
  "Chief Mrs",
  "Gov.",
  "Sen.",
  "Rep.",
  "Oba",
  "Elder",
  "Hon.",
  "Sir",
  "Lord",
  "Lady",
  "Capt.",
  "Lt.",
  "Col.",
  "Maj.",
  "Gen.",
  "Adm.",
  "Sgt.",
  "Cpl.",
  "Rev. Fr.",
  "Rt. Hon.",
];

export const AUTHORIZATION_ERROR_MESSAGE =
  "You are not authorized to perform this action.";

export const AUTHENTICATION_ERROR_MESSAGE = "You are not authenticated.";

export const INACTIVE_ERROR_MESSAGE =
  "Your account is inactive, contact admin or support.";

export const UNAPPROVED_ERROR_MESSAGE =
  "Your mentorship application is yet to be approved, you will receive a mail when we approve.";

export const EMAIL_NOT_VERIFIED_ERROR_MESSAGE =
  "Your email is not verified. Check your email inbox or spam folder for the verification link.  ";

export const AUTH_LOGIN_EXPECTED_ERROR_MESSAGES = [
  "email not verified",
  "invalid email",
  "invalid password",
  "invalid email or password",
  UNAPPROVED_ERROR_MESSAGE.toLowerCase(),
] as const;
