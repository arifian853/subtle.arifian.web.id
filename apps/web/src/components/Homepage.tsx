import type { ReactNode } from "react";
import { moods, moodOrder } from "@subtle/catalog/tokens";

export function Botanical({
  caption = "A study in slower living",
}: {
  caption?: string;
}) {
  return (
    <figure className="botanical">
      <svg
        viewBox="0 0 480 420"
        role="img"
        aria-label="Abstract botanical study: rounded leaves arranged on a tonal canvas"
      >
        <path
          className="botanical-stem"
          d="M240 425C244 285 232 180 252 48M243 281L137 175M242 227L335 114M243 345L352 248"
        />
        <ellipse
          cx="187"
          cy="221"
          rx="39"
          ry="94"
          transform="rotate(-45 187 221)"
        />
        <ellipse
          cx="290"
          cy="163"
          rx="40"
          ry="90"
          transform="rotate(42 290 163)"
        />
        <ellipse
          cx="300"
          cy="295"
          rx="42"
          ry="92"
          transform="rotate(52 300 295)"
        />
        <ellipse
          cx="247"
          cy="88"
          rx="31"
          ry="68"
          transform="rotate(8 247 88)"
        />
        <ellipse
          cx="199"
          cy="332"
          rx="33"
          ry="73"
          transform="rotate(-44 199 332)"
        />
      </svg>
      <figcaption>
        {caption}
        <span>Original vector study</span>
      </figcaption>
    </figure>
  );
}

export function Chart({ compact = false }: { compact?: boolean }) {
  return (
    <figure className="chart">
      <svg
        viewBox="0 0 440 130"
        role="img"
        aria-label="Synthetic weekly activity: 18, 28, 24, 42, 37, 57, 68"
      >
        <path className="chart-grid" d="M0 20H440M0 65H440M0 110H440" />
        <path
          className="chart-fill"
          d="M0 110L70 88L140 98L210 52L280 65L350 29L440 8V130H0Z"
        />
        <path
          className="chart-line"
          d="M0 110L70 88L140 98L210 52L280 65L350 29L440 8"
        />
      </svg>
      {!compact && (
        <figcaption>
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          <span>Sun</span>
        </figcaption>
      )}
    </figure>
  );
}

export function MoodGallery() {
  return (
    <div className="mood-gallery">
      {moodOrder.map((id) => (
        <article key={id} data-mood={id} className="mood-mini">
          <div className="mini-top">
            <span className="mini-mark" aria-hidden="true">
              s
            </span>
            <span className="status">Available</span>
          </div>
          <h3>{moods[id].name}</h3>
          <p>{moods[id].description}</p>
          <div className="mini-controls">
            <a
              href={`/moods/#${id}`}
              aria-label={`Explore ${moods[id].name} mood`}
            >
              Explore
            </a>
            <span aria-hidden="true">↗</span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Homepage({
  hero,
  switcher,
  mosaic,
  modes,
  signatures,
  motion,
}: {
  hero?: ReactNode;
  switcher?: ReactNode;
  mosaic?: ReactNode;
  modes?: ReactNode;
  signatures?: ReactNode;
  motion?: ReactNode;
}) {
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="context-capsule">
            <span aria-hidden="true" />
            Soft Editorial Materialism
          </p>
          <h1 id="hero-title">
            Interfaces with
            <br />a softer side.
          </h1>
          <p className="lead">
            A little more room to breathe.
            <br />A considered design system for stories, tools,
            <br className="desktop-break" /> and everything in between.
          </p>
          <div className="actions">
            <a className="button primary" href="/components/">
              Explore the system <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#moods">
              Find your mood <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero-note">One visual grammar. Eight ways to feel.</p>
        </div>
        <div className="hero-composition">
          <div className="hero-media">
            <div className="specimen-label">
              <span>Fieldnotes</span>
              <span>Vol. 08</span>
            </div>
            <h2>
              Room for
              <br />
              the everyday.
            </h2>
            <Botanical />
            <div className="media-caption">
              <span>Objects, ideas & slower living</span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
          <div className="hero-live">
            {hero ?? (
              <>
                <span className="status">In good shape</span>
                <h3>A considered workspace</h3>
                <p>Real controls, soft surfaces.</p>
              </>
            )}
          </div>
          <div className="hero-context">
            <span className="context-icon" aria-hidden="true">
              ✳
            </span>
            <span>
              Made to feel
              <br />
              <strong>like you.</strong>
            </span>
          </div>
        </div>
        <div className="hero-foot">
          <span>Designed by Arifian</span>
          <span>Editorial sensibility. Product precision.</span>
          <span className="mono">Subtle / v1.0</span>
        </div>
      </section>

      <section
        id="moods"
        className="mood-strip wrap"
        aria-labelledby="mood-title"
      >
        <div>
          <h2 id="mood-title">Change the atmosphere.</h2>
          <p>The same page, in your mood.</p>
        </div>
        {switcher ?? <p>Beige is the starting point.</p>}
      </section>

      <section
        id="principles"
        className="principles wrap"
        aria-labelledby="principles-title"
      >
        <div className="section-heading">
          <p className="kicker">The thinking behind the feeling</p>
          <h2 id="principles-title">
            Softness,
            <br />
            with intention.
          </h2>
        </div>
        <div className="principle-list">
          <article>
            <span className="principle-glyph" aria-hidden="true">
              ✳
            </span>
            <div>
              <h3>Quiet Expressiveness</h3>
              <p>
                A generous curve. A change in scale. Character comes from the
                details you choose to keep.
              </p>
            </div>
          </article>
          <article>
            <span className="principle-glyph type-glyph" aria-hidden="true">
              Aa
            </span>
            <div>
              <h3>Editorial Composition</h3>
              <p>
                Give the story space. Let typography lead, with surfaces only
                where they help.
              </p>
            </div>
          </article>
          <article>
            <span className="surface-glyph" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div>
              <h3>Tonal Materiality</h3>
              <p>
                Depth through tone. Surfaces settle into a clear hierarchy
                before a shadow is needed.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        id="mosaic"
        className="wrap section"
        aria-labelledby="mosaic-title"
      >
        <div className="section-head">
          <div>
            <p className="kicker">The signature composition</p>
            <h2 id="mosaic-title">
              A little structure.
              <br />A lot of possibility.
            </h2>
          </div>
          <p>
            Soft Mosaic brings different shapes, scales, and densities into one
            considered composition. Try the pieces.
          </p>
        </div>
        {mosaic ?? (
          <div className="mosaic">
            <div className="mosaic-story">
              <Botanical />
            </div>
            <div className="metric">
              <p>Weekly activity</p>
              <strong>68</strong>
              <Chart />
            </div>
          </div>
        )}
      </section>

      <section
        id="modes"
        className="mode-section"
        aria-labelledby="modes-title"
      >
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">Two contexts. Shared foundations.</p>
              <h2 id="modes-title">
                From the story
                <br />
                to the workspace.
              </h2>
            </div>
            <p>
              Open and expressive, or focused and compact. The same typography,
              shapes, and tokens adapt to the work.
            </p>
          </div>
          {modes ?? <p>Editorial / Product</p>}
        </div>
      </section>

      <section
        id="signatures"
        className="wrap section"
        aria-labelledby="signatures-title"
      >
        <div className="section-head">
          <div>
            <p className="kicker">Considered down to the control</p>
            <h2 id="signatures-title">
              Useful things.
              <br />
              With a point of view.
            </h2>
          </div>
          <a className="text-link" href="/components/">
            Meet the components <span aria-hidden="true">↗</span>
          </a>
        </div>
        {signatures ?? (
          <p>Soft Command Bar · Floating Inspector · Layered Sheet</p>
        )}
      </section>

      <section
        id="motion"
        className="wrap motion-section"
        aria-labelledby="motion-title"
      >
        <div>
          <p className="kicker">Softly responsive</p>
          <h2 id="motion-title">
            Movement
            <br />
            that makes sense.
          </h2>
          <p>
            A small shift to show what changed. A quiet transition to keep your
            place. Always at your pace.
          </p>
          <a className="text-link" href="/motion/">
            Explore motion <span aria-hidden="true">↗</span>
          </a>
        </div>
        {motion ?? (
          <div className="motion-art" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
      </section>

      <section
        id="gallery"
        className="wrap section"
        aria-labelledby="gallery-title"
      >
        <div className="section-head">
          <div>
            <p className="kicker">Eight moods. One Subtle.</p>
            <h2 id="gallery-title">Find a familiar feeling.</h2>
          </div>
          <p>
            Grounded Forest. Thoughtful Lavender. Nocturnal Sky Night. Each
            keeps the same grammar.
          </p>
        </div>
        <MoodGallery />
      </section>

      <section id="closing" className="wrap closing">
        <span className="closing-flower" aria-hidden="true">
          ✳
        </span>
        <h2>
          Soft enough for stories.
          <br />
          Rigorous enough
          <br />
          for software.
        </h2>
        <a href="/foundations/" className="button primary">
          Start with the foundations <span aria-hidden="true">↗</span>
        </a>
      </section>
    </>
  );
}
