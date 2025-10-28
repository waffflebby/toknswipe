import { NextResponse } from "next/server"
import { fetchTokenChart } from "@/lib/api-enhanced"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenAddress = searchParams.get("token")
    const timeframe = (searchParams.get("timeframe") || "1D") as "1H" | "1D" | "1W" | "1M" | "ALL"

    if (!tokenAddress) {
      return NextResponse.json(
        { error: "Token address is required" },
        { status: 400 }
      )
    }

    const chartData = await fetchTokenChart(tokenAddress, timeframe)

    return NextResponse.json({
      data: chartData,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[API] Chart error:", error)
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    )
  }
}
