import createMentorAction from "@/actions/auth-actions/createMentorAction";
import { globalStore } from "@/store/zustand/globalStore";
import {
  MentorStoreInterface,
  MentorRegDataInterface,
  MentorRegFormStateInterface,
} from "@/utils/types";
import { Gender } from "@/utils/prisma";
import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { guardError, networkError } from "@/utils/error-helpers";
import { GENERAL_FORM_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE } from "@/utils/constants";

function createDefaultRegData(): MentorRegDataInterface {
  return {
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: Gender.FEMALE,
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    passport: "",
    idCard: "",
    programId: undefined,
  };
}

export const mentorStore = create<MentorStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        regData: createDefaultRegData(),
        setRegData: (name, value) =>
          set((state) => ({
            regData: {
              ...(state.regData ?? createDefaultRegData()),
              [name]: value,
            },
          })),
        resetRegData: () => set({ regData: createDefaultRegData() }),

        regFormState: {},
        setRegFormState: (value: MentorRegFormStateInterface) =>
          set({ regFormState: value }),

        // //>REGISTER HANDLER
        registerHandler: async (regData: MentorRegDataInterface) => {
          globalStore.setState({ generalLoading: true });

          try {
            const result = await createMentorAction(regData);

            if (result.error) {
              const message = result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;

              set({
                regFormState: {
                  error: {
                    message,
                    formErrors: result.error.formErrors,
                  },
                },
              });

              toast.error(message);
              return false;
            }

            set({
              regFormState: {
                success: {
                  message:
                    result.success?.message ??
                    "Mentor registered. Check your email to verify your account.",
                },
              },
            });

            toast.success(
              result.success?.message ??
                "Mentor registered. Check your email to verify your account.",
            );
            globalStore.getState().closeModal();
            return true;
          } catch (error: unknown) {
            const message = networkError(guardError(error))
              ? NETWORK_ERROR_MESSAGE
              : guardError(error);

            set({
              regFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });

            toast.error(message);
            return false;
          } finally {
            globalStore.setState({ generalLoading: false });
          }
        },
      }),
      {
        name: "mentor_store",
        partialize: (state) => ({
          regData: state.regData,
        }),
      },
    ),
  ),
);
