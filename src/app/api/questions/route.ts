import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { getUserFromRequest } from "@/lib/auth";
import { z } from "zod";

const questionSchema = z.object({
  title: z.string().trim().min(5).max(200),
  body: z.string().trim().min(10),
  collegeId: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collegeId = searchParams.get("collegeId") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10")));

  try {
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: { ...(collegeId && { collegeId }) },
        include: {
          author: { select: { id: true, name: true } },
          _count: { select: { answers: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.question.count({
        where: { ...(collegeId && { collegeId }) },
      }),
    ]);

    return success({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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
    const parsed = questionSchema.safeParse(body);

    if (!parsed.success) {
      return error("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const { title, body: qBody, collegeId } = parsed.data;

    if (collegeId) {
      const college = await prisma.college.findUnique({ where: { id: collegeId } });
      if (!college) return error("College not found", 400);
    }

    const question = await prisma.question.create({
      data: {
        title,
        body: qBody,
        collegeId: collegeId || null,
        authorId: user.userId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return success(question, 201);
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}