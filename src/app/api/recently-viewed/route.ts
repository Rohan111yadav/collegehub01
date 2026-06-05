import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

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

    const views = await prisma.recentlyViewed.findMany({
      where: { userId: session.user.id },
      orderBy: { viewedAt: "desc" },
      take: 6, // Retrieve top 6
      include: {
        college: true,
      },
    });

    const colleges = views.map((v) => v.college);

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
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    // Upsert view
    const view = await prisma.recentlyViewed.upsert({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        collegeId,
      },
    });

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
