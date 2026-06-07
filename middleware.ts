import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/about",
  "/challenges",
  "/pricing",
  "/faq",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/paytabs-webhook",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublic(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
