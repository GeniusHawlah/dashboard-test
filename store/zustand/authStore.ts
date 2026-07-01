import loginAction from "@/actions/auth-actions/loginAction";
import logoutAction from "@/actions/auth-actions/logoutAction";
import signUpAction from "@/actions/auth-actions/signUpAction";
import { NETWORK_ERROR_MESSAGE } from "@/utils/constants";
import {
  buildPicsumPassport,
  getDemoAccount,
  saveDemoAccount,
} from "@/utils/demo-auth";
import { RelativeRoutes } from "@/utils/enum";
import { guardError, networkError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/ordinaryConsoleLogger";
import {
  AuthStoreInterface,
  LoginDataInterface,
  SignUpDataInterface,
} from "@/utils/types";
import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { globalStore } from "./globalStore";

const GENERAL_LOGOUT_ERROR_MESSAGE = "Failed to log out. Please try again.";

export const authStore = create<AuthStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        loginFormState: {},
        setLoginFormState: (value) => set({ loginFormState: value }),

        signUpFormState: {},
        setSignUpFormState: (value) => set({ signUpFormState: value }),

        signUpHandler: async (signUpData: SignUpDataInterface) => {
          logActionStart({
            action: "authStore.signUpHandler",
            context: {
              email: signUpData.email,
            },
          });
          globalStore.setState({ generalLoading: true });

          try {
            const response = await signUpAction(signUpData);

            if (response.error) {
              globalStore.setState({ generalLoading: false });
              const message = response.error.message || NETWORK_ERROR_MESSAGE;

              set({
                signUpFormState: {
                  error: {
                    message,
                    formErrors: response.error.formErrors,
                  },
                },
              });
              logActionFailure({
                action: "authStore.signUpHandler",
                message,
                context: {
                  email: signUpData.email,
                },
              });
              toast.error(message);
              return;
            }

            saveDemoAccount({
              firstName: signUpData.firstName.trim(),
              lastName: signUpData.lastName.trim(),
              role: signUpData.role,
              passport:
                signUpData.passport?.trim() ||
                buildPicsumPassport(signUpData.email),
              email: signUpData.email.trim().toLowerCase(),
              password: signUpData.password,
            });

            set({
              signUpFormState: {
                success: {
                  message:
                    response.success?.message ||
                    "Account created successfully.",
                },
              },
            });
            logActionSuccess({
              action: "authStore.signUpHandler",
              message:
                response.success?.message || "Account created successfully.",
              context: {
                email: signUpData.email,
              },
            });
            toast.success(
              response.success?.message || "Account created successfully.",
            );
            location.replace(RelativeRoutes.LOGIN_PAGE);
          } catch (e: unknown) {
            globalStore.setState({ generalLoading: false });

            const message = networkError(guardError(e))
              ? NETWORK_ERROR_MESSAGE
              : guardError(e);

            logActionFailure({
              action: "authStore.signUpHandler",
              message,
              context: {
                email: signUpData.email,
              },
            });
            set({
              signUpFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });
            toast.error(message);
          }
        },

        //>LOGIN HANDLER
        loginHandler: async (loginData: LoginDataInterface) => {
          logActionStart({
            action: "authStore.loginHandler",
            context: {
              email: loginData.email,
            },
          });
          globalStore.setState({ generalLoading: true });

          try {
            const response = await loginAction(loginData, {
              rememberMe: loginData.rememberMe,
              account: getDemoAccount(),
            });

            if (response.error) {
              globalStore.setState({ generalLoading: false });
              const message = response.error.message || NETWORK_ERROR_MESSAGE;

              set({
                loginFormState: {
                  error: {
                    message,
                    formErrors: response.error.formErrors,
                  },
                },
              });
              logActionFailure({
                action: "authStore.loginHandler",
                message,
                context: {
                  email: loginData.email,
                },
              });
              toast.error(message);
              return;
            }

            const session = response.success?.session;
            const redirectTo = RelativeRoutes.DASHBOARD_HOMEPAGE;

            logActionSuccess({
              action: "authStore.loginHandler",
              message: "login successful",
              context: {
                email: loginData.email,
                redirectTo,
              },
            });

            set({
              loginFormState: {
                success: {
                  message: "Login successful.",
                  session,
                },
              },
            });
            toast.success("Login successful.");
            location.replace(redirectTo);
            return;
          } catch (e: unknown) {
            globalStore.setState({ generalLoading: false });

            const message = networkError(guardError(e))
              ? NETWORK_ERROR_MESSAGE
              : guardError(e);

            logActionFailure({
              action: "authStore.loginHandler",
              message,
              context: {
                email: loginData.email,
              },
            });
            set({
              loginFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });
            toast.error(message);
          }
        },

        // >LOGOUT HANDLER
        logoutHandler: async () => {
          logActionStart({
            action: "authStore.logoutHandler",
          });
          globalStore.setState({ generalLoading: true });

          try {
            const result = await logoutAction();

            if (result.error) {
              globalStore.setState({ generalLoading: false });

              const message =
                result.error.message || GENERAL_LOGOUT_ERROR_MESSAGE;

              logActionFailure({
                action: "authStore.logoutHandler",
                message,
              });
              toast.error(message);
              return;
            }

            set({
              loginFormState: {},
            });

            logActionSuccess({
              action: "authStore.logoutHandler",
              message: "logged out successfully",
            });
            toast.success("Logged out!");
            location.replace(RelativeRoutes.LOGIN_PAGE);
          } catch (e: unknown) {
            globalStore.setState({ generalLoading: false });

            const message = networkError(guardError(e))
              ? NETWORK_ERROR_MESSAGE
              : guardError(e) || GENERAL_LOGOUT_ERROR_MESSAGE;

            logActionFailure({
              action: "authStore.logoutHandler",
              message,
            });
            toast.error(message);
          }
        },
      }),
      {
        name: "authInfo",
        partialize: () => ({}),
      },
    ),
  ),
);
