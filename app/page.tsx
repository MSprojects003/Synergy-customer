import { Button } from "@/components/ui/button"

export default function HomePage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      if (success === "signed_in") {
        toast.success("✅ Successfully signed in! Welcome back.");
      } else if (success === "account_created") {
        toast.success("🎉 Account created successfully! Welcome to Denuri.");
      }
    } else if (error) {
      // Log the raw code to the browser console so you can see it even
      // without reading server logs.
      console.error("Auth callback error code:", error);
      const message = ERROR_MESSAGES[error] || `Authentication failed (${error}).`;
      toast.error("❌ " + message);
    }

    // Clean URL after showing toast
    if (success || error) {
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  );
}