import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/User.model";
import { signToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  await connectDB();

  const user = await User.findOne({
    email: email.toLowerCase(),
    isActive: true,
  }).select("+password +failedLoginAttempts +lockedUntil");

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (user.isLocked()) {
    const minutesLeft = Math.ceil(
      (user.lockedUntil!.getTime() - Date.now()) / 60000,
    );
    return NextResponse.json(
      { error: `Account locked. Try again in ${minutesLeft} minute(s).` },
      { status: 423 },
    );
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    await user.incrementFailedAttempts();
    const remaining = 5 - user.failedLoginAttempts;
    const msg =
      remaining > 0
        ? `Invalid credentials. ${remaining} attempt(s) remaining.`
        : "Account is now locked for 30 minutes.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  await user.resetLoginAttempts();

  const token = await signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const res = NextResponse.json({
    ok: true,
    user: { name: user.name, email: user.email, role: user.role },
  });

  res.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return res;
}
