import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Headphones,
  Lock,
  MapPin,
  Menu,
  MonitorSmartphone,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const coreValues = [
  {
    icon: Headphones,
    title: "Anytime Support",
    description:
      "Helpful guidance and responsive support designed to keep your business moving forward.",
  },
  {
    icon: MonitorSmartphone,
    title: "Access Anywhere",
    description:
      "Use your business tools across devices with a simple, responsive experience.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "Solutions designed around practical business needs and better customer experiences.",
  },
  {
    icon: Sparkles,
    title: "Affordability",
    description:
      "Modern technology with a practical approach to cost and long-term value.",
  },
  {
    icon: ShieldCheck,
    title: "Data Security",
    description:
      "Security-focused systems designed to protect important business information.",
  },
  {
    icon: CheckCircle2,
    title: "Long-Term Commitment",
    description:
      "Technology and support built to grow with changing business requirements.",
  },
];

const testimonials = [
  {
    name: "Business Partner",
    role: "Client",
    text:
      "A customer-focused approach with practical solutions designed around real business requirements.",
  },
  {
    name: "Business Owner",
    role: "Client",
    text:
      "The team understands business workflows and turns everyday requirements into useful digital solutions.",
  },
  {
    name: "Technology User",
    role: "Client",
    text:
      "A responsive team with a strong focus on service, solutions and long-term collaboration.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}

          <Link
            to="/home"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20">
              <Cloud size={21} />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                TAGITStore
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Smart business solutions
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#product"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Product
            </a>

            <a
              href="#support"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Support
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              About Us
            </a>

            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Pricing
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/signup"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Login
            </Link>
          </div>

          {/* Mobile Button */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (value) => !value
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl space-y-1">
              <a
                href="#product"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Product
              </a>

              <a
                href="#support"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Support
              </a>

              <a
                href="#about"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                About Us
              </a>

              <a
                href="#pricing"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Pricing
              </a>

              <a
                href="#contact"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Contact
              </a>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden">
        <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute right-0 top-20 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* Hero Content */}

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Sparkles size={14} />
              Innovative solutions for modern businesses
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Elevate your business
              <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                with smarter technology.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              TAGITStore helps businesses simplify
              day-to-day operations with secure,
              practical and scalable digital solutions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-blue-500"
              >
                Explore Demo
                <ArrowRight size={17} />
              </button>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Contact Us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className="text-emerald-500"
                />
                Secure platform
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className="text-emerald-500"
                />
                Responsive experience
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className="text-emerald-500"
                />
                Cloud based
              </span>
            </div>
          </div>

          {/* Hero Visual */}

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-cyan-500/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
              <div className="rounded-[1.4rem] bg-slate-950 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      TAGITStore
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      Business Overview
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-400">
                    Live
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs text-slate-500">
                      Orders
                    </p>
                    <p className="mt-2 text-2xl font-black text-white">
                      1,248
                    </p>
                    <p className="mt-1 text-xs text-emerald-400">
                      +18.4%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs text-slate-500">
                      Customers
                    </p>
                    <p className="mt-2 text-2xl font-black text-white">
                      8.4K
                    </p>
                    <p className="mt-1 text-xs text-cyan-400">
                      Growing
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        Revenue
                      </p>
                      <p className="mt-1 text-3xl font-black text-white">
                        $24.8K
                      </p>
                    </div>

                    <div className="flex items-end gap-1.5">
                      {[30, 42, 36, 57, 48, 66, 78].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="w-2 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400"
                            style={{
                              height: `${height}px`,
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT
      ===================================================== */}

      <section
        id="product"
        className="scroll-mt-20 border-y border-slate-200 bg-slate-50/70 py-20 dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              Product
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Solutions designed around real business needs.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Build a simpler workflow with connected tools,
              secure data and a clear view of your business.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Package size={23} />
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Pawn Broker Automation
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                A dedicated business solution built to
                simplify operational workflows, improve
                visibility and reduce repetitive work.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Centralized business information",
                  "Simplified day-to-day workflows",
                  "Secure cloud-based access",
                  "Better operational visibility",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-emerald-500"
                    />
                    {item}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400"
              >
                Explore demo
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-7 text-white shadow-xl shadow-blue-600/20">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/70">
                      Digital workspace
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Connected. Secure. Simple.
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                    <Lock size={22} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs text-white/60">
                      Cloud access
                    </p>
                    <p className="mt-2 text-lg font-bold">
                      Anywhere
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs text-white/60">
                      Protection
                    </p>
                    <p className="mt-2 text-lg font-bold">
                      Secure
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/75">
                      Business workflow
                    </span>

                    <span className="text-xs font-bold text-emerald-200">
                      Optimized
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[82%] rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE VALUES
      ===================================================== */}

      <section
        id="about"
        className="scroll-mt-20 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              About Us
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Technology built around people and business.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Our approach focuses on practical solutions,
              responsive service, accessibility and secure
              technology.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map(
              (value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30 dark:hover:shadow-black/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {value.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">

          <StatCard
            value="15+"
            label="Years Overall Experience"
          />

          <StatCard
            value="1000+"
            label="Satisfied Clients"
          />

          <StatCard
            value="90%"
            label="Positive Feedback"
          />
        </div>
      </section>

      {/* =====================================================
          SUPPORT
      ===================================================== */}

      <section
        id="support"
        className="scroll-mt-20 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Support
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Need help? We keep support simple.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                From product questions to operational guidance,
                support should be easy to reach and easy to understand.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Responsive assistance",
                  "Practical product guidance",
                  "Business-focused support",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2
                        size={16}
                      />
                    </div>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Headphones size={22} />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Talk with the TAGITStore team
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Tell us what your business needs and we can
                help identify a practical next step.
              </p>

              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Contact Us
                <ArrowRight size={16} />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          PRICING
      ===================================================== */}

      <section
        id="pricing"
        className="scroll-mt-20 border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              Pricing
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Flexible solutions for different business needs.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Start with the right solution for your business
              and scale as your requirements grow.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Essential
              </p>

              <h3 className="mt-3 text-2xl font-black">
                Business Starter
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                A practical starting point for teams building
                organized digital workflows.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Core business tools",
                  "Responsive access",
                  "Secure authentication",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500"
                    />
                    {item}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/signup")
                }
                className="mt-7 w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Get Started
              </button>
            </div>

            <div className="relative rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-7 text-white shadow-xl shadow-blue-600/20">
              <div className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Recommended
              </div>

              <p className="text-sm font-bold text-white/70">
                Complete
              </p>

              <h3 className="mt-3 text-2xl font-black">
                Business Growth
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/75">
                Designed for businesses that need a broader,
                connected digital workflow.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Advanced business workflows",
                  "Analytics and reporting",
                  "Customer and order management",
                  "Scalable cloud experience",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/90"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-200"
                    />
                    {item}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="mt-7 w-full rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Demo
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              Client Feedback
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Built with customer needs in mind.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Strong relationships and useful solutions are at
              the center of the TAGITStore experience.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map(
              (testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
                >
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({
                      length: 5,
                    }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          size={15}
                          fill="currentColor"
                        />
                      )
                    )}
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    “{testimonial.text}”
                  </p>

                  <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                    <p className="font-bold">
                      {testimonial.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-12 text-white shadow-2xl shadow-blue-600/20 sm:px-10 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/65">
                Get started
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                Ready to take your business workflow to the next level?
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                Explore TAGITStore and see how a modern digital
                workflow can simplify everyday business operations.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Demo
                <ArrowRight size={17} />
              </button>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                Contact Us
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        id="contact"
        className="scroll-mt-20 border-t border-slate-200 py-20 dark:border-slate-800"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-2">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Contact
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Let's talk about your business needs.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
                Reach out to the TAGITStore team for product
                questions, support or business enquiries.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Business Support
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Contact the team for assistance and enquiries
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Secure Communication
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      We take business information and data protection seriously
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-black">
                Quick Contact
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Use the contact details available through the
                TAGITStore public website for direct enquiries.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email
                </p>

                <a
                  href="mailto:istorecare@tagit.store"
                  className="mt-2 block text-sm font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  istorecare@tagit.store
                </a>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone
                </p>

                <a
                  href="tel:+919843166444"
                  className="mt-2 block text-sm font-bold text-slate-900 dark:text-white"
                >
                  +91 98431 66444
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid gap-8 md:grid-cols-4">

            <div className="md:col-span-2">
              <Link
                to="/home"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
                  <Cloud size={20} />
                </div>

                <div>
                  <p className="font-black">
                    TAGITStore
                  </p>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Smart business solutions
                  </p>
                </div>
              </Link>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Modern technology, practical business solutions
                and secure digital experiences.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold">
                Pages
              </p>

              <div className="mt-4 space-y-3">
                <a
                  href="#product"
                  className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Product
                </a>

                <a
                  href="#about"
                  className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  About Us
                </a>

                <a
                  href="#pricing"
                  className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Pricing
                </a>

                <a
                  href="#contact"
                  className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Contact
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold">
                Account
              </p>

              <div className="mt-4 space-y-3">
                <Link
                  to="/login"
                  className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Register
                </Link>

                <Link
                  to="/home"
                  className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Home
                </Link>
              </div>
            </div>

          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-500">
            <p>
              © {new Date().getFullYear()} TAGITStore. All rights reserved.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Terms
              </a>

              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Privacy
              </a>

              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Cookies
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
      <p className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}