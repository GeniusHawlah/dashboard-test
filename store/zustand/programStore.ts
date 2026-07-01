import createProgramAction from "@/actions/program-action/createProgramAction";
import applyProgramAction from "@/actions/program-action/applyProgramAction";
import updateProgramStageAction from "@/actions/program-action/updateProgramStageAction";
import ProgramApplicationSuccessModal from "@/components/programs/ProgramApplicationSuccessModal";
import {
  GENERAL_FORM_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import { guardError, networkError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/ordinaryConsoleLogger";
import { globalStore } from "./globalStore";
import type {
  CreateProgramDataInterface,
  CreateProgramFormDataInterface,
  ProgramStoreInterface,
} from "@/utils/types";
import { createElement } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

function createDefaultProgramFormData(): CreateProgramFormDataInterface {
  const startsAt = new Date();
  const futureStartsAt = new Date(
    startsAt.getTime() + 42 * 24 * 60 * 60 * 1000,
  );

  const toDateInput = (value: Date) => value.toISOString().slice(0, 10);

  return {
    name: "",
    description: "",
    price: "",
    isActive: false,
    applicationOpensAt: toDateInput(
      new Date(futureStartsAt.getTime() - 28 * 24 * 60 * 60 * 1000),
    ),
    applicationClosesAt: toDateInput(
      new Date(futureStartsAt.getTime() - 7 * 24 * 60 * 60 * 1000),
    ),
    startsAt: toDateInput(futureStartsAt),
    endsAt: toDateInput(
      new Date(futureStartsAt.getTime() + 63 * 24 * 60 * 60 * 1000),
    ),
    programBenefits: [],
    requirements: [],
    mentorIds: [],
    coverImage: "",
  };
}

export const programStore = create<ProgramStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        createProgramFormData: createDefaultProgramFormData(),
        setCreateProgramFormData: (value) =>
          set({ createProgramFormData: value }),
        resetCreateProgramFormData: () =>
          set({ createProgramFormData: createDefaultProgramFormData() }),
        createProgramFormState: null,
        setCreateProgramFormState: (value) =>
          set({ createProgramFormState: value }),

        // >CREATE PROGRAM HANDLER
        createProgramHandler: async (
          programData: CreateProgramDataInterface,
        ) => {
          logActionStart({
            action: "programStore.createProgramHandler",
            context: {
              name: programData.name,
            },
          });
          globalStore.setState({ generalLoading: true });
          set({ createProgramFormState: null });

          try {
            const result = await createProgramAction({
              name: programData.name.trim(),
              description: programData.description?.trim() || undefined,
              price: programData.price,
              isActive: programData.isActive ?? false,
              applicationOpensAt: programData.applicationOpensAt,
              startsAt: programData.startsAt,
              endsAt: programData.endsAt,
              applicationClosesAt: programData.applicationClosesAt,
              programBenefits: programData.programBenefits,
              requirements: programData.requirements,
              mentorIds: programData.mentorIds,
              coverImage: programData.coverImage ?? undefined,
            });

            if (result.error) {
              const message =
                result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;

              set({
                createProgramFormState: {
                  error: {
                    message,
                    formErrors: result.error.formErrors,
                  },
                },
              });

              logActionFailure({
                action: "programStore.createProgramHandler",
                message,
                context: {
                  name: programData.name,
                },
              });
              toast.error(message);
              return false;
            }

            const message =
              result.success?.message ?? "Program created successfully.";

            set({
              createProgramFormState: {
                success: {
                  message,
                },
              },
            });

            logActionSuccess({
              action: "programStore.createProgramHandler",
              message,
              context: {
                name: programData.name,
              },
            });
            toast.success(message);
            set({ createProgramFormData: createDefaultProgramFormData() });
            return true;
          } catch (error: unknown) {
            const message = networkError(guardError(error))
              ? NETWORK_ERROR_MESSAGE
              : guardError(error);

            set({
              createProgramFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });

            logActionFailure({
              action: "programStore.createProgramHandler",
              message,
              context: {
                name: programData.name,
              },
            });
            toast.error(message);
            return false;
          } finally {
            globalStore.setState({ generalLoading: false });
          }
        },

        // >APPLY PROGRAM HANDLER
        applyProgramHandler: async (programId: string) => {
          globalStore.setState({ generalLoading: true });

          try {
            const result = await applyProgramAction({ programId });

            if (result.error) {
              const message = result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;

              toast.error(message);
              return false;
            }

            toast.success(
              result.success?.message ??
                "Program application submitted successfully.",
            );
            globalStore.getState().openModal(
              createElement(ProgramApplicationSuccessModal),
              {
              size: "md",
              position: "center",
              className: "p-0",
              },
            );
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

        // >CHANGE PROGRAM STAGE HANDLER
        changeProgramStageHandler: async (programId: string) => {
          globalStore.setState({ generalLoading: true });

          try {
            const result = await updateProgramStageAction({ programId });

            if (result.error) {
              const message = result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;

              toast.error(message);
              return false;
            }

            const message =
              result.success?.message ?? "Program stage updated successfully.";

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
        name: "program_store",
        partialize: (state) => ({
          createProgramFormData: state.createProgramFormData,
        }),
      },
    ),
  ),
);
