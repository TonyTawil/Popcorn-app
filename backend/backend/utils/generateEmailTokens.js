import crypto from "crypto";

const generateEmailToken = (user) => {
  const token = crypto.randomBytes(32).toString("hex");

  return token;
};

export default generateEmailToken;
