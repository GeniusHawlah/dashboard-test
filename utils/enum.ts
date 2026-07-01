export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum RelativeRoutes {
  HOMEPAGE = "/",
  DASHBOARD_HOMEPAGE = "/dashboard",
  LOGIN_PAGE = "/",
  SIGNUP_PAGE = "/sign-up",
}

export enum RegType {
  credentials = "credentials",
  google = "google",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNAPPROVED = "UNAPPROVED",
  SUSPENDED = "SUSPENDED",
  RESIGNED = "RESIGNED",
  SACKED = "SACKED",
}

export enum Themes {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

export enum SortKeys {
  popularity = "popularity",
  empty = "",
}

export enum SortOrders {
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  TOTAL_HIGHEST = "TOTAL_HIGHEST",
  TOTAL_LOWEST = "TOTAL_LOWEST",
  CA_HIGHEST = "CA_HIGHEST",
  CA_LOWEST = "CA_LOWEST",
  EXAM_HIGHEST = "EXAM_HIGHEST",
  EXAM_LOWEST = "EXAM_LOWEST",
  PUBLISHED_FIRST = "PUBLISHED_FIRST",
  UNPUBLISHED_FIRST = "UNPUBLISHED_FIRST",
  LOCKED_FIRST = "LOCKED_FIRST",
  UNLOCKED_FIRST = "UNLOCKED_FIRST",
}

export enum PaymentSortOrders {
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  AMOUNT_LOWEST = "AMOUNT_LOWEST",
  AMOUNT_HIGHEST = "AMOUNT_HIGHEST",
  PARTIAL_FIRST = "PARTIAL_FIRST",
  PAID_FIRST = "PAID_FIRST",
  UNPAID_FIRST = "UNPAID_FIRST",
}

export enum PaymentCollectibility {
  COLLECTIBLE = "COLLECTIBLE",
  NON_COLLECTIBLE = "NON_COLLECTIBLE",
}

export enum FeeSortOrders {
  TITLE_ASC = "TITLE_ASC",
  TITLE_DESC = "TITLE_DESC",
  AMOUNT_LOWEST = "AMOUNT_LOWEST",
  AMOUNT_HIGHEST = "AMOUNT_HIGHEST",
  CLASS_ASC = "CLASS_ASC",
  CLASS_DESC = "CLASS_DESC",
}

export enum TeacherSortOrders {
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  POSITION_ASC = "POSITION_ASC",
  POSITION_DESC = "POSITION_DESC",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  PUBLISHED_FIRST = "PUBLISHED_FIRST",
  UNPUBLISHED_FIRST = "UNPUBLISHED_FIRST",
}

export enum AdminSortOrders {
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export enum ProgramSortOrders {
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  STARTS_ASC = "STARTS_ASC",
  STARTS_DESC = "STARTS_DESC",
  ENDS_ASC = "ENDS_ASC",
  ENDS_DESC = "ENDS_DESC",
  APPLICATION_OPENS_ASC = "APPLICATION_OPENS_ASC",
  APPLICATION_OPENS_DESC = "APPLICATION_OPENS_DESC",
  APPLICATION_CLOSES_ASC = "APPLICATION_CLOSES_ASC",
  APPLICATION_CLOSES_DESC = "APPLICATION_CLOSES_DESC",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export enum EventTimelineFilters {
  ALL = "all",
  UPCOMING = "upcoming",
  ONGOING = "ongoing",
  ENDED = "ended",
  THIS_YEAR = "this_year",
  THIS_MONTH = "this_month",
  THIS_WEEK = "this_week",
  NEXT_SIX_MONTHS = "next_six_months",
  MANUAL = "manual",
}

export enum EventStatusFilters {
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum EventSortOrders {
  CLOSEST_FIRST = "CLOSEST_FIRST",
  FARTHEST_FIRST = "FARTHEST_FIRST",
}

export enum MentorScoreSortOrders {
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  SCORE_HIGHEST = "SCORE_HIGHEST",
  SCORE_LOWEST = "SCORE_LOWEST",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export enum ClassLevelSortOrders {
  CLASS_ASC = "CLASS_ASC",
  CLASS_DESC = "CLASS_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  MOST_CLASSROOMS = "MOST_CLASSROOMS",
  MOST_SUBJECTS = "MOST_SUBJECTS",
  MOST_STUDENTS = "MOST_STUDENTS",
}

export enum ClassroomSortOrders {
  CLASS_ASC = "CLASS_ASC",
  CLASS_DESC = "CLASS_DESC",
  ARM_ASC = "ARM_ASC",
  ARM_DESC = "ARM_DESC",
  MOST_STUDENTS = "MOST_STUDENTS",
}

export enum SubjectSortOrders {
  TITLE_ASC = "TITLE_ASC",
  TITLE_DESC = "TITLE_DESC",
  CLASS_ASC = "CLASS_ASC",
  CLASS_DESC = "CLASS_DESC",
}
