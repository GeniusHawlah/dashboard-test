import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "react-toastify";
import contactUsAction from "@/actions/email-action/contactUsAction";
import {
  GENERAL_FORM_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import {
  guardError,
  networkError,
} from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/ordinaryConsoleLogger";
import { globalStore } from "./globalStore";
import type {
  ContactUsFormInterface,
  EmailStoreInterface,
} from "@/utils/types";

function createDefaultContactData(): ContactUsFormInterface {
  return {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
}

export const emailStore = create<EmailStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        contactData: createDefaultContactData(),
        setContactData: (name, value) =>
          set((state) => ({
            contactData: {
              ...(state.contactData ?? createDefaultContactData()),
              [name]: value,
            },
          })),
        resetContactData: () =>
          set({ contactData: createDefaultContactData() }),

        contactFormState: null,
        setContactFormState: (value) => set({ contactFormState: value }),

        // //>CONTACT US HANDLER
        contactUsHandler: async (contactData: ContactUsFormInterface) => {
          logActionStart({
            action: "emailStore.contactUsHandler",
            context: {
              email: contactData.email,
              subject: contactData.subject,
            },
          });
          globalStore.setState({ generalLoading: true });
          set({ contactFormState: null });

          try {
            const result = await contactUsAction({
              name: contactData.name.trim(),
              email: contactData.email.trim().toLowerCase(),
              subject: contactData.subject.trim(),
              message: contactData.message.trim(),
            });

            if (result.error) {
              const message = result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;

              set({
                contactFormState: {
                  error: {
                    message,
                    formErrors: result.error.formErrors ?? {},
                  },
                },
              });

              logActionFailure({
                action: "emailStore.contactUsHandler",
                message,
                context: {
                  email: contactData.email,
                  subject: contactData.subject,
                },
              });
              toast.error(message);
              return false;
            }

            const successMessage =
              result.success?.message ?? "Your message has been sent successfully.";

            set({
              contactFormState: {
                success: {
                  message: successMessage,
                },
              },
            });

            logActionSuccess({
              action: "emailStore.contactUsHandler",
              message: successMessage,
              context: {
                email: contactData.email,
                subject: contactData.subject,
              },
            });
            toast.success(successMessage);
            return true;
          } catch (error: unknown) {
            const message = networkError(guardError(error))
              ? NETWORK_ERROR_MESSAGE
              : guardError(error);

            set({
              contactFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });

            logActionFailure({
              action: "emailStore.contactUsHandler",
              message,
              context: {
                email: contactData.email,
                subject: contactData.subject,
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
        name: "email_store",
        partialize: (state) => ({ contactData: state.contactData }),
      },
    ),
  ),
);
