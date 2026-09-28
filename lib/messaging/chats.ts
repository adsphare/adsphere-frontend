export async function sendMessage(_params: {
  conversationId: string;
  senderId: string;
  message: string;
}) {
  throw new Error(
    "LEGACY_MESSAGING_DISABLED: use /api/messages/send"
  );
}

export async function sendOffer(..._args: any[]) {
  throw new Error(
    "LEGACY_MESSAGING_DISABLED: use canonical messaging flow"
  );
}

export async function acceptOfferCreateDeal(..._args: any[]) {
  throw new Error(
    "LEGACY_MESSAGING_DISABLED: use canonical deal flow"
  );
}

export const createDeal = acceptOfferCreateDeal;
