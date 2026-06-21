import { create } from "zustand";

/**
 * AdSphere Global Store
 * - user session
 * - selected listing
 * - UI state
 * - boost system state (future payments)
 */

type User = {
  id: string;
  email?: string;
} | null;

type Listing = any;

type StoreState = {
  // AUTH
  user: User;
  setUser: (user: User) => void;

  // LISTINGS
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;

  // UI STATE
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // BOOST SYSTEM (future monetization)
  boostModalOpen: boolean;
  openBoostModal: () => void;
  closeBoostModal: () => void;

  // CAMPAIGNS (future)
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
};

export const useStore = create<StoreState>((set) => ({
  // AUTH
  user: null,
  setUser: (user) => set({ user }),

  // LISTINGS
  selectedListing: null,
  setSelectedListing: (listing) =>
    set({ selectedListing: listing }),

  // UI
  sidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // BOOST
  boostModalOpen: false,
  openBoostModal: () => set({ boostModalOpen: true }),
  closeBoostModal: () => set({ boostModalOpen: false }),

  // CAMPAIGNS
  selectedCampaignId: null,
  setSelectedCampaignId: (id) =>
    set({ selectedCampaignId: id }),
}));