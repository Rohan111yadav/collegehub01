import { NextResponse } from "next/server";
import { query } from "@/lib/db";

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
    let whereClause = `WHERE fees >= $1 AND fees <= $2 AND rating >= $3`;
    const params: any[] = [minFees, maxFees, minRating];
    let paramIndex = 4;

    if (q) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR location ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${q}%`);
      paramIndex++;
    }

    if (location) {
      whereClause += ` AND location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (type && type !== "All") {
      whereClause += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Whitelist sorting configurations
    const whitelistedSortFields = ["rating", "fees", "placements", "name"];
    const whitelistedSortOrders = ["asc", "desc"];

    const activeSortField = whitelistedSortFields.includes(sortBy) ? sortBy : "rating";
    const activeSortOrder = whitelistedSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : "DESC";

    // Count total matches
    const countQuery = `SELECT COUNT(*) FROM "College" ${whereClause}`;
    const countRes = await query(countQuery, params);
    const total = parseInt(countRes.rows[0].count, 10);

    // Fetch matching data
    const dataQuery = `
      SELECT * FROM "College"
      ${whereClause}
      ORDER BY "${activeSortField}" ${activeSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataParams = [...params, limit, skip];
    const dataRes = await query(dataQuery, dataParams);
    const colleges = dataRes.rows;

    // Fetch unique locations
    const locationsQuery = `SELECT DISTINCT location FROM "College"`;
    const locationsRes = await query(locationsQuery);
    
    // Extraced unique cities/states
    const locations = Array.from(
      new Set(locationsRes.rows.map((c: any) => c.location.split(",")[0].trim()))
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
