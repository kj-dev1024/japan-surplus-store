import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  interface UserResponse {
    _id: string;
    name: string;
    role: string;
    username: string;
    password: string;
  }

  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({
      username: String(username).trim(),
    }).lean<UserResponse>();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    console.log(String(password), user.password);
    const valid = await bcrypt.compare(String(password), user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken(user.username);
    return NextResponse.json({ token, username: user.username });
  } catch (error) {
    console.error("POST /api/auth/login:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
