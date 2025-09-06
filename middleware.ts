
import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
});

export const config = {
  matcher: [
    "/artisan-dashboard/:path*",
    "/user-dashboard/:path*",
  ],
};