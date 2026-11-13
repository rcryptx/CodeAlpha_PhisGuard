import { Link } from "react-router-dom";

import { PageMetadata } from "@/components/seo/PageMetadata";
import { appName, appTagline, navItems } from "@/config/site";
import { lessons } from "@/features/learning/curriculum";

const primaryLinkClasses =
  "inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-3 text-sm font-medium text-white transition duration-200 ease-out hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700";
const secondaryLinkClasses =
  "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition duration-200 ease-out hover:border-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700";

const developingTools = navItems.filter(({ to }) =>
  [
    "/inspector",
    "/practice",
    "/flashcards",
    "/assessments",
    "/progress",
    "/glossary",
    "/resources",
    "/zynx",
  ].includes(to),
);

export function HomePage() {
  return (
    <>
      <PageMetadata
        title="Think before you click"
        description="PhisGuard helps you build practical phishing-awareness skills through clear lessons on messages, links, account security, and safe online habits."
        path="/"
      />
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 border-b border-slate-200 pb-12 pt-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:pb-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Phishing awareness, made practical
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              {appName}
              <span className="block text-3xl font-normal tracking-tight text-slate-600 dark:text-slate-300 sm:text-4xl">
                {appTagline}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Digital messages move quickly. PhisGuard helps you build the habit
              of pausing, checking the context, and verifying before you
              respond.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/learn" className={primaryLinkClasses}>
                Explore the learning centre{" "}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
              <Link
                to="/learn/introduction-to-phishing"
                className={secondaryLinkClasses}
              >
                Start with phishing basics
              </Link>
            </div>
          </div>
          <aside className="border-l border-slate-300 pl-5 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <p className="font-medium text-slate-800 dark:text-slate-200">
              A useful first response
            </p>
            <p className="mt-2">
              Pause. Check what is being asked. Verify through a channel you
              already trust.
            </p>
          </aside>
        </section>

        <section
          aria-labelledby="problem-heading"
          className="grid gap-6 border-b border-slate-200 py-10 md:grid-cols-[0.7fr_1.3fr] md:py-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Why awareness matters
          </p>
          <div>
            <h2
              id="problem-heading"
              className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl"
            >
              Phishing is not always obvious—and no single clue tells the whole
              story.
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
              A deceptive request can arrive by email, text, phone, or a
              website. It may imitate someone familiar or create pressure to
              act. PhisGuard focuses on practical checks: consider the request,
              inspect the destination, and confirm through a separate trusted
              route.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="journey-heading"
          className="border-b border-slate-200 py-10 md:py-14"
        >
          <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Your learning journey
              </p>
              <h2
                id="journey-heading"
                className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
              >
                Build confidence one habit at a time.
              </h2>
            </div>
            <ol className="grid gap-5 sm:grid-cols-3">
              {[
                [
                  "01",
                  "Recognize",
                  "Learn how phishing appears across messages, calls, and websites.",
                ],
                [
                  "02",
                  "Protect",
                  "Practice safer account and browsing habits that fit everyday life.",
                ],
                [
                  "03",
                  "Respond",
                  "Know how to verify and report when something feels unusual.",
                ],
              ].map(([number, title, description]) => (
                <li key={number} className="border-t border-slate-300 pt-4">
                  <span className="text-xs font-medium tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {number}
                  </span>
                  <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <Link
            to="/learn"
            className="mt-7 inline-flex rounded-sm font-medium text-slate-800 underline decoration-slate-400 underline-offset-4 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Browse the {lessons.length}-lesson curriculum{" "}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </section>

        <section aria-labelledby="tools-heading" className="py-10 md:py-14">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Explore PhisGuard
              </p>
              <h2
                id="tools-heading"
                className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
              >
                Learn, inspect, practice, and track your lessons.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              The learning centre, URL Inspector, Practice Lab, Glossary,
              Resources, Assessments, and local lesson progress are available
              now. ZYNX requires server-side Gemini configuration; other areas
              are still being developed.
            </p>
          </div>
          <div className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {developingTools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group flex items-center justify-between border-t border-slate-200 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span>
                  <span className="block font-medium text-slate-800 group-hover:text-slate-950 dark:text-slate-200 dark:group-hover:text-white">
                    {tool.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {tool.to === "/inspector"
                      ? "Available now · local URL analysis"
                      : tool.to === "/practice"
                        ? "Available now · simulated scenarios"
                        : tool.to === "/progress"
                          ? "Available now · saved in this browser"
                          : tool.to === "/resources"
                            ? "Available now · curated guidance"
                            : tool.to === "/glossary"
                              ? "Available now · searchable A–Z"
                              : tool.to === "/zynx"
                              ? "Gemini server setup required"
                              : tool.to === "/assessments"
                                ? "Available now · curriculum-aligned"
                                : "Foundation in progress"}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-slate-500 transition-transform group-hover:translate-x-1 dark:text-slate-400"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
