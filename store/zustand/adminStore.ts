import createAdminAction from "@/actions/admin-action/createAdminAction";
import { globalStore } from "@/store/zustand/globalStore";
import {
  AdminStoreInterface,
  CreateAdminFormDataInterface,
  CreateAdminFormStateInterface,
} from "@/utils/types";
import { Gender, UserRole } from "@prisma/client";
import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

function createDefaultAdminFormData(): CreateAdminFormDataInterface {
  return {
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    gender: Gender.MALE,
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    passport: "",
    idCard: "",
    role: UserRole.ADMIN,
  };
}

export const adminStore = create<AdminStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        createAdminFormData: createDefaultAdminFormData(),
        setCreateAdminFormData: (value) => set({ createAdminFormData: value }),
        resetCreateAdminFormData: () =>
          set({ createAdminFormData: createDefaultAdminFormData() }),
        createAdminFormState: {},
        setCreateAdminFormState: (value: CreateAdminFormStateInterface) =>
          set({ createAdminFormState: value }),

        // >CREATE ADMIN HANDLER
        createAdminHandler: async (data) => {
          globalStore.setState({ generalLoading: true });
          set({ createAdminFormState: {} });

          try {
            const { error, success } = await createAdminAction(data);

            if (error) {
              globalStore.setState({ generalLoading: false });
              set({
                createAdminFormState: {
                  error: {
                    message: error.message,
                    formErrors: error.formErrors,
                    statusCode: error.statusCode,
                  },
                },
              });
              toast.error(error.message);
              return false;
            }

            if (success) {
              globalStore.setState({ generalLoading: false });
              set({
                createAdminFormState: {
                  success: {
                    message: success.message,
                  },
                },
              });
              toast.success(success.message);
              set({ createAdminFormData: createDefaultAdminFormData() });
              globalStore.getState().closeModal();
              return true;
            }

            globalStore.setState({ generalLoading: false });
            return false;
          } catch (error) {
            globalStore.setState({ generalLoading: false });
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to create admin.",
            );
            return false;
          }
        },
      }),
      {
        name: "admin_store",
        partialize: (state) => ({
          createAdminFormData: state.createAdminFormData,
        }),
      },
    ),
  ),
);
