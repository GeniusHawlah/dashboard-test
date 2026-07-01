import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Gender } from "@prisma/client";
import createMenteeAction from "@/actions/auth-actions/createMenteeAction";
import updateMenteeStatusAction, {
  type UpdateMenteeStatusActionData,
} from "@/actions/mentee-action/updateMenteeStatusAction";
import { DEFAULT_EDUCATION_LEVEL } from "@/utils/education-level";
import { globalStore } from "./globalStore";
import { guardError, networkError } from "@/utils/error-helpers";
import {
  GENERAL_FORM_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import {
  MenteeRegDataInterface,
  MenteeStoreInterface,
} from "@/utils/types";

const createDefaultRegData = (): MenteeRegDataInterface => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  educationLevel: DEFAULT_EDUCATION_LEVEL,
  gender: Gender.FEMALE,
  dateOfBirth: "",
  phoneNumber: "",
  passport: "",
  idCard: undefined,
  programId: undefined,
});

export const menteeStore = create<MenteeStoreInterface>()(
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
        setRegFormState: (value) => set({ regFormState: value }),

        // //>REGISTER HANDLER
        registerHandler: async (regData: MenteeRegDataInterface) => {
          globalStore.setState({ generalLoading: true });

          try {
            const result = await createMenteeAction(regData);

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
                  message: result.success?.message ??
                    "Mentee registered. Check your email to verify your account.",
                },
              },
            });

            toast.success(
              result.success?.message ??
                "Mentee registered. Check your email to verify your account.",
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

        // >UPDATE MENTEE STATUS HANDLER
        updateMenteeStatusHandler: async (
          data: UpdateMenteeStatusActionData,
        ) => {
          globalStore.setState({ generalLoading: true });

          try {
            const result = await updateMenteeStatusAction(data);

            if (result.error) {
              const message =
                result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;
              toast.error(message);
              return false;
            }

            const message =
              result.success?.message ?? "Mentee status updated.";

            toast.success(message);
            globalStore.getState().closeModal();
            return true;
          } catch (error: unknown) {
            const message = networkError(guardError(error))
              ? NETWORK_ERROR_MESSAGE
              : guardError(error);

            toast.error(message);
            return false;
          } finally {
            globalStore.setState({ generalLoading: false });
          }
        },
      }),
      {
        name: "mentee_store",
        partialize: (state) => ({ regData: state.regData }),
      },
    ),
  ),
);
