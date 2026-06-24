import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { loginSchema } from "@/lib/validators/auth.schema";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return error("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return error("Invalid credentials", 401);
    }

    const token = signToken({ userId: user.id });

    const response = success({ id: user.id, name: user.name, email: user.email });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
    );

    return response;
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}