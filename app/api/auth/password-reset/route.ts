import { hashPassword } from "@/lib/password";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    const hashedPassword = await hashPassword(newPassword);
    console.log("hashedPassword", hashedPassword);
    console.log("email", email);

    const { data: user, error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", email)
      .select()
      .single();

    console.log(user);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to reset password", error);
    return Response.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
