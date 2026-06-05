import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

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

    const comparisons = await prisma.comparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (comparisons.length === 0) {
      return NextResponse.json({ comparisons: [] });
    }

    // Fetch details of all involved colleges
    const allCollegeIds = Array.from(new Set(comparisons.flatMap((c) => c.collegeIds)));
    const colleges = await prisma.college.findMany({
      where: { id: { in: allCollegeIds } },
    });

    const result = comparisons.map((comp) => ({
      id: comp.id,
      collegeIds: comp.collegeIds,
      createdAt: comp.createdAt,
      colleges: comp.collegeIds
        .map((id) => colleges.find((col) => col.id === id))
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
    const collegesCount = await prisma.college.count({
      where: { id: { in: collegeIds } },
    });

    if (collegesCount !== collegeIds.length) {
      return NextResponse.json(
        { message: "One or more college IDs are invalid" },
        { status: 400 }
      );
    }

    // Save comparison
    const comparison = await prisma.comparison.create({
      data: {
        userId: session.user.id,
        collegeIds,
      },
    });

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
