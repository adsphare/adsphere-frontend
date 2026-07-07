export type TypingEvent =
  | {
      type: "typing";
      data: {
        userId: string;
        username: string;
        timestamp: number;
      };
    }
  | {
      type: "stop_typing";
      data: {
        userId: string;
        timestamp: number;
      };
    };





