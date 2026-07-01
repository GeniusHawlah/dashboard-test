import { ReactNode } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ModalProps = {
  size?: string;
  position?: string;
  className?: string;
};

type GlobalStoreInterface = {
  revalidating: boolean;
  persistedDataReady: boolean;
  hydrateData: () => void;
  modalIsOpen: boolean;
  content: ReactNode | null;
  modalProps: ModalProps;
  openModal: (content: ReactNode | null, modalProps?: ModalProps) => void;
  closeModal: () => void;
  generalLoading: boolean;
  setGeneralLoading: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  menuClicked: boolean;
  setMenuClicked: (value: boolean) => void;
  isLandingMobileSidebarExpanded: boolean;
  setIsLandingMobileSidebarExpanded: (value: boolean) => void;
  toggleLandingMobileSidebar: () => void;
  isDashboardMobileSidebarExpanded: boolean;
  setIsDashboardMobileSidebarExpanded: (value: boolean) => void;
  toggleDashboardMobileSidebar: () => void;
  isRouting: boolean;
  setIsRouting: (value: boolean) => void;
};

const MODAL_HISTORY_STATE_KEY = "__GoFinanceModal";

export const globalStore = create<GlobalStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        revalidating: false,
        persistedDataReady: false,
        hydrateData: () => set({ persistedDataReady: true }),

        // //>MODAL HANDLERS
        modalIsOpen: false,
        content: null,
        modalProps: { size: "4xl", position: "center" },
        openModal: (content: ReactNode | null, modalProps = {}) => {
          set({ modalIsOpen: true, content, modalProps });

          if (typeof window === "undefined") return;
          if (window.history.state?.[MODAL_HISTORY_STATE_KEY]) return;

          window.history.pushState(
            {
              ...(window.history.state ?? {}),
              [MODAL_HISTORY_STATE_KEY]: true,
            },
            "",
            window.location.href,
          );
        },
        closeModal: () => {
          if (
            typeof window !== "undefined" &&
            window.history.state?.[MODAL_HISTORY_STATE_KEY]
          ) {
            window.history.back();
            return;
          }

          set({ modalIsOpen: false, content: null, modalProps: {} });
        },

        // //>GENERAL LOADERS
        generalLoading: false,
        setGeneralLoading: (value: boolean) => set({ generalLoading: value }),

        // //>SEARCH HANDLER
        searchQuery: "",
        setSearchQuery: (searchQuery: string) => set({ searchQuery }),

        // //>SIDEBAR HANDLERS
        menuClicked: false,
        setMenuClicked: (value: boolean) => set({ menuClicked: value }),

        // //>LANDING MOBILE SIDEBAR HANDLERS
        isLandingMobileSidebarExpanded: false,
        setIsLandingMobileSidebarExpanded: (value: boolean) =>
          set({ isLandingMobileSidebarExpanded: value }),
        toggleLandingMobileSidebar: () =>
          set((state) => ({
            isLandingMobileSidebarExpanded:
              !state.isLandingMobileSidebarExpanded,
          })),

        // //>DASHBOARD MOBILE SIDEBAR HANDLERS
        isDashboardMobileSidebarExpanded: false,
        setIsDashboardMobileSidebarExpanded: (value: boolean) =>
          set({ isDashboardMobileSidebarExpanded: value }),
        toggleDashboardMobileSidebar: () =>
          set((state) => ({
            isDashboardMobileSidebarExpanded:
              !state.isDashboardMobileSidebarExpanded,
          })),

        // //>ROUTING HANDLER
        isRouting: false,
        setIsRouting: (value: boolean) => set({ isRouting: value }),
      }),
      {
        name: "global_store",
        partialize: () => ({}),
        onRehydrateStorage: () => (state) => {
          state?.hydrateData();
        },
      },
    ),
  ),
);
