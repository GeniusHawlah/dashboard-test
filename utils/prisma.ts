type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | {
      [key: string]: JsonValue;
    }
  | JsonValue[];

function createPrismaLikeProxy(): any {
  const callable = () => Promise.resolve(null);

  return new Proxy(callable, {
    get: () => createPrismaLikeProxy(),
    apply: () => Promise.resolve(null),
    construct: () => createPrismaLikeProxy(),
  });
}

export class PrismaClient {
  [key: string]: any;

  constructor() {
    return createPrismaLikeProxy();
  }

  async $transaction<T>(
    callback: (tx: PrismaClient) => Promise<T>,
  ): Promise<T>;
  async $transaction<T>(operations: Promise<T>[]): Promise<T[]>;
  async $transaction<T>(
    value: ((tx: PrismaClient) => Promise<T>) | Promise<T>[],
  ): Promise<T | T[]> {
    if (Array.isArray(value)) {
      return Promise.all(value);
    }

    return value(createPrismaLikeProxy() as PrismaClient);
  }
}

export namespace Prisma {
  export type JsonValue = import("./prisma").JsonValue;
  export type InputJsonValue = import("./prisma").JsonValue;
  export type TransactionClient = import("./prisma").PrismaClient;

  export class PrismaClientKnownRequestError extends Error {
    code?: string;
  }
  export class PrismaClientUnknownRequestError extends Error {}
  export class PrismaClientRustPanicError extends Error {}
  export class PrismaClientInitializationError extends Error {}
  export class PrismaClientValidationError extends Error {}
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum ActionLogStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  INFO = "INFO",
}

export enum UserRole {
  MENTOR = "MENTOR",
  MENTEE = "MENTEE",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  TECH_ADMIN = "TECH_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNAPPROVED = "UNAPPROVED",
  SUSPENDED = "SUSPENDED",
  RESIGNED = "RESIGNED",
  SACKED = "SACKED",
}

export enum ProgramEnrollmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
  DROPPED = "DROPPED",
}

export enum AssignmentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMPLETED = "COMPLETED",
}
