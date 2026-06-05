import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    const existingUserResult = await query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );
    const existingUser = existingUserResult.rows[0];

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const newUserResult = await query(
      'INSERT INTO "User" (id, email, password, name) VALUES ($1, $2, $3, $4) RETURNING id, email, name',
      [userId, email, hashedPassword, name || null]
    );
    const newUser = newUserResult.rows[0];

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
