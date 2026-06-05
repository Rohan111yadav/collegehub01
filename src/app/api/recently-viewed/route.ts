import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";

const trackViewSchema = z.object({
  collegeId: z.string(),
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

    const viewsRes = await query(
      `SELECT c.* FROM "RecentlyViewed" r
       JOIN "College" c ON r."collegeId" = c.id
       WHERE r."userId" = $1
       ORDER BY r."viewedAt" DESC
       LIMIT 6`,
      [session.user.id]
    );

    const colleges = viewsRes.rows;

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Recently viewed fetch error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching recently viewed colleges" },
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
    const result = trackViewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { collegeId } = result.data;

    // Verify college exists
    const collegeRes = await query(
      'SELECT id FROM "College" WHERE id = $1',
      [collegeId]
    );

    if (collegeRes.rows.length === 0) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    // Upsert view natively
    const recentId = crypto.randomUUID();
    const viewRes = await query(
      `INSERT INTO "RecentlyViewed" (id, "userId", "collegeId", "viewedAt")
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT ("userId", "collegeId")
       DO UPDATE SET "viewedAt" = EXCLUDED."viewedAt"
       RETURNING *`,
      [recentId, session.user.id, collegeId]
    );
    const view = viewRes.rows[0];

    return NextResponse.json(
      { message: "View tracked successfully", view },
      { status: 200 }
    );
  } catch (error) {
    console.error("Track view error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while tracking college view" },
      { status: 500 }
    );
  }
}
