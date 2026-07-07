import { db } from "./db";

export const Auth = {
  async getUser() {
    const { data, error } = await db.auth.getUser();

    if (error) return null;
    return data.user;
  },
};




