import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        college: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map to return just the college object
    const colleges = favorites.map((f) => f.college);

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

    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (existingFavorite) {
      // Toggle off (delete favorite)
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return NextResponse.json({ favorited: false, message: "Removed from favorites" });
    } else {
      // Toggle on (create favorite)
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          collegeId,
        },
      });
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
