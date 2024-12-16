import { hashPassword } from "@/lib/password";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const hashedPassword = await hashPassword(password);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
      })
      .select()
      .single();
    console.log(user);
    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to create user", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
