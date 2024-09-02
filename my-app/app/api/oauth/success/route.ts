import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextResponse,  NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userid");
    const secret = request.nextUrl.searchParams.get("secret");

  const { account } = await createAdminClient();
  const session = await account.createSession(userId!, secret!);

  cookies().set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/map`);
}