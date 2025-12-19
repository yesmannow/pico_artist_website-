import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RevalidateRequest = {
  tag?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RevalidateRequest;
    const tag = payload.tag?.trim();

    if (!tag) {
      return NextResponse.json({ error: "Missing tag" }, { status: 400 });
    }

    revalidateTag(tag);

    return NextResponse.json({
      ok: true,
      tag,
      message: "Revalidation requested",
    });
  } catch (error) {
    console.error("REVALIDATE_TAGS_ERROR", error);
    return NextResponse.json(
      { error: "Failed to revalidate tag" },
      { status: 500 }
    );
  }
}
