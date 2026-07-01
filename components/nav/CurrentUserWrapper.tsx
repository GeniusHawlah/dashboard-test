import { getCachedSession } from "@/utils/getCachedSession";
import { getMe } from "@/utils/fetch-functions/getMe";
import CurrentUser from "./CurrentUser";

export default async function CurrentUserWrapper() {
  const session = await getCachedSession();

  if (!session) return null;

  const getMeResponse = await getMe({
    session,
  });

  if (!getMeResponse.success) return null;

  return (
    <CurrentUser
      session={{
        ...session,
        user: {
          ...session.user,
          firstName: getMeResponse.success.data.firstName,
          lastName: getMeResponse.success.data.lastName,
          email: getMeResponse.success.data.email,
          passport: getMeResponse.success.data.passport,
          role: getMeResponse.success.data.role,
        },
      }}
    />
  );
}
