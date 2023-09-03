import * as bcrypt from "bcrypt";

const saltRound = 10;

export const generatePasswordHash = async (password: string) => {
  const passwordHash = await bcrypt.hash(password, saltRound);
  return passwordHash;
};

export const comparePassword = async (
  password: string,
  passwordHash: string
) => {
  const isMatched = await bcrypt.compare(password, passwordHash);
  return isMatched;
};
