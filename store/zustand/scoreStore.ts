import updateEventScoresAction, {
  type UpdateEventScoreItem,
} from "@/actions/event-action/updateEventScoresAction";
import { GENERAL_FORM_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE } from "@/utils/constants";
import { guardError, networkError } from "@/utils/error-helpers";
import { logActionFailure, logActionStart, logActionSuccess } from "@/utils/ordinaryConsoleLogger";
import { globalStore } from "@/store/zustand/globalStore";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "react-toastify";

export type ScoreEditingColumn = "score" | null;

export interface ScoreStoreInterface {
  selectedScoreId: string | null;
  setSelectedScoreId: (value: string | null) => void;
  editingColumn: ScoreEditingColumn;
  setEditingColumn: (value: ScoreEditingColumn) => void;
  editedScores: Record<string, string>;
  setEditedScores: (
    value:
      | Record<string, string>
      | ((current: Record<string, string>) => Record<string, string>),
  ) => void;
  resetScoreEditState: () => void;
  updateEventScoresHandler: (data: {
    programId: string;
    eventId: string;
    scores: UpdateEventScoreItem[];
  }) => Promise<boolean>;
}

export const scoreStore = create<ScoreStoreInterface>()(
  devtools(
    persist(
      (set, get) => ({
        selectedScoreId: null,
        setSelectedScoreId: (value) => set({ selectedScoreId: value }),
        editingColumn: null,
        setEditingColumn: (value) => set({ editingColumn: value }),
        editedScores: {},
        setEditedScores: (value) =>
          set((state) => ({
            editedScores:
              typeof value === "function" ? value(state.editedScores) : value,
          })),
        resetScoreEditState: () =>
          set({
            selectedScoreId: null,
            editingColumn: null,
            editedScores: {},
          }),

        // >UPDATE EVENT SCORES HANDLER
        updateEventScoresHandler: async ({
          programId,
          eventId,
          scores,
        }) => {
          logActionStart({
            action: "scoreStore.updateEventScoresHandler",
            context: {
              programId,
              eventId,
              scoreCount: scores.length,
            },
          });

          globalStore.setState({ generalLoading: true });

          try {
            const result = await updateEventScoresAction({
              programId,
              eventId,
              scores,
            });

            if (result.error) {
              const message = result.error.message ?? GENERAL_FORM_ERROR_MESSAGE;
              toast.error(message);
              logActionFailure({
                action: "scoreStore.updateEventScoresHandler",
                message,
                context: {
                  programId,
                  eventId,
                  scoreCount: scores.length,
                },
              });
              return false;
            }

            const message =
              result.success?.message ?? "Event scores updated successfully.";

            toast.success(message);
            logActionSuccess({
              action: "scoreStore.updateEventScoresHandler",
              message,
              context: {
                programId,
                eventId,
                scoreCount: scores.length,
              },
            });

            get().resetScoreEditState();
            return true;
          } catch (error: unknown) {
            const message = networkError(guardError(error))
              ? NETWORK_ERROR_MESSAGE
              : guardError(error);

            toast.error(message);
            logActionFailure({
              action: "scoreStore.updateEventScoresHandler",
              message,
              context: {
                programId,
                eventId,
                scoreCount: scores.length,
              },
            });
            return false;
          } finally {
            globalStore.setState({ generalLoading: false });
          }
        },
      }),
      {
        name: "score_store",
        partialize: (state) => ({
          selectedScoreId: state.selectedScoreId,
          editingColumn: state.editingColumn,
          editedScores: state.editedScores,
        }),
      },
    ),
  ),
);
