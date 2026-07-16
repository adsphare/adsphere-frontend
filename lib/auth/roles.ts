export const USER_ROLES = {

  BRAND: "brand",

  CREATOR: "creator",

  BILLBOARD_OWNER:
    "billboard_owner",

  AGENCY:
    "agency",

  NGO:
    "ngo",

  GOVERNMENT:
    "government",

  ADMIN:
    "admin",

} as const;


export type UserRole =
  typeof USER_ROLES[
    keyof typeof USER_ROLES
  ];

