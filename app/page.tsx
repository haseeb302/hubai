export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 max-w-6xl mx-auto">
      <main className="flex flex-col items-center text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            AI-Powered Workspace
            <span className="block text-primary mt-2">
              For Seamless Collaboration
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Making project management, knowledge transfer, and onboarding a
            <span className="text-primary font-semibold">
              {" "}
              simple and smooth{" "}
            </span>
            process.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">For CEOs</h3>
            <p className="text-muted-foreground">
              Maintain oversight and ensure consistent communication across all
              levels of your organization.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">For Teams</h3>
            <p className="text-muted-foreground">
              Collaborate effectively with AI-assisted project management and
              knowledge sharing.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">For New Joiners</h3>
            <p className="text-muted-foreground">
              Get up to speed quickly with instant access to relevant
              information and guidance.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          <p className="text-xl font-medium text-muted-foreground">
            Everyone on the same page, powered by AI.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row justify-center">
            <a
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              href="/chat/chat-1"
            >
              Get Started
            </a>
            <a
              className="px-8 py-3 rounded-lg border border-input hover:bg-accent transition-colors"
              href="/board/project-1"
            >
              View Demo
            </a>
          </div>
        </div>
      </main>

      {/* Social Proof or Additional Info */}
      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>Trusted by teams at innovative companies worldwide</p>
      </footer>
    </div>
  );
}
