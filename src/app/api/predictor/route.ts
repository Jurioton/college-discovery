import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { z } from "zod";

const predictorSchema = z.object({
  exam: z.enum(["JEE Main", "JEE Advanced", "NEET", "TNEA"]),
  rank: z.coerce.number().int().positive(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = predictorSchema.safeParse({
    exam: searchParams.get("exam"),
    rank: searchParams.get("rank"),
  });

  if (!parsed.success) {
    return error("Invalid parameters", 400, parsed.error.flatten().fieldErrors);
  }

  const { exam, rank } = parsed.data;

  try {
    const cutoffs = await prisma.cutoff.findMany({
      where: {
        examName: exam,
        closingRank: { gte: rank },
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            type: true,
          },
        },
      },
      orderBy: { closingRank: "asc" },
    });

    // Dedupe by college — keep best (lowest) closingRank per college
    const seen = new Set<string>();
    const matches = cutoffs
      .filter((c) => {
        if (seen.has(c.collegeId)) return false;
        seen.add(c.collegeId);
        return true;
      })
      .map((c) => ({
        collegeId: c.collegeId,
        name: c.college.name,
        city: c.college.city,
        state: c.college.state,
        type: c.college.type,
        courseName: c.courseName,
        closingRank: c.closingRank,
        year: c.year,
      }));

    return success({ matches });
  } catch (e) {
    console.error(e);
    return error("Internal server error", 500);
  }
}