import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // If token exists, user is authorized.
            // We can also check role if needed: token?.role === "admin"
            return !!token;
        },
    },
    pages: {
        signIn: "/admin/login",
    },
});

export const config = {
    matcher: ["/admin/:path*"],
};
