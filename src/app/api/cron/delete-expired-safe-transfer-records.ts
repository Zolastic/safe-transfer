import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  console.log("Cron Job Ran at: ", new Date());

  try {
    await api.safeTransfer.deleteExpiredSafeTransferRecords();
  } catch (error) {
    console.error("Error deleting expired safe transfer records: ", error);
    return new NextResponse("Error deleting expired safe transfer records", {
      status: 500,
    });
  }

  return new NextResponse("Deleted expired safe transfer records", {
    status: 200,
  });
}
