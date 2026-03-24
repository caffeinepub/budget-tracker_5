import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, PiggyBank, Shield, TrendingUp, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const BENEFITS = [
  {
    icon: TrendingUp,
    text: "Track spending across 6 categories",
  },
  {
    icon: PiggyBank,
    text: "See exactly how much you save",
  },
  {
    icon: Shield,
    text: "Secured by Internet Identity",
  },
];

export default function LoginPage() {
  const { login, isLoggingIn, isLoginSuccess, identity } =
    useInternetIdentity();
  const navigate = useNavigate();

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isLoginSuccess || identity) {
      void navigate({ to: "/dashboard" });
    }
  }, [isLoginSuccess, identity, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel – branding ─────────────────────── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-muted/20 p-12 lg:flex lg:w-1/2">
        {/* Background grid */}
        <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />
        <div className="hero-radial absolute inset-0 pointer-events-none" />

        {/* Floating orbs */}
        <div className="absolute top-[20%] right-[10%] h-64 w-64 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[20%] left-[5%] h-48 w-48 rounded-full bg-chart-4/8 blur-3xl pointer-events-none" />

        <div className="relative">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.home_link"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-bold">BudgetTrack</span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">
              Your finances,{" "}
              <span className="text-gradient">crystal clear.</span>
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-sm">
              Join thousands of users who track their monthly expenses and save
              more with BudgetTrack.
            </p>
          </div>

          <div className="space-y-4">
            {BENEFITS.map((b) => (
              <div key={b.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/15">
                  <b.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground/80">{b.text}</span>
              </div>
            ))}
          </div>

          {/* Mock savings card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="animate-float card-glow-success rounded-2xl border border-success/20 bg-success/10 p-5 max-w-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-success">
                Monthly Savings
              </span>
              <span className="text-xs text-muted-foreground">March 2026</span>
            </div>
            <div className="font-display text-3xl font-bold text-success">
              ₹32,700
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              38.5% of income saved
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-success/20">
              <div
                className="h-1.5 rounded-full bg-success"
                style={{ width: "38.5%" }}
              />
            </div>
          </motion.div>
        </div>

        <div className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} BudgetTrack. Built with{" "}
          <span className="text-destructive">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>

      {/* ── Right panel – login form ───────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        {/* Mobile header */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <Link to="/" data-ocid="nav.home_link">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display text-xl font-bold">
                BudgetTrack
              </span>
            </div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="card-glow rounded-2xl border border-border/60 bg-card p-8">
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access your budget dashboard
              </p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full gap-3 h-12 text-base font-semibold shadow-glow hover:shadow-glow-sm transition-all"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="login.submit_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Sign in with Internet Identity
                  </>
                )}
              </Button>

              <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  <Shield className="inline h-3 w-3 text-primary mr-1" />
                  Internet Identity provides secure, anonymous authentication.
                  No passwords, no personal data shared.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                New here?{" "}
                <span className="text-primary">
                  Signing in creates your account automatically.
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.home_link"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
