import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, company } = await req.json();

    const adminClient = createAdminClient();
    
    // Create the user in Supabase Auth
    // By default, as requested, give all features to the user
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        company: company || "",
      },
      app_metadata: {
        features: ["unlimited_scrapes", "premium_support", "api_access"],
        role: "user" // Default role, superadmin will have "admin"
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
