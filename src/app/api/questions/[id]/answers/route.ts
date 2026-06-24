import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { getUserFromRequest } from "@/lib/auth";
import { z } from "zod";

const answerSchema = z.object({
  body: z.string().trim().min(5),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user) return error("Authentication required", 401);

  const { id: questionId } = await params;

  try {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return error("Question not found", 404);

    const body = await request.json();
    const parsed = answerSchema.safeParse(body);

    if (!parsed.success) {
      return error("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const answer = await prisma.answer.create({
      data: {
        body: parsed.data.body,
        questionId,
        authorId: user.userId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return success(answer, 201);
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}