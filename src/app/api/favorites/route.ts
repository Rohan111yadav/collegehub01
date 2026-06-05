import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const res = await query(
      `SELECT c.* FROM "Favorite" f
       JOIN "College" c ON f."collegeId" = c.id
       WHERE f."userId" = $1
       ORDER BY f."createdAt" DESC`,
      [session.user.id]
    );

    const colleges = res.rows;

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Favorites fetch error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching favorites" },
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
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json(
        { message: "College ID is required" },
        { status: 400 }
      );
    }

    // Verify college exists
    const collegeExistsRes = await query(
      'SELECT id FROM "College" WHERE id = $1',
      [collegeId]
    );

    if (collegeExistsRes.rows.length === 0) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavoriteRes = await query(
      'SELECT * FROM "Favorite" WHERE "userId" = $1 AND "collegeId" = $2',
      [session.user.id, collegeId]
    );
    const existingFavorite = existingFavoriteRes.rows[0];

    if (existingFavorite) {
      // Toggle off (delete favorite)
      await query(
        'DELETE FROM "Favorite" WHERE id = $1',
        [existingFavorite.id]
      );
      return NextResponse.json({ favorited: false, message: "Removed from favorites" });
    } else {
      // Toggle on (create favorite)
      const favoriteId = crypto.randomUUID();
      await query(
        'INSERT INTO "Favorite" (id, "userId", "collegeId") VALUES ($1, $2, $3)',
        [favoriteId, session.user.id, collegeId]
      );
      return NextResponse.json({ favorited: true, message: "Added to favorites" });
    }
  } catch (error) {
    console.error("Favorites toggle error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while updating favorites" },
      { status: 500 }
    );
  }
}
