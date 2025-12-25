import { hash, compare } from "bcrypt";

export const generateHash = async (
  plaintext: string,
  salt_round: number = Number(process.env.SALT),
): Promise<string> => {
  return await hash(plaintext, salt_round);
};

export const compareHash = async (
  plaintext: string,
  hashValue: string,
): Promise<boolean> => {
  return await compare(plaintext, hashValue);
};
