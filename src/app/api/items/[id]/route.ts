import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Item } from "@/models/Item";

async function requireAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return false;
  const { verifyToken } = await import("@/lib/auth");
  const payload = verifyToken(token);
  return !!payload?.username;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    await connectDB();
    const item = await Item.findById(id).lean();
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("GET /api/items/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    await connectDB();
    const body = await request.json();
    const update: Record<string, unknown> = {};
    if (body.name !== undefined) update.name = String(body.name).trim();
    if (typeof body.price === "number") update.price = body.price;
    if (body.description !== undefined)
      update.description = String(body.description).trim();
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl;
    if (body.category !== undefined)
      update.category =
        body.category === "" ? undefined : String(body.category).trim();
    if (typeof body.stock === "number" && body.stock >= 0)
      update.stock = body.stock;
    else if (body.stock !== undefined)
      update.stock = Math.max(0, Number(body.stock) || 0);

    const item = await Item.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    ).lean();
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/items/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    await connectDB();
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/items/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
