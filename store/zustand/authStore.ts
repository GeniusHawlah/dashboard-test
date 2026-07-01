import loginAction from "@/actions/auth-actions/loginAction";
import logoutAction from "@/actions/auth-actions/logoutAction";
import signUpAction from "@/actions/auth-actions/signUpAction";
import changeInitialPasswordAction from "@/actions/auth-actions/changeInitialPasswordAction";
import requestOtpAction from "@/actions/auth-actions/requestOtpAction";
import resetPasswordAction from "@/actions/auth-actions/resetPasswordAction";
import { NETWORK_ERROR_MESSAGE } from "@/utils/constants";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/ordinaryConsoleLogger";
import { RelativeRoutes } from "@/utils/enum";
import {
  AuthStoreInterface,
  InitialPasswordDataInterface,
  ForgotPasswordDataInterface,
  LoginDataInterface,
  SignUpDataInterface,
  ResetPasswordDataInterface,
} from "@/utils/types";
import { guardError, networkError } from "@/utils/error-helpers";
import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { globalStore } from "./globalStore";
import {
  buildPicsumPassport,
  getDemoAccount,
  saveDemoAccount,
} from "@/utils/demo-auth";

const GENERAL_FETCH_ERROR_MESSAGE =
  "Something went wrong. Please try again later.";
const PASSWORD_RESET_SUCCESS_FLAG = "GoFinance:password-reset-success";
const GENERAL_LOGOUT_ERROR_MESSAGE = "Failed to log out. Please try again.";

export const authStore = create<AuthStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        loginFormState: {},
        setLoginFormState: (value) => set({ loginFormState: value }),

        initialPasswordFormState: {},
        setInitialPasswordFormState: (value) =>
          set({ initialPasswordFormState: value }),

        forgotPasswordFormState: {},
        setForgotPasswordFormState: (value) =>
          set({ forgotPasswordFormState: value }),

        resetPasswordFormState: {},
        setResetPasswordFormState: (value) =>
          set({ resetPasswordFormState: value }),

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

        //>CHANGE INITIAL PASSWORD HANDLER
        changeInitialPasswordHandler: async (
          data: InitialPasswordDataInterface,
        ) => {
          logActionStart({
            action: "authStore.changeInitialPasswordHandler",
          });
          globalStore.setState({ generalLoading: true });
          set({ initialPasswordFormState: {} });

          try {
            const response = await changeInitialPasswordAction(data);

            if (response.error) {
              globalStore.setState({ generalLoading: false });
              set({ initialPasswordFormState: response });
              logActionFailure({
                action: "authStore.changeInitialPasswordHandler",
                message: response.error.message,
              });
              toast.error(response.error.message);
              return;
            }

            if (response.success) {
              set({ initialPasswordFormState: response });
              logActionSuccess({
                action: "authStore.changeInitialPasswordHandler",
                message: response.success.message,
                context: {
                  redirectTo: response.success.redirectTo,
                },
              });
              toast.success(response.success.message);
              location.replace(response.success.redirectTo);
              return;
            }

            globalStore.setState({ generalLoading: false });
          } catch (e: unknown) {
            globalStore.setState({ generalLoading: false });

            const message = networkError(guardError(e))
              ? NETWORK_ERROR_MESSAGE
              : guardError(e);

            logActionFailure({
              action: "authStore.changeInitialPasswordHandler",
              message,
            });
            set({
              initialPasswordFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });
            toast.error(message);
          }
        },

        // >FORGOT PASSWORD HANDLER
        forgotPasswordHandler: async (
          forgotPasswordData: ForgotPasswordDataInterface,
        ) => {
          logActionStart({
            action: "authStore.forgotPasswordHandler",
            context: {
              email: forgotPasswordData.email,
            },
          });
          globalStore.setState({ generalLoading: true });
          set({ forgotPasswordFormState: {} });

          try {
            const result = await requestOtpAction({
              email: forgotPasswordData.email.trim().toLowerCase(),
            });

            if (result.error) {
              const message =
                result.error.message ?? GENERAL_FETCH_ERROR_MESSAGE;

              set({
                forgotPasswordFormState: {
                  error: {
                    message,
                    formErrors: result.error.formErrors,
                  },
                },
              });

              logActionFailure({
                action: "authStore.forgotPasswordHandler",
                message,
                context: {
                  email: forgotPasswordData.email,
                },
              });
              toast.error(message);
              return false;
            }

            const message =
              result.success?.message ?? "Reset code sent successfully.";

            set({
              forgotPasswordFormState: {
                success: {
                  message,
                },
              },
            });
            logActionSuccess({
              action: "authStore.forgotPasswordHandler",
              message,
              context: {
                email: forgotPasswordData.email,
              },
            });
            toast.success(message);
            return true;
          } catch (e: unknown) {
            const message = networkError(guardError(e))
              ? NETWORK_ERROR_MESSAGE
              : guardError(e);

            logActionFailure({
              action: "authStore.forgotPasswordHandler",
              message,
              context: {
                email: forgotPasswordData.email,
              },
            });
            set({
              forgotPasswordFormState: {
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

        // >RESET PASSWORD HANDLER
        resetPasswordHandler: async (
          resetPasswordData: ResetPasswordDataInterface,
        ) => {
          logActionStart({
            action: "authStore.resetPasswordHandler",
            context: {
              email: resetPasswordData.email,
            },
          });
          globalStore.setState({ generalLoading: true });
          set({ resetPasswordFormState: {} });

          try {
            const result = await resetPasswordAction({
              email: resetPasswordData.email.trim().toLowerCase(),
              code: resetPasswordData.code.trim().toUpperCase(),
              password: resetPasswordData.password,
              confirmPassword: resetPasswordData.confirmPassword,
            });

            if (result.error) {
              const message =
                result.error.message ?? GENERAL_FETCH_ERROR_MESSAGE;

              set({
                resetPasswordFormState: {
                  error: {
                    message,
                    formErrors: result.error.formErrors,
                  },
                },
              });

              logActionFailure({
                action: "authStore.resetPasswordHandler",
                message,
                context: {
                  email: resetPasswordData.email,
                },
              });
              toast.error(message);
              return false;
            }

            const message =
              result.success?.message ?? "Password reset successfully.";

            set({
              resetPasswordFormState: {
                success: {
                  message,
                },
              },
            });
            globalStore.setState({ generalLoading: false });
            logActionSuccess({
              action: "authStore.resetPasswordHandler",
              message,
              context: {
                email: resetPasswordData.email,
                redirectTo: RelativeRoutes.LOGIN_PAGE,
              },
            });
            toast.success(message);
            window.sessionStorage.setItem(PASSWORD_RESET_SUCCESS_FLAG, "true");
            location.replace(RelativeRoutes.LOGIN_PAGE);
            return true;
          } catch (e: unknown) {
            globalStore.setState({ generalLoading: false });

            const message = networkError(guardError(e))
              ? NETWORK_ERROR_MESSAGE
              : guardError(e);

            logActionFailure({
              action: "authStore.resetPasswordHandler",
              message,
              context: {
                email: resetPasswordData.email,
              },
            });
            set({
              resetPasswordFormState: {
                error: {
                  message,
                  formErrors: {},
                },
              },
            });
            toast.error(message);
            return false;
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
