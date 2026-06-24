import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { collegeQuerySchema } from "@/lib/validators/college.schema";
console.log("COLLEGES API ROUTE LOADED");
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

 const parsed = collegeQuerySchema.safeParse({
  search: searchParams.get("search") ?? undefined,
  city: searchParams.get("city") ?? undefined,
  minFees: searchParams.get("minFees") ?? undefined,
  maxFees: searchParams.get("maxFees") ?? undefined,
  minRating: searchParams.get("minRating") ?? undefined,
  page: searchParams.get("page") ?? undefined,
  limit: searchParams.get("limit") ?? undefined,
});

  if (!parsed.success) {
    return error("Invalid query parameters", 400, parsed.error.flatten().fieldErrors);
  }

  const { search, city, minFees, maxFees, minRating, page, limit } = parsed.data;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { city: { contains: search, mode: "insensitive" as const } },
        { state: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(city && { city: { contains: city, mode: "insensitive" as const } }),
    ...(minFees !== undefined && { fees: { gte: minFees } }),
    ...(maxFees !== undefined && { fees: { lte: maxFees } }),
    ...(minRating !== undefined && { rating: { gte: minRating } }),
  };

  try {
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          fees: true,
          rating: true,
          type: true,
          establishedYear: true,
        },
        orderBy: { rating: "desc" },
      }),
      prisma.college.count({ where }),
    ]);

    return success({
      colleges,
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