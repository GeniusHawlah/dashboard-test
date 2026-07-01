import { Gender, UserStatus as PrismaUserStatus } from "@/utils/prisma";
import type { Prisma, UserRole } from "@/utils/prisma";
import { ReactNode } from "react";
import type { FakeAuthSession } from "@/utils/auth-session";
import type { EducationLevelValue } from "./education-level";
import type { ImageInputValue } from "./imageUploadTypes";
import { RegType, SortKeys, SortOrders, UserStatus } from "./enum";

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

export interface AdminStoreInterface {
  createAdminFormData: CreateAdminFormDataInterface;
  setCreateAdminFormData: (value: CreateAdminFormDataInterface) => void;
  resetCreateAdminFormData: () => void;
  createAdminFormState: CreateAdminFormStateInterface;
  setCreateAdminFormState: (value: CreateAdminFormStateInterface) => void;
}

export interface AuthStoreInterface {
  loginFormState: LoginFormStateInterface;
  setLoginFormState: (value: LoginFormStateInterface) => void;

  loginHandler: (userData: LoginDataInterface) => Promise<void>;
  signUpFormState: SignUpFormStateInterface;
  setSignUpFormState: (value: SignUpFormStateInterface) => void;
  signUpHandler: (userData: SignUpDataInterface) => Promise<void>;

  logoutHandler: () => Promise<void>;
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
