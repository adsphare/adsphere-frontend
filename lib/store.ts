export type Listing = {
  id: string;
  userId: string;
  title: string;
  location: string;
  price: string;
  type: string;
  description: string;
};

const STORAGE_KEY = "adsphere_listings";

// default data
const defaultListings: Listing[] = [
  {
    id: "1",
    userId: "system",
    title: "Digital Billboard",
    location: "New York, USA",
    price: "$120/day",
    type: "billboard",
    description: "High traffic Times Square screen",
  },
  {
    id: "2",
    userId: "system",
    title: "TikTok Promotion",
    location: "Global",
    price: "$80/video",
    type: "social",
    description: "Influencer TikTok promotion",
  },
];

// load from localStorage
function getListings(): Listing[] {
  if (typeof window === "undefined") return defaultListings;

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultListings;
}

// save to localStorage
function saveListings(listings: Listing[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

// store system
export const store = {
  listings: getListings(),

  addListing(listing: Listing) {
    this.listings.push(listing);
    saveListings(this.listings);
  },
};