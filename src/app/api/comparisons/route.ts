import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";

const createComparisonSchema = z.object({
  collegeIds: z.array(z.string()).min(1).max(3),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const comparisonsRes = await query(
      'SELECT * FROM "Comparison" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
      [session.user.id]
    );
    const comparisons = comparisonsRes.rows;

    if (comparisons.length === 0) {
      return NextResponse.json({ comparisons: [] });
    }

    // Fetch details of all involved colleges
    const allCollegeIds = Array.from(new Set(comparisons.flatMap((c) => c.collegeIds)));
    const collegesRes = await query(
      'SELECT * FROM "College" WHERE id = ANY($1)',
      [allCollegeIds]
    );
    const colleges = collegesRes.rows;

    const result = comparisons.map((comp: any) => ({
      id: comp.id,
      collegeIds: comp.collegeIds,
      createdAt: comp.createdAt,
      colleges: comp.collegeIds
        .map((id: string) => colleges.find((col: any) => col.id === id))
        .filter(Boolean),
    }));

    return NextResponse.json({ comparisons: result });
  } catch (error) {
    console.error("Comparisons fetch error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching comparisons" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = createComparisonSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { collegeIds } = result.data;

    // Verify all colleges exist
    const collegesCountRes = await query(
      'SELECT COUNT(*) FROM "College" WHERE id = ANY($1)',
      [collegeIds]
    );
    const collegesCount = parseInt(collegesCountRes.rows[0].count, 10);

    if (collegesCount !== collegeIds.length) {
      return NextResponse.json(
        { message: "One or more college IDs are invalid" },
        { status: 400 }
      );
    }

    // Save comparison
    const comparisonId = crypto.randomUUID();
    const saveRes = await query(
      'INSERT INTO "Comparison" (id, "userId", "collegeIds") VALUES ($1, $2, $3) RETURNING *',
      [comparisonId, session.user.id, collegeIds]
    );
    const comparison = saveRes.rows[0];

    return NextResponse.json(
      { message: "Comparison saved successfully", comparison },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comparison save error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while saving the comparison" },
      { status: 500 }
    );
  }
}
