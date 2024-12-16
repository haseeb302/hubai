import * as jose from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "your-secret-key-something"
);

export async function hashPassword(password: string): Promise<string> {
  const jwt = await new jose.SignJWT({ password })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(SECRET);

  return jwt;
}

export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  try {
    const { payload } = await jose.jwtVerify(hashedPassword, SECRET, {
      algorithms: ["HS256"],
    });

    return payload.password === plainPassword;
  } catch (e) {
    console.error("Password verification failed:", e);
    return false;
  }
}
