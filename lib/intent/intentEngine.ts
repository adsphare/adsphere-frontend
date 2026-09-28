export const intentEngine = {
  async handle({ action }: { action: string; payload?: unknown }) {
    throw new Error(
      `Legacy financial intent is disabled: ${action}`,
    );
  },
};
