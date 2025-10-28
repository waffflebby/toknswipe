import { NextResponse } from "next/server"
import { fetchTokenHolders } from "@/lib/api-enhanced"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenAddress = searchParams.get("token")

    if (!tokenAddress) {
      return NextResponse.json(
        { error: "Token address is required" },
        { status: 400 }
      )
    }

    const holdersData = await fetchTokenHolders(tokenAddress)

    return NextResponse.json({
      data: holdersData,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[API] Holders error:", error)
    return NextResponse.json(
      { error: "Failed to fetch holders data" },
      { status: 500 }
    )
  }
}
