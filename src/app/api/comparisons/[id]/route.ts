import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Comparison ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership of the comparison
    const comparisonRes = await query(
      'SELECT * FROM "Comparison" WHERE id = $1',
      [id]
    );
    const comparison = comparisonRes.rows[0];

    if (!comparison) {
      return NextResponse.json(
        { message: "Comparison not found" },
        { status: 404 }
      );
    }

    if (comparison.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized to delete this comparison" },
        { status: 403 }
      );
    }

    // Delete comparison
    await query(
      'DELETE FROM "Comparison" WHERE id = $1',
      [id]
    );

    return NextResponse.json(
      { message: "Comparison deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Comparison delete error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while deleting the comparison" },
      { status: 500 }
    );
  }
}
