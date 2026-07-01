import { Gender, UserStatus as PrismaUserStatus } from "@prisma/client";
import type { Prisma, UserRole } from "@prisma/client";
import { ReactNode } from "react";
import type { UpdateMenteeStatusActionData } from "@/actions/mentee-action/updateMenteeStatusAction";
import type { FakeAuthSession } from "@/utils/auth-session";
import type { EducationLevelValue } from "./education-level";
import type { ImageInputValue } from "./imageUploadTypes";
import { RegType, SortKeys, SortOrders, UserStatus } from "./enum";

//#------------CREATE GUARDIAN-------------------

export interface CreateGuardianFormInterface {
  title: string;

  firstName: string;
  lastName: string;

  phoneNumber: string;
  email: string;
  address: string;
  gender: Gender;
  // passport?: ImageInputValue;

  relationship: string;
}

export interface CreateGuardianFormErrors {
  firstName?: { errors: string[] };
  lastName?: { errors: string[] };
  email?: { errors: string[] };
  title?: { errors: string[] };
  gender?: { errors: string[] };
  phoneNumber?: { errors: string[] };
  address?: { errors: string[] };
  passport?: { errors: string[] };
  idCard?: { errors: string[] };
}

export interface CreateGuardianFormState {
  error?: {
    message: string;
    formErrors?: CreateGuardianFormErrors;
  };

  success?: {
    message: string;
  };
}

//#--------------LOGIN-----------------

export interface LoginDataInterface {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFormErrors {
  email?: { errors: string[] };
  password?: { errors: string[] };
}

export interface LoginFormStateInterface {
  error?: {
    message: string;
    formErrors?: LoginFormErrors;
  };

  success?: {
    message: string;
    session?: FakeAuthSession | null;
  };
}

export interface SignUpDataInterface {
  firstName: string;
  lastName: string;
  role: UserRole;
  passport?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpFormErrorsInterface {
  firstName?: { errors: string[] };
  lastName?: { errors: string[] };
  role?: { errors: string[] };
  passport?: { errors: string[] };
  email?: { errors: string[] };
  password?: { errors: string[] };
  confirmPassword?: { errors: string[] };
}

export interface SignUpFormStateInterface {
  error?: {
    message: string;
    formErrors?: SignUpFormErrorsInterface;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

export interface ForgotPasswordDataInterface {
  email: string;
}

export interface ForgotPasswordFormErrors {
  email?: { errors: string[] };
}

export interface ForgotPasswordFormStateInterface {
  error?: {
    message: string;
    formErrors?: ForgotPasswordFormErrors;
  };
  success?: {
    message: string;
  };
}

export interface ResetPasswordDataInterface {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormErrors {
  email?: { errors: string[] };
  code?: { errors: string[] };
  password?: { errors: string[] };
  confirmPassword?: { errors: string[] };
}

export interface ResetPasswordFormStateInterface {
  error?: {
    message: string;
    formErrors?: ResetPasswordFormErrors;
  };
  success?: {
    message: string;
  };
}

export interface InitialPasswordDataInterface {
  newPassword: string;
  confirmNewPassword: string;
}

export interface InitialPasswordFormErrorsInterface {
  newPassword?: { errors: string[] };
  confirmNewPassword?: { errors: string[] };
}

export interface InitialPasswordFormStateInterface {
  error?: {
    message: string;
    formErrors?: InitialPasswordFormErrorsInterface;
  };
  success?: {
    message: string;
    redirectTo: string;
  };
}

//#-------------CONTACT US------------------

export interface ContactUsFormInterface {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactUsFormErrors {
  name?: { errors: string[] };
  email?: { errors: string[] };
  subject?: { errors: string[] };
  message?: { errors: string[] };
}

export interface ContactUsFormStateInterface {
  error?: {
    message: string;
    formErrors?: ContactUsFormErrors;
  };
  success?: {
    message: string;
  };
}

//#-------------CREATE SCORE------------------

export interface CreateScoreFormInterface {
  eventScoreId: string;
  subjectId: string;
  caScore: number;
  examScore: number;
  remark?: string;
}

export interface CreateScoreFormErrors {
  eventScoreId?: { errors: string[] };
  subjectId?: { errors: string[] };
  caScore?: { errors: string[] };
  examScore?: { errors: string[] };
  remark?: { errors: string[] };
}

export interface CreateScoreFormState {
  error?: {
    message: string;
    formErrors?: CreateScoreFormErrors;
  };
  success?: {
    message: string;
  };
}

//#-------------------------------
export interface CreateSessionFormInterface {
  name: string;
  isCurrent?: boolean;
}

export interface CreateSessionFormErrors {
  name?: { errors: string[] };
  isCurrent?: { errors: string[] };
}

export interface CreateSessionFormState {
  error?: {
    message: string;
    formErrors?: CreateSessionFormErrors;
  };
  success?: {
    message: string;
  };
}

//#------------CREATE PROGRAM-------------------

export interface CreateProgramDataInterface {
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
  applicationOpensAt?: Date;
  startsAt: Date;
  endsAt?: Date;
  applicationClosesAt?: Date;
  programBenefits: string[];
  requirements: string[];
  mentorIds: string[];
  coverImage?: ImageInputValue;
}

export interface CreateProgramFormDataInterface {
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  applicationOpensAt: string;
  applicationClosesAt: string;
  startsAt: string;
  endsAt: string;
  programBenefits: string[];
  requirements: string[];
  mentorIds: string[];
  coverImage: ImageInputValue;
}

export interface CreateProgramFormErrors {
  name?: { errors: string[] };
  description?: { errors: string[] };
  price?: { errors: string[] };
  isActive?: { errors: string[] };
  applicationOpensAt?: { errors: string[] };
  startsAt?: { errors: string[] };
  endsAt?: { errors: string[] };
  applicationClosesAt?: { errors: string[] };
  programBenefits?: { errors: string[] };
  requirements?: { errors: string[] };
  mentorIds?: { errors: string[] };
  coverImage?: { errors: string[] };
}

export interface CreateProgramFormState {
  error?: {
    message: string;
    formErrors?: CreateProgramFormErrors;
  };
  success?: {
    message: string;
  };
}

//#------------CREATE EVENT-------------------

export interface CreateEventDataInterface {
  programId: string;
  title: string;
  description?: string;
  note?: string;
  venue: string;
  eventDate: Date;
  eventTime: string;
}

export interface CreateEventFormDataInterface {
  programId: string;
  title: string;
  description: string;
  note: string;
  venue: string;
  eventDate: string;
  eventTime: string;
}

export interface CreateEventFormErrors {
  programId?: { errors: string[] };
  title?: { errors: string[] };
  description?: { errors: string[] };
  note?: { errors: string[] };
  venue?: { errors: string[] };
  eventDate?: { errors: string[] };
  eventTime?: { errors: string[] };
}

export interface CreateEventFormState {
  error?: {
    message: string;
    formErrors?: CreateEventFormErrors;
  };
  success?: {
    message: string;
  };
}

export interface UpdateEventDataInterface {
  title: string;
  description?: string;
  note?: string;
  venue: string;
  eventDate: Date;
  eventTime: string;
}

export interface UpdateEventFormDataInterface {
  title: string;
  description: string;
  note: string;
  venue: string;
  eventDate: string;
  eventTime: string;
}

export interface UpdateEventFormErrors {
  title?: { errors: string[] };
  description?: { errors: string[] };
  note?: { errors: string[] };
  venue?: { errors: string[] };
  eventDate?: { errors: string[] };
  eventTime?: { errors: string[] };
}

export interface UpdateEventFormState {
  error?: {
    message: string;
    formErrors?: UpdateEventFormErrors;
  };
  success?: {
    message: string;
  };
}

//#------------CREATE EVENT SCORE-------------------

export interface CreateEventScoreFormInterface {
  userId: string;
  published: boolean;
  locked: boolean;
}

export interface CreateEventScoreFormErrors {
  userId?: { errors: string[] };
  published?: { errors: string[] };
  locked?: { errors: string[] };
}

export type TeacherSubject = {
  id: string;
  title: string;
  code: string | null;
  classroom: {
    id: string;
    name: string;
    arm: string | null;
    studentCount: number;
  } | null;
};

export interface CreateEventScoreFormState {
  error?: {
    message: string;
    formErrors?: CreateEventScoreFormErrors;
  };
  success?: {
    message: string;
  };
}

export interface CreateAdminFormDataInterface {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  passport: ImageInputValue;
  idCard: ImageInputValue;
  role: UserRole;
}

export interface CreateAdminFormErrorsInterface {
  role?: { errors: string[] };
  title?: { errors: string[] };
  firstName?: { errors: string[] };
  lastName?: { errors: string[] };
  email?: { errors: string[] };
  gender?: { errors: string[] };
  dateOfBirth?: { errors: string[] };
  phoneNumber?: { errors: string[] };
  address?: { errors: string[] };
  passport?: { errors: string[] };
  idCard?: { errors: string[] };
}

export interface CreateAdminFormStateInterface {
  error?: {
    message: string;
    formErrors?: CreateAdminFormErrorsInterface;
    statusCode?: number;
  };
  success?: {
    message: string;
  };
}

//#------------USER STORES-------------------

export interface GuardianStoreInterface {
  guardianFormState: CreateGuardianFormState;
  setGuardianFormState: (value: CreateGuardianFormState) => void;
  createGuardianHandler: (
    guardianData: CreateGuardianFormInterface,
  ) => Promise<void>;
}

export interface StudentStoreInterface {
  // registerStudentHandler: (regData: UserRegDataInterface) => Promise<boolean>;
  // regData: UserRegDataInterface | null;
  // setRegData: (
  //   name: keyof UserRegDataInterface,
  //   value: string | number,
  // ) => void;
  // regFormState: UserRegFormStateInterface;
  // setRegFormState: (regData: UserRegFormStateInterface) => void;
}

export interface AdminStoreInterface {
  createAdminFormData: CreateAdminFormDataInterface;
  setCreateAdminFormData: (value: CreateAdminFormDataInterface) => void;
  resetCreateAdminFormData: () => void;
  createAdminFormState: CreateAdminFormStateInterface;
  setCreateAdminFormState: (value: CreateAdminFormStateInterface) => void;
  createAdminHandler: (
    adminData: import("@/actions/admin-action/createAdminAction").CreateAdminData,
  ) => Promise<boolean>;
}

export interface ProgramStoreInterface {
  createProgramFormData: CreateProgramFormDataInterface;
  setCreateProgramFormData: (value: CreateProgramFormDataInterface) => void;
  resetCreateProgramFormData: () => void;
  createProgramFormState: CreateProgramFormState | null;
  setCreateProgramFormState: (value: CreateProgramFormState | null) => void;
  createProgramHandler: (
    programData: CreateProgramDataInterface,
  ) => Promise<boolean>;
  applyProgramHandler: (programId: string) => Promise<boolean>;
  changeProgramStageHandler: (programId: string) => Promise<boolean>;
}

export interface AuthStoreInterface {
  loginFormState: LoginFormStateInterface;
  setLoginFormState: (value: LoginFormStateInterface) => void;

  loginHandler: (userData: LoginDataInterface) => Promise<void>;
  signUpFormState: SignUpFormStateInterface;
  setSignUpFormState: (value: SignUpFormStateInterface) => void;
  signUpHandler: (userData: SignUpDataInterface) => Promise<void>;
  initialPasswordFormState: InitialPasswordFormStateInterface;
  setInitialPasswordFormState: (
    value: InitialPasswordFormStateInterface,
  ) => void;
  changeInitialPasswordHandler: (
    userData: InitialPasswordDataInterface,
  ) => Promise<void>;
  forgotPasswordFormState: ForgotPasswordFormStateInterface;
  setForgotPasswordFormState: (value: ForgotPasswordFormStateInterface) => void;
  forgotPasswordHandler: (
    userData: ForgotPasswordDataInterface,
  ) => Promise<boolean>;
  resetPasswordFormState: ResetPasswordFormStateInterface;
  setResetPasswordFormState: (value: ResetPasswordFormStateInterface) => void;
  resetPasswordHandler: (
    userData: ResetPasswordDataInterface,
  ) => Promise<boolean>;
  logoutHandler: () => Promise<void>;
}

export interface EmailStoreInterface {
  contactData: ContactUsFormInterface;
  setContactData: <K extends keyof ContactUsFormInterface>(
    name: K,
    value: ContactUsFormInterface[K],
  ) => void;
  resetContactData: () => void;
  contactFormState: ContactUsFormStateInterface | null;
  setContactFormState: (value: ContactUsFormStateInterface | null) => void;
  contactUsHandler: (
    contactData: ContactUsFormInterface,
  ) => Promise<boolean>;
}

export interface MenteeRegDataInterface {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  educationLevel: EducationLevelValue;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber?: string;
  address?: string;
  passport?: ImageInputValue;
  idCard?: ImageInputValue;
  programId?: string | null;
}

export interface MenteeRegFormErrorsInterface {
  firstName?: { errors: string[] };
  middleName?: { errors: string[] };
  lastName?: { errors: string[] };
  email?: { errors: string[] };
  password?: { errors: string[] };
  confirmPassword?: { errors: string[] };
  educationLevel?: { errors: string[] };
  gender?: { errors: string[] };
  dateOfBirth?: { errors: string[] };
  phoneNumber?: { errors: string[] };
  address?: { errors: string[] };
  passport?: { errors: string[] };
  idCard?: { errors: string[] };
  programId?: { errors: string[] };
}

export interface MenteeRegFormStateInterface {
  error?: {
    message: string;
    formErrors?: MenteeRegFormErrorsInterface;
  };
  success?: {
    message: string;
  };
}

export interface MenteeStoreInterface {
  regData: MenteeRegDataInterface;
  setRegData: (
    name: keyof MenteeRegDataInterface,
    value: MenteeRegDataInterface[keyof MenteeRegDataInterface],
  ) => void;
  resetRegData: () => void;
  regFormState: MenteeRegFormStateInterface;
  setRegFormState: (value: MenteeRegFormStateInterface) => void;
  registerHandler: (regData: MenteeRegDataInterface) => Promise<boolean>;
  updateMenteeStatusHandler: (
    data: UpdateMenteeStatusActionData,
  ) => Promise<boolean>;
}

export interface MentorRegDataInterface {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  passport?: ImageInputValue;
  idCard?: ImageInputValue;
  programId?: string | null;
}

export interface MentorRegFormErrorsInterface {
  title?: { errors: string[] };
  firstName?: { errors: string[] };
  lastName?: { errors: string[] };
  email?: { errors: string[] };
  password?: { errors: string[] };
  confirmPassword?: { errors: string[] };
  gender?: { errors: string[] };
  dateOfBirth?: { errors: string[] };
  phoneNumber?: { errors: string[] };
  address?: { errors: string[] };
  passport?: { errors: string[] };
  idCard?: { errors: string[] };
  programId?: { errors: string[] };
}

export interface MentorRegFormStateInterface {
  error?: {
    message: string;
    formErrors?: MentorRegFormErrorsInterface;
  };
  success?: {
    message: string;
  };
}

export interface MentorStoreInterface {
  regData: MentorRegDataInterface;
  setRegData: (
    name: keyof MentorRegDataInterface,
    value: MentorRegDataInterface[keyof MentorRegDataInterface],
  ) => void;
  resetRegData: () => void;
  regFormState: MentorRegFormStateInterface;
  setRegFormState: (value: MentorRegFormStateInterface) => void;
  registerHandler: (regData: MentorRegDataInterface) => Promise<boolean>;
}

export interface EventStoreInterface {
  createEventFormData: CreateEventFormDataInterface;
  setCreateEventFormData: (value: CreateEventFormDataInterface) => void;
  resetCreateEventFormData: () => void;
  createEventFormState: CreateEventFormState | null;
  setCreateEventFormState: (value: CreateEventFormState | null) => void;
  createEventHandler: (
    eventData: CreateEventDataInterface,
  ) => Promise<boolean>;
  updateEventFormData: UpdateEventFormDataInterface;
  setUpdateEventFormData: (value: UpdateEventFormDataInterface) => void;
  resetUpdateEventFormData: () => void;
  updateEventFormState: UpdateEventFormState | null;
  setUpdateEventFormState: (value: UpdateEventFormState | null) => void;
  updateEventHandler: (
    eventId: string,
    eventData: UpdateEventDataInterface,
  ) => Promise<boolean>;
}

export interface EventScoreStoreInterface {
  createEventScoreHandler: (
    eventScoreData: CreateEventScoreFormInterface,
  ) => Promise<void>;
  eventScoreFormState: CreateEventScoreFormState | null;
  setEventScoreFormState: (
    value: CreateEventScoreFormState,
  ) => void;
}

export interface ScoreStoreInterface {
  selectedScoreId: string | null;
  setSelectedScoreId: (value: string | null) => void;

  syncMissingScoresHandler: () => Promise<boolean>;
  scoreFormState: CreateScoreFormState | null;
  setScoreFormState: (value: CreateScoreFormState) => void;
}

//#-------------GLOBAL STORE------------------

export interface GlobalStoreInterface {
  revalidating: boolean;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  generalLoading: boolean;
  setGeneralLoading: (loading: boolean) => void;
  persistedDataReady: boolean;
  hydrateData: () => void;
  menuClicked: boolean;
  setMenuClicked: (value: boolean) => void;
  isLandingMobileSidebarExpanded: boolean;
  setIsLandingMobileSidebarExpanded: (value: boolean) => void;
  toggleLandingMobileSidebar: () => void;
  isDashboardMobileSidebarExpanded: boolean;
  setIsDashboardMobileSidebarExpanded: (value: boolean) => void;
  toggleDashboardMobileSidebar: () => void;
  isRouting: boolean;
  setIsRouting: (value: boolean) => void;
  modalIsOpen: boolean;
  content: ReactNode | null;
  modalProps: GeneralModalProps;
  openModal: (
    content: ReactNode | null,
    modalProps?: GeneralModalProps,
  ) => void;
  closeModal: () => void;
}

//<-------------END------------------

export interface AdageResponse {
  data: Adage[] | [];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface Adage {
  id: number;
  yoruba?: string;
  closeTranslation?: string;
  equivalentTranslation?: string;
  exampleUsage?: string;
  timesCopied: number;
  likes: number;
  popularity: number;
  poster: Poster;
  favBy: number[];
  categories: Category[];
  isFavByUser: boolean;
}

export interface Poster {
  firstName: string;
  lastName: string;
  nickname: string;
}

export interface Category {
  id: number;
  name: string;
}

interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

interface PaginationLinks {
  firstPage: string;
  lastPage: string;
  currentPage: string;
  nextPage: string;
  previousPage: string;
}

export interface AdageQueryParams {
  limit?: number;
  page?: number;
  sortBy?: SortKeys;
  searchKeyword?: string;
  sortOrder?: SortOrders;
  favByMe?: string;
  category?: string;
}

export interface SubmitAdageDataInterface {
  yoruba: string;
  closeTranslation: string;
  equivalentTranslation: string;
  exampleUsage?: string;
}

export interface InfoUpdateDataInterface {
  firstName: string;
  lastName: string;
  gender?: string;
  phone?: string;
  dob?: string;
}

export interface CurrentUserInterface {
  id: number;
  firstName: string;
  lastName?: string;
  nickname: string;
  email: string;
  role: UserRole;
  userStatus: UserStatus;
  regType: RegType;
}

export interface ChangePasswordDataInterface {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface SubmitAdageFormErrors {
  yoruba?: { errors: string[] };
  closeTranslation?: { errors: string[] };
  equivalentTranslation?: { errors: string[] };
  exampleUsage?: { errors: string[] };
}

export interface SubmitAdageFormState {
  error?: {
    message: string;
    formErrors?: SubmitAdageFormErrors;
  };

  success?: {
    message: string;
  };
}

export interface InfoUpdateFormStateInterface {
  success: boolean;
  message: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    phone?: string[];
    gender?: string[];
    dob?: string[];
  };
  data?: InfoUpdateDataInterface;
}

export interface ChangePasswordFormStateInterface {
  success: boolean;
  message: string;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmNewPassword?: string[];
  };
  data?: ChangePasswordDataInterface;
}

export interface VerifyEmailActionStateInterface {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    otp?: string[];
  };
  data?: { email: string; otp: string };
}

export type SystemsType = Record<
  number,
  {
    transcript: Transcript;
    cgpa: number;
    selectedSemester: Semester;
  }
>;

export interface GeneralModalProps {
  position?: string;
  size?: string;
  className?: string;
}

export interface NavItemsInterface {
  icon: string;
  title: string;
  slug: string;
  subjectId?: string;
  classroomId?: string;
  currentSession?: string;
  currentTerm?: string;
}

export type ActionLogDatePreset =
  | "recent"
  | "24h"
  | "7d"
  | "14d"
  | "30d"
  | "range";

export type ActionLogStatusValue = "SUCCESS" | "FAILED" | "INFO";

export interface ActionLogItem {
  id: string;
  action: string;
  functionName: string;
  status: ActionLogStatusValue;
  message: string | null;
  performerId: string | null;
  performerName: string | null;
  performerEmail: string | null;
  performerRole: UserRole;
  targetType: string | null;
  targetId: string | null;
  targetName: string | null;
  metadata: Prisma.JsonValue | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface ActionLogsResponse {
  success?: {
    message: string;
    data: {
      logs: ActionLogItem[];
      rangeLabel: string;
      rangeStart: Date | null;
      rangeEnd: Date | null;
    };
    metadata: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      successCount: number;
      failedCount: number;
      infoCount: number;
    };
  };
  error?: {
    message: string;
    statusCode?: number;
  };
}

export interface Course {
  id: string;
  code: string;
  title: string;
  grade: "A" | "B" | "C" | "D" | "E" | "F" | "";
  credit: number;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
  gpa: number;
}

export type Transcript = Semester[];
