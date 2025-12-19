import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RevalidateRequest = {
  tag?: string;
};

const ALLOWED_REVALIDATION_TAGS = new Set(["gallery"]);
const SAFE_TAG_PATTERN = /^[a-zA-Z0-9_-]+$/;

export async function POST(request: Request) {
  let payload: RevalidateRequest;
  try {
    payload = (await request.json()) as RevalidateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const tag = payload.tag?.trim();

  if (!tag) {
    return NextResponse.json({ error: "Missing tag" }, { status: 400 });
  }

  const isSafeTag = SAFE_TAG_PATTERN.test(tag);

  if (!isSafeTag || !ALLOWED_REVALIDATION_TAGS.has(tag)) {
    return NextResponse.json(
      { error: "Tag not allowed for revalidation" },
      { status: 400 }
    );
  }

  try {
    revalidateTag(tag);

    return NextResponse.json({
      ok: true,
      tag,
      message: "Revalidation requested",
    });
  } catch (error) {
    console.error("REVALIDATE_TAGS_ERROR", tag, error);
    return NextResponse.json(
      { error: "Failed to revalidate tag" },
      { status: 500 }
    );
  }
}
