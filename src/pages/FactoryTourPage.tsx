import { useState, type JSX, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { CTASection } from "../components/sections/CTASection";
import { MetricStrip } from "../components/sections/MetricStrip";
import { PageHero } from "../components/sections/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import {
  factoryTourModes,
  factoryTourStops,
  factoryTourViewerChecklist,
} from "../data/factoryTour";

type FactoryFloorMapProps = {
  activeStopId: string;
  onSelectStop: (stopId: string) => void;
};

const tourPathPoints = factoryTourStops
  .map((stop) => `${stop.x + stop.width / 2},${stop.y + stop.height / 2}`)
  .join(" ");

const factoryTourEmbedUrl = import.meta.env.VITE_FACTORY_TOUR_EMBED_URL?.trim();

function handleMapKeyDown(
  event: KeyboardEvent<SVGGElement>,
  stopId: string,
  onSelectStop: (nextStopId: string) => void,
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onSelectStop(stopId);
  }
}

function FactoryFloorMap({
  activeStopId,
  onSelectStop,
}: FactoryFloorMapProps): JSX.Element {
  return (
    <article className="surface-card overflow-hidden">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="chip">Factory Map</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Follow the visitor route through the floor
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-slate-300">
          Click any zone to jump between stops. The highlighted route mirrors
          the story you can later connect to the 3D model.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-accentSoft/20 bg-slate-950/80 p-3 shadow-[inset_0_0_0_1px_rgba(96,143,255,0.08)] sm:p-4">
        <svg
          viewBox="0 0 100 74"
          className="aspect-[10/7] w-full"
          role="img"
          aria-labelledby="factory-floor-map-title"
        >
          <title id="factory-floor-map-title">
            Factory tour map with clickable production zones
          </title>
          <defs>
            <linearGradient
              id="tour-surface"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(13, 23, 42, 0.95)" />
              <stop offset="100%" stopColor="rgba(2, 6, 23, 0.85)" />
            </linearGradient>
          </defs>

          <rect
            x="1"
            y="1"
            width="98"
            height="72"
            rx="7"
            fill="url(#tour-surface)"
            stroke="rgba(96, 143, 255, 0.2)"
          />

          <path
            d="M32 6H60V56H80V70H20V56H32Z"
            fill="rgba(15, 23, 42, 0.84)"
            stroke="rgba(148, 163, 184, 0.14)"
            strokeDasharray="1.25 1.25"
          />

          <polyline
            points={tourPathPoints}
            fill="none"
            stroke="rgba(14, 165, 233, 0.18)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={tourPathPoints}
            fill="none"
            stroke="rgba(96, 143, 255, 0.92)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {factoryTourStops.map((stop, index) => {
            const isActive = stop.id === activeStopId;
            const labelStartY = stop.y + stop.height / 2 - (stop.labelLines.length - 1) * 3;
            const stopNumberX = stop.x + 6.5;
            const stopNumberY = stop.y + 5.5;

            return (
              <g
                key={stop.id}
                role="button"
                tabIndex={0}
                aria-label={`Open stop ${index + 1}: ${stop.title}`}
                aria-pressed={isActive}
                className="cursor-pointer"
                onClick={() => onSelectStop(stop.id)}
                onKeyDown={(event) => handleMapKeyDown(event, stop.id, onSelectStop)}
              >
                <rect
                  x={stop.x}
                  y={stop.y}
                  width={stop.width}
                  height={stop.height}
                  rx="4"
                  fill={
                    isActive
                      ? "rgba(20, 40, 175, 0.55)"
                      : "rgba(15, 23, 42, 0.76)"
                  }
                  stroke={
                    isActive
                      ? "rgba(96, 143, 255, 0.92)"
                      : "rgba(148, 163, 184, 0.22)"
                  }
                  strokeWidth={isActive ? 1.6 : 1}
                />
                <circle
                  cx={stopNumberX}
                  cy={stopNumberY}
                  r="2.55"
                  fill={isActive ? "#bfdbfe" : "rgba(96, 143, 255, 0.8)"}
                />
                <text
                  x={stopNumberX}
                  y={stopNumberY + 0.55}
                  textAnchor="middle"
                  fontSize="2.35"
                  fontWeight="700"
                  fill="#020617"
                >
                  {index + 1}
                </text>
                {stop.labelLines.map((line, lineIndex) => (
                  <text
                    key={`${stop.id}-${line}`}
                    x={stop.x + stop.width / 2}
                    y={labelStartY + lineIndex * 6}
                    textAnchor="middle"
                    fontSize="3.15"
                    fontWeight={isActive ? "700" : "600"}
                    fill={isActive ? "#eff6ff" : "rgba(226, 232, 240, 0.92)"}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </article>
  );
}

function ViewerPanel(): JSX.Element {
  if (factoryTourEmbedUrl) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-accentSoft/30 bg-black/70 shadow-card">
        <div className="border-b border-accentSoft/20 px-5 py-4">
          <p className="chip">3D Viewer</p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Live virtual walkthrough
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            Visitors can orbit, inspect, and explore the published factory
            model directly in the browser.
          </p>
        </div>
        <iframe
          title="Factory virtual tour viewer"
          src={factoryTourEmbedUrl}
          className="min-h-[420px] w-full border-0"
          loading="lazy"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-dashed border-accentSoft/35 bg-gradient-to-br from-accent/25 via-slate-950 to-support/20 shadow-card">
      <div className="border-b border-accentSoft/20 px-5 py-4">
        <p className="chip">3D Viewer</p>
        <h3 className="mt-4 text-2xl font-semibold text-white">
          Viewer slot ready for the final model
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          The floor map is live now, and this panel is prepared for the
          published factory model as soon as your 3D artist exports it for web.
        </p>
      </div>

      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden px-6 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,143,255,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(46,134,171,0.2),transparent_38%)]" />
        <div className="absolute h-56 w-56 rounded-full border border-accentSoft/20 bg-accentSoft/10 blur-3xl" />
        <div className="relative max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-accentSoft/35 bg-black/40 text-4xl text-accentSoft shadow-glow">
            3D
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accentSoft">
            Awaiting final publish
          </p>
          <h4 className="mt-4 text-3xl font-semibold text-white">
            Drop in the optimized factory model when it is ready
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
            Until then, visitors can already use the guided map below to learn
            how projects move through your space from briefing to dispatch.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FactoryTourPage(): JSX.Element {
  const [activeStopId, setActiveStopId] = useState(factoryTourStops[0]?.id ?? "");
  const activeStop =
    factoryTourStops.find((stop) => stop.id === activeStopId) ?? factoryTourStops[0];
  const activeStopNumber =
    factoryTourStops.findIndex((stop) => stop.id === activeStop.id) + 1;

  return (
    <>
      <PageHero
        eyebrow="Interactive Factory Tour"
        title="Let visitors explore your production flow before they ever step on site."
        description="This tour page combines a clickable factory map with a model-ready viewer, giving your team something useful to publish now while the full 3D walkthrough is being finalized."
        actions={
          <>
            <a href="#tour-map" className="primary-button">
              Explore the Tour
            </a>
            <Link to="/contact" className="secondary-button">
              Book a Visit
            </Link>
          </>
        }
      />

      <MetricStrip
        metrics={[
          { label: "Tour Stops", value: String(factoryTourStops.length).padStart(2, "0") },
          { label: "Visitor Modes", value: "3" },
          { label: "Viewer Support", value: "GLB + Embed" },
          { label: "Device Ready", value: "Desktop + Mobile" },
        ]}
      />

      <section id="tour-map" className="section-shell scroll-mt-32">
        <SectionHeading
          eyebrow="Tour Builder"
          title="A guided map that works now and scales into the full 3D experience"
          description="Each stop below tells part of the factory story. When the 3D model is ready, the same tour structure can power camera jumps, hotspots, and guided walkthroughs."
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
          <FactoryFloorMap
            activeStopId={activeStop.id}
            onSelectStop={setActiveStopId}
          />

          <div className="space-y-6">
            <article className="surface-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="chip">Stop {String(activeStopNumber).padStart(2, "0")}</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">
                    {activeStop.title}
                  </h2>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">
                    {activeStop.zone}
                  </p>
                </div>
                <div className="rounded-2xl border border-accentSoft/25 bg-accent/20 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                    Recommended stop length
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {activeStop.duration}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
                {activeStop.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-accentSoft/20 bg-black/35 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accentSoft">
                    Visitor Focus
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">
                    {activeStop.visitorFocus}
                  </p>
                </div>
                <div className="rounded-2xl border border-accentSoft/20 bg-black/35 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accentSoft">
                    Talking Points
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeStop.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-accentSoft/25 bg-accent/15 px-3 py-1 text-xs font-semibold text-slate-100"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="surface-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="chip">All Stops</p>
                  <h2 className="mt-4 text-2xl font-semibold text-white">
                    Jump directly to any area
                  </h2>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-slate-300">
                  Keep the sequence or let visitors branch out depending on what
                  they want to see.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {factoryTourStops.map((stop, index) => {
                  const isActive = stop.id === activeStop.id;

                  return (
                    <button
                      key={stop.id}
                      type="button"
                      className={`rounded-[1.4rem] border p-4 text-left transition ${
                        isActive
                          ? "border-accentSoft bg-accent/25 shadow-glow"
                          : "border-accentSoft/20 bg-black/30 hover:border-accentSoft/55 hover:bg-accent/10"
                      }`}
                      onClick={() => setActiveStopId(stop.id)}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accentSoft">
                            Stop {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-white">
                            {stop.title}
                          </h3>
                        </div>
                        <span className="rounded-full border border-accentSoft/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                          {stop.zone}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="3D Ready"
          title="The factory map and the 3D walkthrough can live side by side"
          description="This section is prepared for the published virtual model, but it still serves visitors even while the artist is finishing the scene."
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <ViewerPanel />

          <div className="space-y-6">
            <article className="surface-card">
              <p className="chip">Experience Modes</p>
              <div className="mt-6 grid gap-4">
                {factoryTourModes.map((mode) => (
                  <div
                    key={mode.title}
                    className="rounded-2xl border border-accentSoft/20 bg-black/35 p-4"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {mode.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {mode.description}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-card">
              <p className="chip">Delivery Checklist</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                What to ask your 3D artist for
              </h2>
              <div className="mt-6 grid gap-3">
                {factoryTourViewerChecklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-accentSoft/20 bg-black/35 p-4"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-accentSoft/30 bg-accent/20 text-xs font-semibold text-accentSoft">
                      +
                    </span>
                    <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <CTASection
        title="Want us to turn the finished model into a full web walkthrough?"
        description="We can connect the artist's deliverable to guided hotspots, calls to action, and a polished public-facing visitor experience."
        primaryLabel="Talk About the Tour"
        primaryTo="/contact"
        secondaryLabel="See Other Projects"
        secondaryTo="/portfolio"
      />
    </>
  );
}
