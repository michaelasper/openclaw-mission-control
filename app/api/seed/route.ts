import { NextRequest, NextResponse } from "next/server";
import { seedAgents } from "@/lib/local-storage";

export const dynamic = "force-dynamic";

// POST /api/seed - Seed the database with initial data
export async function POST(request: NextRequest) {
  try {
    await seedAgents();

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 },
    );
  }
}
