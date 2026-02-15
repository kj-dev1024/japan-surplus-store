import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Item } from "@/models/Item";

export async function GET() {
  try {
    await connectDB();
    const items = await Item.find().sort({ createdAt: -1 }).lean();
    const serialized = items.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
      stock: item.stock ?? 0,
      createdAt: item.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: item.updatedAt?.toISOString() ?? new Date().toISOString(),
    }));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { verifyToken } = await import("@/lib/auth");
    const payload = verifyToken(token);
    if (!payload?.username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, price, description, imageUrl, category, stock } = body;
    if (!name || typeof price !== "number" || !description || !imageUrl) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid fields: name, price, description, imageUrl",
        },
        { status: 400 }
      );
    }
    const stockNum = typeof stock === "number" ? stock : Number(stock) || 0;
    const item = await Item.create({
      name: String(name).trim(),
      price: Number(price),
      description: String(description).trim(),
      imageUrl: String(imageUrl).trim(),
      category: category != null ? String(category).trim() : undefined,
      stock: stockNum >= 0 ? stockNum : 0,
    });
    return NextResponse.json({
      _id: item._id,
      name: item.name,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
      stock: item.stock,
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
    });
  } catch (error) {
    console.error("POST /api/items:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
