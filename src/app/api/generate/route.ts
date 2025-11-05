import { NextResponse } from "next/server";
import { marketingInputSchema } from "@/lib/marketing/schema";
import { generateMarketingResponse } from "@/lib/marketing/generator";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = marketingInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "failed",
          message: "Invalid payload",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 422 }
      );
    }

    const result = generateMarketingResponse(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[marketing-generator] error", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
