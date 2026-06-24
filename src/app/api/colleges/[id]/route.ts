import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return error("Invalid college ID", 400);
  }

  try {
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: true,
        reviews: true,
        cutoffs: true,
      },
    });

    if (!college) {
      return error("College not found", 404);
    }

    return success(college);
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}