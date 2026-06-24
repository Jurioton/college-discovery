import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return error("ids query parameter is required", 400);
  }

  const ids = [...new Set(idsParam.split(",").map((id) => id.trim()).filter(Boolean))];

  if (ids.length < 2) {
    return error("At least 2 college ids are required", 400);
  }

  if (ids.length > 3) {
    return error("Maximum 3 colleges can be compared", 400);
  }

  try {
    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        courses: true,
        placements: true,
        cutoffs: true,
      },
    });

    if (colleges.length !== ids.length) {
      const foundIds = colleges.map((c) => c.id);
      const missingId = ids.find((id) => !foundIds.includes(id));
      return error(`College not found: ${missingId}`, 404);
    }

    return success({ colleges });
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}