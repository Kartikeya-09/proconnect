import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-6 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-6 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--muted)]">
              Pro Connect
            </p>
            <h1 className="font-display text-4xl leading-tight md:text-5xl">
              Connect with people who move your career forward.
            </h1>
            <p className="text-lg text-[color:var(--muted)]">
              Join circles, share what you are building, and grow a network that
              actually responds.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  router.push("/login");
                }}
                className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-500/20 transition hover:-translate-y-0.5"
              >
                Join now
              </button>
              <div className="rounded-full border border-subtle bg-white/70 px-5 py-3 text-sm font-semibold text-[color:var(--muted)]">
                1,200+ profiles active today
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Publish smart updates",
                "Find rising talent",
                "Build stronger ties",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-subtle bg-white/80 px-4 py-3 text-sm font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="card-surface rounded-[32px] p-6">
              <img
                src="/images/image.jpg"
                alt="Networking illustration"
                className="w-full rounded-2xl object-cover"
              />
            </div>
            <div className="absolute -left-6 -top-6 hidden rounded-2xl border border-subtle bg-white px-4 py-3 text-xs font-semibold shadow-lg md:block">
              New: Spotlight collections
            </div>
            <div className="absolute -bottom-6 right-6 hidden rounded-2xl border border-subtle bg-white px-4 py-3 text-xs font-semibold shadow-lg md:block">
              92% responses in 24h
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 rounded-3xl border border-subtle bg-white/80 px-6 py-8 shadow-sm md:grid-cols-3">
          {[
            { label: "Active members", value: "24k+" },
            { label: "Weekly connections", value: "85k" },
            { label: "New opportunities", value: "3.2k" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                {stat.label}
              </p>
              <p className="font-display text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
              Why Pro Connect
            </p>
            <h2 className="font-display text-3xl">
              A landing space for real professional momentum.
            </h2>
            <p className="text-base text-[color:var(--muted)]">
              Built for people who want fast feedback, meaningful
              collaborations, and a network that feels personal.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Curated circles",
                copy: "Join high-signal groups based on goals and skills.",
              },
              {
                title: "Insightful profiles",
                copy: "Highlight your wins and track growth metrics.",
              },
              {
                title: "Opportunity radar",
                copy: "Surface roles, gigs, and collaborations instantly.",
              },
              {
                title: "Fast feedback",
                copy: "Get reactions on ideas within a few hours.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-subtle bg-white p-5 shadow-sm"
              >
                <p className="font-semibold">{feature.title}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {feature.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-subtle bg-[color:var(--surface)] p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                How it works
              </p>
              <h2 className="font-display text-3xl">Build your network in days.</h2>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
            >
              Start free
            </button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your signal",
                copy: "Showcase what you are building and your next goal.",
              },
              {
                step: "02",
                title: "Join the right rooms",
                copy: "Tap into circles aligned with your industry.",
              },
              {
                step: "03",
                title: "Build momentum",
                copy: "Track responses and keep the conversation moving.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-subtle bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                  {item.step}
                </p>
                <p className="mt-3 text-lg font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "The circles feature helped me meet three mentors in one week.",
              name: "Jenna K.",
              role: "Product designer",
            },
            {
              quote:
                "We filled two roles in days, and the conversations felt real.",
              name: "Luis M.",
              role: "Founder",
            },
            {
              quote:
                "The layout makes it easy to share updates without the noise.",
              name: "Ava S.",
              role: "Growth lead",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-3xl border border-subtle bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-[color:var(--muted)]">{testimonial.quote}</p>
              <div className="mt-4">
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="text-xs text-[color:var(--muted)]">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="relative overflow-hidden rounded-[36px] border border-subtle bg-[linear-gradient(130deg,#0ea5e9,#f97316)] p-10 text-white shadow-2xl shadow-orange-500/30">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                Ready to start
              </p>
              <h2 className="font-display text-3xl">
                Build your next opportunity faster.
              </h2>
              <p className="text-sm text-white/80">
                Start your profile, join the right rooms, and see responses in
                hours.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/login")}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl transition hover:-translate-y-0.5"
              >
                Join now
              </button>
              <button className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Book a demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-6 border-t border-subtle bg-white/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
          <div className="space-y-3">
            <p className="font-display text-xl">Pro Connect</p>
            <p className="text-sm text-[color:var(--muted)]">
              The faster way to build professional momentum.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Security", "Integrations", "Pricing"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Press", "Contact"],
            },
            {
              title: "Resources",
              links: ["Blog", "Guides", "Community", "Support"],
            },
          ].map((column) => (
            <div key={column.title} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                {column.title}
              </p>
              <div className="space-y-2 text-sm">
                {column.links.map((link) => (
                  <p key={link} className="text-[color:var(--muted)]">
                    {link}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-subtle">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-4 text-xs text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
            <p>2026 Pro Connect. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </UserLayout>
  );
}
