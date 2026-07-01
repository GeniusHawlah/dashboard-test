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
  if (!context) {
    return undefined;
  }

  const entries = Object.entries(context).filter(
    ([, value]) => value !== undefined,
  );

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries);
}

export function logActionStart({ action, context }: ActionStartInput) {
  console.log(`[action:start] ${action}`, compactContext(context));
}

export function logActionSuccess({
  action,
  message,
  context,
}: ActionResultInput) {
  console.log(
    `[action:success] ${action} - ${message}`,
    compactContext(context),
  );
}

export function logActionFailure({
  action,
  message,
  context,
}: ActionResultInput) {
  console.log(
    `[action:failure] ${action} - ${message}`,
    compactContext(context),
  );
}
