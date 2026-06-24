
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return error("Authentication required", 401);

  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            fees: true,
            rating: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return success({ saved });
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return error("Authentication required", 401);

  try {
    const body = await request.json();
    const { collegeId } = body;

    if (!collegeId || typeof collegeId !== "string") {
      return error("collegeId is required", 400);
    }

    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) return error("College not found", 404);

    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: user.userId, collegeId } },
    });
    if (existing) return error("College already saved", 409);

    const saved = await prisma.savedCollege.create({
      data: { userId: user.userId, collegeId },
    });

    return success(saved, 201);
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}