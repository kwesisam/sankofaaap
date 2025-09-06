
"use client";
import { User, Shield, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

// Full Page Session Loading
export const SessionPageLoading = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
    <div className="relative mb-6">
      <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Shield className="w-6 h-6 text-amber-600" />
      </div>
    </div>
    <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
    <p className="text-gray-500 text-center">Please wait while we verify your session...</p>
  </div>
);

// Compact Session Loading (for components)
export const SessionCompactLoading = () => (
  <div className="flex items-center justify-center py-4">
    <div className="relative mr-3">
      <div className="w-6 h-6 rounded-full border-2 border-amber-200 border-t-amber-600 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <User className="w-3 h-3 text-amber-600" />
      </div>
    </div>
    <span className="text-sm text-gray-600">Loading session...</span>
  </div>
);

// Inline Session Loading (for navigation/headers)
export const SessionInlineLoading = () => (
  <div className="flex items-center gap-2">
    <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
    <span className="text-sm text-gray-600">Loading...</span>
  </div>
);

// Button-style Session Loading
export const SessionButtonLoading = () => (
  <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    Authenticating...
  </div>
);

// Card-style Session Loading
export const SessionCardLoading = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-center">
      <div className="relative mr-4">
        <div className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <User className="w-4 h-4 text-amber-600" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-700">Verifying Session</h3>
        <p className="text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  </div>
);

// Avatar Loading (for profile areas)
export const SessionAvatarLoading = () => (
  <div className="relative">
    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <User className="w-5 h-5 text-gray-400" />
    </div>
  </div>
);

// Usage Example Component
export const SessionLoadingExample = () => {
  // This is how you'd use it in your actual components
  const { data: session, status } = useSession();

  if (status === "loading") {
    // Choose the appropriate loading component based on your use case
    return <SessionPageLoading />; // For full page
    // return <SessionCompactLoading />; // For components
    // return <SessionInlineLoading />; // For navigation
    // return <SessionButtonLoading />; // For button areas
    // return <SessionCardLoading />; // For card layouts
    // return <SessionAvatarLoading />; // For profile avatars
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to continue</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-700">Welcome back, {session?.user?.name}!</p>
    </div>
  );
};

// HOC for Session Loading
export const withSessionLoading = (WrappedComponent: React.ComponentType, LoadingComponent = SessionPageLoading) => {
  return function SessionLoadingWrapper(props: any) {
    const { data: session, status } = useSession();

    if (status === "loading") {
      return <LoadingComponent />;
    }

    return <WrappedComponent {...props} session={session} />;
  };
};