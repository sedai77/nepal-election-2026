import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const filePath = join(process.cwd(), "nepalgeojson", "country", "district.geojson");
  const data = readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data), {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
