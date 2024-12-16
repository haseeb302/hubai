import { auth as middleware } from "@/auth";
import { NextResponse } from "next/server";

export default middleware((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/login";
  const isPublicPage = req.nextUrl.pathname === "/";

  // Force auth for all pages except login and public pages
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to chat if logged in and trying to access auth pages
  if (isLoggedIn && (isAuthPage || isPublicPage)) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// export const config = {
//   matcher: ["/chat/:path*", "/board/:path*"],
// };
