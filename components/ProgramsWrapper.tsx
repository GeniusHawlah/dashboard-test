import { getCachedSession } from "@/utils/getCachedSession";
import { getPrograms } from "@/utils/fetch-functions/getPrograms";
import { isMentee } from "@/utils/auth-helpers";
import Programs from "./Programs";

export default async function ProgramsWrapper() {
  const session = await getCachedSession();
  const programsResponse = await getPrograms({
    userId: session?.user?.id,
  });

  return (
    <Programs
      programsResponse={programsResponse}
      canApply={isMentee({ session })}
      isAuthenticated={Boolean(session)}
    />
  );
}
