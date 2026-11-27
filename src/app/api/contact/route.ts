import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Expected application/json payload." },
        { status: 415 }
      );
    }

    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      topic?: unknown;
      message?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json(
        { error: "Please enter your name (2–120 characters)." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email) || email.length > 180) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (message.length < 10 || message.length > 3000) {
      return NextResponse.json(
        { error: "Message should be between 10 and 3000 characters." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      deliveryMode: "preview",
      topic: topic || "Engineering Inquiry",
      note: "Message validated in portfolio preview mode. Connect an email provider (e.g., Resend, Postmark, or SMTP) in src/app/api/contact/route.ts for live inbox delivery.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request payload." },
      { status: 400 }
    );
  }
}
