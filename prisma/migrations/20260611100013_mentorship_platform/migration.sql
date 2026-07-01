-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ActionLogStatus" AS ENUM ('SUCCESS', 'FAILED', 'INFO');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MENTOR', 'MENTEE', 'ADMIN', 'TECH_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRANSFERRED', 'GRADUATED', 'EXPELLED', 'RESIGNED', 'SACKED', 'DECEASED');

-- CreateEnum
CREATE TYPE "ProgramEnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'DROPPED');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "seq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "apiRoute" TEXT,
    "status" "ActionLogStatus" NOT NULL DEFAULT 'SUCCESS',
    "message" TEXT,
    "performerId" TEXT,
    "performerName" TEXT,
    "performerEmail" TEXT,
    "performerRole" "UserRole",
    "targetType" TEXT,
    "targetId" TEXT,
    "targetName" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender",
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "title" TEXT,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayUsername" TEXT NOT NULL,
    "password" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passport" TEXT,
    "idCard" TEXT,
    "bio" TEXT,
    "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "programId" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MENTEE',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "levelCount" INTEGER NOT NULL DEFAULT 4,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenteeProgramEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "entryLevel" INTEGER NOT NULL DEFAULT 1,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "status" "ProgramEnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "droppedAt" TIMESTAMP(3),
    "note" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenteeProgramEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenteePromotion" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "programId" TEXT,
    "fromLevel" INTEGER NOT NULL,
    "toLevel" INTEGER NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "note" TEXT,
    "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performedById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenteePromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "level" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "average" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "grade" TEXT,
    "position" INTEGER,
    "remark" TEXT,
    "breakdown" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "lastRecalculatedAt" TIMESTAMP(3),
    "evaluatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipAssignment" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "programId" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorshipAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "idToken" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActionLog_createdAt_idx" ON "ActionLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActionLog_performerId_idx" ON "ActionLog"("performerId");

-- CreateIndex
CREATE INDEX "ActionLog_action_idx" ON "ActionLog"("action");

-- CreateIndex
CREATE INDEX "ActionLog_apiRoute_idx" ON "ActionLog"("apiRoute");

-- CreateIndex
CREATE INDEX "ActionLog_status_createdAt_idx" ON "ActionLog"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_displayUsername_key" ON "user"("displayUsername");

-- CreateIndex
CREATE INDEX "user_programId_idx" ON "user"("programId");

-- CreateIndex
CREATE INDEX "user_role_status_idx" ON "user"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE INDEX "Program_isActive_idx" ON "Program"("isActive");

-- CreateIndex
CREATE INDEX "MenteeProgramEnrollment_userId_idx" ON "MenteeProgramEnrollment"("userId");

-- CreateIndex
CREATE INDEX "MenteeProgramEnrollment_programId_idx" ON "MenteeProgramEnrollment"("programId");

-- CreateIndex
CREATE INDEX "MenteeProgramEnrollment_status_currentLevel_idx" ON "MenteeProgramEnrollment"("status", "currentLevel");

-- CreateIndex
CREATE UNIQUE INDEX "MenteeProgramEnrollment_userId_programId_key" ON "MenteeProgramEnrollment"("userId", "programId");

-- CreateIndex
CREATE INDEX "MenteePromotion_enrollmentId_idx" ON "MenteePromotion"("enrollmentId");

-- CreateIndex
CREATE INDEX "MenteePromotion_programId_idx" ON "MenteePromotion"("programId");

-- CreateIndex
CREATE INDEX "MenteePromotion_performedById_idx" ON "MenteePromotion"("performedById");

-- CreateIndex
CREATE INDEX "MenteePromotion_approvedById_idx" ON "MenteePromotion"("approvedById");

-- CreateIndex
CREATE INDEX "MenteePromotion_status_effectiveAt_idx" ON "MenteePromotion"("status", "effectiveAt");

-- CreateIndex
CREATE INDEX "Result_programId_level_idx" ON "Result"("programId", "level");

-- CreateIndex
CREATE INDEX "Result_enrollmentId_idx" ON "Result"("enrollmentId");

-- CreateIndex
CREATE INDEX "Result_evaluatedById_idx" ON "Result"("evaluatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_programId_level_key" ON "Result"("userId", "programId", "level");

-- CreateIndex
CREATE INDEX "MentorshipAssignment_mentorId_idx" ON "MentorshipAssignment"("mentorId");

-- CreateIndex
CREATE INDEX "MentorshipAssignment_menteeId_idx" ON "MentorshipAssignment"("menteeId");

-- CreateIndex
CREATE INDEX "MentorshipAssignment_programId_idx" ON "MentorshipAssignment"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipAssignment_mentorId_menteeId_programId_key" ON "MentorshipAssignment"("mentorId", "menteeId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "ActionLog" ADD CONSTRAINT "ActionLog_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeProgramEnrollment" ADD CONSTRAINT "MenteeProgramEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeProgramEnrollment" ADD CONSTRAINT "MenteeProgramEnrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteePromotion" ADD CONSTRAINT "MenteePromotion_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "MenteeProgramEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteePromotion" ADD CONSTRAINT "MenteePromotion_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteePromotion" ADD CONSTRAINT "MenteePromotion_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteePromotion" ADD CONSTRAINT "MenteePromotion_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "MenteeProgramEnrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_evaluatedById_fkey" FOREIGN KEY ("evaluatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipAssignment" ADD CONSTRAINT "MentorshipAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipAssignment" ADD CONSTRAINT "MentorshipAssignment_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipAssignment" ADD CONSTRAINT "MentorshipAssignment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
