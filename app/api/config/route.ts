import { NextResponse } from "next/server";
import { getRuntimeAgentConfig } from "@/lib/runtime-agent-config";

export const dynamic = "force-dynamic";

// GET /api/config - Return runtime brand/agent config
export async function GET() {
  try {
    const config = await getRuntimeAgentConfig();
    return NextResponse.json({
      success: true,
      config,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching runtime config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch config" },
      { status: 500 },
    );
  }
}
