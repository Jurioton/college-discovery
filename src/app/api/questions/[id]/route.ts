import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        college: { select: { id: true, name: true } },
        answers: {
          include: {
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!question) return error("Question not found", 404);

    return success(question);
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}