import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { getUserFromRequest } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user) return error("Authentication required", 401);

  const { collegeId } = await params;

  try {
    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: user.userId, collegeId } },
    });

    if (!existing) return error("Saved college not found", 404);

    await prisma.savedCollege.delete({
      where: { userId_collegeId: { userId: user.userId, collegeId } },
    });

    return success({ message: "College removed from saved list" });
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}