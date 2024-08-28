import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  console.log("Cron Job Ran at: ", new Date());

  return new NextResponse("Cron Ran", { status: 200 });
}
