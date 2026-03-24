import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Check,
  ChevronRight,
  PiggyBank,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Track Every Expense",
    description:
      "Log expenses by category in seconds. See exactly where your money goes — Food, Rent, Transport, and more.",
  },
  {
    icon: TrendingUp,
    title: "Monthly Reports",
    description:
      "Visual breakdowns of your monthly spending with progress bars and category analysis.",
  },
  {
    icon: PiggyBank,
    title: "Savings Goals",
    description:
      "Set your monthly income and watch your savings grow. Get instant feedback on how much you're saving.",
  },
  {
    icon: BarChart3,
    title: "Category Breakdown",
    description:
      "Color-coded categories help you instantly spot over-spending in any area of your life.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Set Your Income",
    description: "Enter your monthly income to establish your budget baseline.",
  },
  {
    step: "02",
    title: "Log Your Expenses",
    description:
      "Add expenses with category, amount, and date as they happen throughout the month.",
  },
  {
    step: "03",
    title: "Watch Savings Grow",
    description:
      "Track your savings in real-time and make smarter financial decisions every month.",
  },
];

const STATS = [
  { value: "₹0 fees", label: "Always free to use" },
  { value: "6+", label: "Spending categories" },
  { value: "100%", label: "Private & secure" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* ── Navigation ────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              BudgetTrack
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToFeatures}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              data-ocid="nav.home_link"
            >
              Features
            </button>
            <Link to="/login">
              <Button
                size="sm"
                className="font-semibold"
                data-ocid="nav.login_button"
              >
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20">
        {/* Background effects */}
        <div className="hero-radial absolute inset-0 pointer-events-none" />
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-[15%] h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[10%] h-48 w-48 rounded-full bg-chart-3/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              <Zap className="h-3 w-3" />
              Smart Budget Tracking on the Blockchain
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Take control of your{" "}
              <span className="text-gradient">monthly budget</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              Track every rupee you spend, categorize your expenses, and
              discover how much you can save — all in one beautiful dashboard.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link to="/login">
                <Button
                  size="lg"
                  className="gap-2 px-8 font-semibold shadow-glow hover:shadow-glow-sm transition-shadow"
                  data-ocid="home.get_started_button"
                >
                  Get Started Free
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToFeatures}
                className="gap-2 px-8 font-semibold border-border/60 hover:bg-accent"
                data-ocid="home.learn_more_button"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="mt-16 flex flex-wrap justify-center gap-8 text-center"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="mt-20 mx-auto max-w-4xl"
          >
            <div className="card-glow rounded-2xl border border-border/60 bg-card overflow-hidden">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
                <div className="ml-4 flex-1 rounded-md bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  budgettrack.app/dashboard
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-lg font-bold">
                      March 2026
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Monthly Overview
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-7 rounded-md border border-border/60 bg-muted/40 animate-pulse" />
                    <div className="h-7 w-20 rounded-md bg-primary/20" />
                  </div>
                </div>
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    {
                      label: "Income",
                      val: "₹85,000",
                      color: "text-foreground",
                    },
                    {
                      label: "Spent",
                      val: "₹52,300",
                      color: "text-destructive",
                    },
                    { label: "Saved", val: "₹32,700", color: "text-success" },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="rounded-lg border border-border/50 bg-muted/30 p-3"
                    >
                      <div className="text-[10px] text-muted-foreground">
                        {c.label}
                      </div>
                      <div
                        className={`font-display text-sm font-bold mt-1 ${c.color}`}
                      >
                        {c.val}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Category bars */}
                <div className="space-y-2">
                  {[
                    { cat: "Food", pct: 65, color: "bg-category-food" },
                    { cat: "Rent", pct: 40, color: "bg-category-rent" },
                    {
                      cat: "Transport",
                      pct: 25,
                      color: "bg-category-transport",
                    },
                    {
                      cat: "Entertainment",
                      pct: 15,
                      color: "bg-category-entertainment",
                    },
                  ].map((b) => (
                    <div key={b.cat} className="flex items-center gap-3">
                      <div className="w-20 text-[10px] text-muted-foreground">
                        {b.cat}
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-muted/50">
                        <div
                          className={`h-2 rounded-full ${b.color}`}
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                      <div className="w-8 text-right text-[10px] text-muted-foreground">
                        {b.pct}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div
              variants={itemVariants}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-1.5 text-xs font-semibold text-muted-foreground"
            >
              <Shield className="h-3 w-3 text-primary" />
              Everything you need
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Financial clarity, simplified
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-muted-foreground max-w-lg mx-auto"
            >
              BudgetTrack gives you all the tools to understand your spending
              and start saving more, every single month.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map((feat) => (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                className="card-glow group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20 transition-all group-hover:bg-primary/25">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display mb-2 text-base font-bold">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-muted/10 pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              How it works
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-muted-foreground"
            >
              Three simple steps to financial awareness.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid gap-8 md:grid-cols-3"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative"
              >
                {i < STEPS.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-border to-transparent md:block" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                    <span className="font-display text-2xl font-bold text-primary">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display mb-2 text-lg font-bold">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-chart-4/10 p-12 text-center"
          >
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to save more money?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                Start tracking your expenses today and discover how small
                changes add up to big savings.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="gap-2 px-10 font-semibold shadow-glow"
                    data-ocid="home.get_started_button"
                  >
                    Start Tracking Free
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 text-success" />
                  No credit card required
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
              <Wallet className="h-3 w-3 text-primary" />
            </div>
            <span className="font-display text-sm font-semibold">
              BudgetTrack
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-destructive">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
