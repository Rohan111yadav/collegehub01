import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Parsing parameters
    const q = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";
    const minFees = parseInt(searchParams.get("minFees") || "0", 10);
    const maxFees = parseInt(searchParams.get("maxFees") || "10000000", 10);
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const type = searchParams.get("type") || "";

    const sortBy = searchParams.get("sortBy") || ""; // "rating", "fees", "placements"
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const skip = (page - 1) * limit;

    // Building filters
    const where: Prisma.CollegeWhereInput = {
      fees: {
        gte: minFees,
        lte: maxFees,
      },
      rating: {
        gte: minRating,
      },
    };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (type && type !== "All") {
      where.type = type;
    }

    // Sorting order
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: "desc" }; // default sorting
    if (sortBy === "fees") {
      orderBy = { fees: sortOrder };
    } else if (sortBy === "placements") {
      orderBy = { placements: sortOrder };
    } else if (sortBy === "rating") {
      orderBy = { rating: sortOrder };
    } else if (sortBy === "name") {
      orderBy = { name: sortOrder };
    }

    // Querying
    const [colleges, total] = await prisma.$transaction([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    // Extracting list of unique locations for filters sidebar
    const allCollegesForLocations = await prisma.college.findMany({
      select: { location: true },
    });

    // Extraced unique cities/states
    const locations = Array.from(
      new Set(allCollegesForLocations.map((c) => c.location.split(",")[0].trim()))
    ).sort();

    return NextResponse.json({
      colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      locations,
    });
  } catch (error) {
    console.error("Colleges fetch error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching colleges" },
      { status: 500 }
    );
  }
}
