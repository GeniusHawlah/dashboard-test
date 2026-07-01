import { createLog } from "@/actions/log-action/createLog";
import { ActionLogStatus } from "@/utils/prisma";
import { getCachedSession } from "@/utils/getCachedSession";

type ActionLogContext = Record<string, unknown>;

type ActionStartInput = {
  action: string;
  context?: ActionLogContext;
};

type ActionResultInput = {
  action: string;
  message: string;
  context?: ActionLogContext;
};

function compactContext(context?: ActionLogContext) {
  if (!context) return undefined;

  const entries = Object.entries(context).filter(
    ([, value]) => value !== undefined,
  );

  if (entries.length === 0) return undefined;

  return Object.fromEntries(entries);
}

function getContextId(context: ActionLogContext | undefined, key: string) {
  const value = context?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getLogTarget(context: ActionLogContext | undefined) {
  const type = getContextId(context, "targetType");
  const id =
    getContextId(context, "targetId") ??
    getContextId(context, "studentId") ??
    getContextId(context, "teacherId") ??
    getContextId(context, "adminId") ??
    getContextId(context, "userId");
  const name =
    getContextId(context, "targetName") ??
    getContextId(context, "studentName") ??
    getContextId(context, "teacherName") ??
    getContextId(context, "adminName") ??
    getContextId(context, "userName");

  if (!type && !id && !name) return undefined;

  return { type, id, name };
}

async function getPerformer(context: ActionLogContext | undefined) {
  const actorId =
    getContextId(context, "actorId") ??
    getContextId(context, "performerId") ??
    getContextId(context, "performedById");

  if (actorId) return { id: actorId };

  try {
    const session = await getCachedSession();

    return session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }
      : undefined;
  } catch {
    return undefined;
  }
}

export function logActionStart({ action }: ActionStartInput) {
  console.log(`[action:start] ${action}`);
}

export async function logActionSuccess({
  action,
  message,
  context,
}: ActionResultInput) {
  console.log(`[action:success] ${action} - ${message}`);
  await createLog({
    action: message,
    functionName: action,
    message,
    status: ActionLogStatus.SUCCESS,
    performer: await getPerformer(context),
    target: getLogTarget(context),
    metadata: compactContext(context),
  });
}

export async function logActionFailure({
  action,
  message,
  context,
}: ActionResultInput) {
  console.log(
    `[action:failure] ${action} - ${message}`,
    compactContext(context),
  );
  await createLog({
    action: message,
    functionName: action,
    message,
    status: ActionLogStatus.FAILED,
    performer: await getPerformer(context),
    target: getLogTarget(context),
    metadata: compactContext(context),
  });
}

export async function logActionExpectedFailure({
  action,
  message,
  context,
}: ActionResultInput) {
  console.log(
    `[action:expected] ${action} - ${message}`,
    compactContext(context),
  );
  await createLog({
    action: message,
    functionName: action,
    message,
    status: ActionLogStatus.INFO,
    performer: await getPerformer(context),
    target: getLogTarget(context),
    metadata: compactContext(context),
  });
}
