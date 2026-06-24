import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { signupSchema } from "@/lib/validators/auth.schema";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return error("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return error("Email already registered", 409);
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = signToken({ userId: user.id });

    const response = success({ id: user.id, name: user.name, email: user.email }, 201);
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