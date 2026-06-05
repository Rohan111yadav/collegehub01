import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const res = await query(
      'SELECT * FROM "College" WHERE id = $1',
      [id]
    );
    const college = res.rows[0];

    if (!college) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("College detail fetch error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching college details" },
      { status: 500 }
    );
  }
}
