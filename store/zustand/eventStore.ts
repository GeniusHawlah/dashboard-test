import createEventAction from "@/actions/event-action/createEventAction";
import updateEventAction from "@/actions/event-action/updateEventAction";
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
import type {
  CreateEventDataInterface,
  CreateEventFormDataInterface,
  EventStoreInterface,
  UpdateEventDataInterface,
  UpdateEventFormDataInterface,
} from "@/utils/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { globalStore } from "./globalStore";
import { toast } from "react-toastify";

function createDefaultEventFormData(): CreateEventFormDataInterface {
  return {
    programId: "",
    title: "",
    description: "",
    note: "",
    venue: "",
    eventDate: "",
    eventTime: "",
  };
}

function createDefaultUpdateEventFormData(): UpdateEventFormDataInterface {
  const now = new Date();

  return {
    title: "",
    description: "",
    note: "",
    venue: "",
    eventDate: now.toISOString().slice(0, 10),
    eventTime: now.toISOString().slice(11, 16),
  };
}

export const eventStore = create<EventStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        createEventFormData: createDefaultEventFormData(),
        setCreateEventFormData: (value) =>
          set({ createEventFormData: value }),
        resetCreateEventFormData: () =>
          set({ createEventFormData: createDefaultEventFormData() }),
        createEventFormState: null,
        setCreateEventFormState: (value) =>
          set({ createEventFormState: value }),

        // >CREATE EVENT HANDLER
        createEventHandler: async (eventData: CreateEventDataInterface) => {
          logActionStart({
            action: "eventStore.createEventHandler",
            context: {
              programId: eventData.programId,
              title: eventData.title,
            },
          });
          globalStore.setState({ generalLoading: true });
          set({ createEventFormState: null });

          try {
            const result = await createEventAction({
              programId: eventData.programId,
              title: eventData.title.trim(),
              description: eventData.description?.trim() || undefined,
              note: eventData.note?.trim() || undefined,
              venue: eventData.venue.trim(),
              eventDate: eventData.eventDate,
              eventTime: eventData.eventTime.trim(),
            });

            if (result.error) {
              const message = result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;

              set({
                createEventFormState: {
                  error: {
                    message,
                    formErrors: result.error.formErrors,
                  },
                },
              });

              logActionFailure({
                action: "eventStore.createEventHandler",
                message,
                context: {
                  programId: eventData.programId,
                  title: eventData.title,
                },
              });
              toast.error(message);
              return false;
            }

            const message =
              result.success?.message ?? "Event created successfully.";

            set({
              createEventFormState: {
                success: {
                  message,
                },
              },
            });

            logActionSuccess({
              action: "eventStore.createEventHandler",
              message,
              context: {
                programId: eventData.programId,
                title: eventData.title,
              },
            });
            toast.success(message);
            set({ createEventFormData: createDefaultEventFormData() });
            return true;
          } catch (error: unknown) {
            const message = networkError(guardError(error))
              ? NETWORK_ERROR_MESSAGE
              : guardError(error);

            set({
              createEventFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });

            logActionFailure({
              action: "eventStore.createEventHandler",
              message,
              context: {
                programId: eventData.programId,
                title: eventData.title,
              },
            });
            toast.error(message);
            return false;
          } finally {
            globalStore.setState({ generalLoading: false });
          }
        },

        updateEventFormData: createDefaultUpdateEventFormData(),
        setUpdateEventFormData: (value) =>
          set({ updateEventFormData: value }),
        resetUpdateEventFormData: () =>
          set({ updateEventFormData: createDefaultUpdateEventFormData() }),
        updateEventFormState: null,
        setUpdateEventFormState: (value) =>
          set({ updateEventFormState: value }),

        // >UPDATE EVENT HANDLER
        updateEventHandler: async (
          eventId: string,
          eventData: UpdateEventDataInterface,
        ) => {
          logActionStart({
            action: "eventStore.updateEventHandler",
            context: {
              eventId,
              title: eventData.title,
            },
          });
          globalStore.setState({ generalLoading: true });
          set({ updateEventFormState: null });

          try {
            const result = await updateEventAction({
              eventId,
              title: eventData.title.trim(),
              description: eventData.description?.trim() || undefined,
              note: eventData.note?.trim() || undefined,
              venue: eventData.venue.trim(),
              eventDate: eventData.eventDate,
              eventTime: eventData.eventTime.trim(),
            });

            if (result.error) {
              const message = result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;

              set({
                updateEventFormState: {
                  error: {
                    message,
                    formErrors: result.error.formErrors,
                  },
                },
              });

              logActionFailure({
                action: "eventStore.updateEventHandler",
                message,
                context: {
                  eventId,
                  title: eventData.title,
                },
              });
              toast.error(message);
              return false;
            }

            const message =
              result.success?.message ?? "Event updated successfully.";

            set({
              updateEventFormState: {
                success: {
                  message,
                },
              },
            });

            logActionSuccess({
              action: "eventStore.updateEventHandler",
              message,
              context: {
                eventId,
                title: eventData.title,
              },
            });
            toast.success(message);
            set({ updateEventFormData: createDefaultUpdateEventFormData() });
            return true;
          } catch (error: unknown) {
            const message = networkError(guardError(error))
              ? NETWORK_ERROR_MESSAGE
              : guardError(error);

            set({
              updateEventFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });

            logActionFailure({
              action: "eventStore.updateEventHandler",
              message,
              context: {
                eventId,
                title: eventData.title,
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
        name: "event_store",
        partialize: (state) => ({
          createEventFormData: state.createEventFormData,
        }),
      },
    ),
  ),
);
