import { success } from "@/lib/apiResponse";

export async function POST() {
  const response = success({ message: "Logged out successfully" });
  response.headers.set(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
  );
  return response;
}