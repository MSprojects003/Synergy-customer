import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerClient(); // now async — reads/writes cookies
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("🔄 Callback started with code:", code ? "Present" : "Missing");

  if (!code) {
    console.error("❌ No code received");
    return NextResponse.redirect(new URL("/?error=no_code", requestUrl.origin));
  }

  try {
    // Exchange code for session
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("❌ Session Exchange Error:", sessionError.message);
      return NextResponse.redirect(new URL("/?error=session_failed", requestUrl.origin));
    }

    const user = data.user;
    if (!user) {
      console.error("❌ No user found after exchange");
      return NextResponse.redirect(new URL("/?error=no_user", requestUrl.origin));
    }

    console.log("✅ User authenticated:", user.email);

    // 1. Check if user already exists in your `users` table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle(); // ← use maybeSingle, NOT single. Returns null instead of throwing when no row exists.

    if (checkError) {
      // A real DB/network error (not "no rows") — this is different from "user doesn't exist"
      console.error("❌ Check user error:", checkError.message);
      return NextResponse.redirect(new URL("/?error=db_check_failed", requestUrl.origin));
    }

    // 2a. EXISTING USER → just sign in, skip insertion entirely
    if (existingUser) {
      console.log("✅ Existing user signed in:", user.id);
      return NextResponse.redirect(new URL("/?success=signed_in", requestUrl.origin));
    }

    // 2b. NEW USER → run signup insertion logic
    console.log("🆕 No existing user found, creating new user + customer...");

    const fullName =
      user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "";
    const nameParts = fullName.trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    // Insert into users table
    const { error: userError } = await supabase.from("users").insert({
      id: user.id,
      first_name,
      last_name,
      email: user.email,
      profile_image: user.user_metadata?.avatar_url ?? null,
      is_customer: true,
    });

    if (userError) {
      console.error("❌ Users insert error:", userError.message, userError.details);
      // Don't continue to customers insert — the parent row failed.
      return NextResponse.redirect(new URL("/?error=user_insert_failed", requestUrl.origin));
    }

    // Insert into customers table (only runs if users insert succeeded)
    const { error: customerError } = await supabase.from("customers").insert({
      user_id: user.id,
    });

    if (customerError) {
      console.error("❌ Customers insert error:", customerError.message, customerError.details);
      // Rollback: remove the orphaned users row so retrying signup doesn't hit
      // a "user already exists" false-positive on the next attempt.
      await supabase.from("users").delete().eq("id", user.id);
      return NextResponse.redirect(new URL("/?error=customer_insert_failed", requestUrl.origin));
    }

    console.log("✅ New user & customer created:", user.id);
    return NextResponse.redirect(new URL("/?success=account_created", requestUrl.origin));
  } catch (err: any) {
    console.error("💥 Unexpected Callback Error:", err.message);
    return NextResponse.redirect(new URL("/?error=unknown", requestUrl.origin));
  }
}
