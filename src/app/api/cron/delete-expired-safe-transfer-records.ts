import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Cron Job Ran at: ", new Date());

  return new Response("Cron Ran", { status: 200 });
}
