import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
export const listings = [
    {
        id: "1",
        title: "Digital Billboard",
        type: "billboard",
        location: "Addis Ababa, Ethiopia",
        price: "$120/day",
    },
    {
        id: "2",
        title: "TikTok Promotion",
        type: "tiktok",
        location: "Global",
        price: "$80/video",
    },
    {
        id: "3",
        title: "Instagram Reel",
        type: "instagram",
        location: "Global",
        price: "$70/post",
    },
    {
        id: "4",
        title: "YouTube Sponsorship",
        type: "youtube",
        location: "Global",
        price: "$250/video",
    },
    {
        id: "5",
        title: "Mall Billboard Screen",
        type: "billboard",
        location: "Dubai, UAE",
        price: "$90/day",
    },
];
