import { fullstack, type Endpoint } from "@/content/profile";
import { SectionHead } from "@/components/ledger/SectionHead";
import { ArrowUpRight } from "@/components/icons";
import { Disclosure } from "@/components/Disclosure";

const repoName = (url: string) => url.split("/").pop();

type Project = (typeof fullstack)[number];

/** Long route lists collapse to one row per resource; the full list sits behind a toggle. */
const GROUP_AFTER = 12;
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

function RouteRow({ e }: { e: Endpoint }) {
  return (
    <>
      <span className={e.method === "GET" ? "text-ink-3" : "text-ink"}>{e.method}</span>
      <span className="truncate text-ink-2" data-scramble>
        {e.path}
      </span>
    </>
  );
}

function Api({ p }: { p: Project }) {
  const api = p.api!;
  const grouped = api.length > GROUP_AFTER;
  const groups = Map.groupBy(api, (e) => e.path.split("/")[1]);

  return (
    <figure className="border border-rule bg-paper-2" data-ledger>
      <figcaption className="fig flex justify-between gap-4 border-b border-rule px-4 py-2.5 text-[11px] text-ink-2">
        <span>{p.apiLabel ?? `${repoName(p.server!)} · Express`}</span>
        <span className="text-ink-3">
          {api.length} routes{grouped ? ` · ${groups.size} resources` : ""}
        </span>
      </figcaption>
      {grouped ? (
        <>
          <ol className="fig grid px-4 py-2 text-[12px] sm:grid-cols-2 sm:gap-x-8">
            {[...groups].map(([resource, list]) => (
              <li
                key={resource}
                className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-rule py-2"
                data-line
              >
                <span className="truncate text-ink-2" data-scramble>
                  /{resource}
                </span>
                <span className="text-[11px] text-ink-3">
                  {METHODS.filter((m) => list.some((e) => e.method === m)).join(" ")}
                  <span className="ml-2 text-ink">{list.length}</span>
                </span>
              </li>
            ))}
          </ol>
          <Disclosure className="group border-t border-rule">
            <summary className="fig cursor-pointer list-none px-4 py-2.5 text-[11px] text-ink-2 hover:text-accent pointer-coarse:min-h-10">
              <span className="group-open:hidden">Show all {api.length} routes</span>
              <span className="hidden group-open:inline">Hide routes</span>
            </summary>
            <ol
              className="fig max-h-80 overflow-y-auto overscroll-contain px-4 pb-2 text-[12px] [scrollbar-color:var(--color-rule-strong)_transparent] [scrollbar-width:thin]"
              tabIndex={0}
              aria-label={`All ${api.length} routes`}
              data-lenis-prevent
            >
              {api.map((e) => (
                <li key={`${e.method} ${e.path}`} className="grid grid-cols-[4.25rem_1fr] border-t border-rule py-2">
                  <RouteRow e={e} />
                </li>
              ))}
            </ol>
          </Disclosure>
        </>
      ) : (
        <ol className="fig px-4 py-2 text-[12px]">
          {api.map((e) => (
            <li
              key={`${e.method} ${e.path}`}
              className="grid grid-cols-[4.25rem_1fr] border-b border-rule py-2 last:border-0"
              data-line
            >
              <RouteRow e={e} />
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}

function Access({ p }: { p: Project }) {
  const { roles, note, areas } = p.access!;
  return (
    <figure className="border border-rule bg-paper-2" data-ledger>
      <figcaption className="fig flex justify-between gap-4 border-b border-rule px-4 py-2.5 text-[11px] text-ink-2">
        <span>Access by role</span>
        {note ? <span className="text-ink-3">{note}</span> : null}
      </figcaption>
      <table className="w-full text-left">
        <thead className="fig text-[10.5px] text-ink-3">
          <tr className="border-b border-rule">
            <th scope="col" className="px-4 py-2 font-normal">
              Area
            </th>
            {roles.map((r) => (
              <th key={r} scope="col" className="w-[3.25rem] px-1 py-2 text-center font-normal sm:w-[4.5rem]">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {areas.map((a) => (
            <tr key={a.area} className="border-b border-rule last:border-0" data-line>
              <th scope="row" className="px-4 py-3 align-top font-normal">
                <span className="block text-sm font-medium text-ink">{a.area}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-3">{a.pages}</span>
              </th>
              {roles.map((r) => {
                const ok = a.roles.includes(r);
                return (
                  <td key={r} className="px-1 py-3 text-center align-top">
                    <span aria-hidden className={ok ? "text-accent" : "text-ink-3"}>
                      {ok ? "●" : "–"}
                    </span>
                    <span className="sr-only">{ok ? "Yes" : "No"}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Links({ p }: { p: Project }) {
  const links = [
    p.live && { label: "Live", href: p.live, primary: true },
    p.client && { label: "Client", href: p.client },
    p.server && { label: "Server", href: p.server },
  ].filter(Boolean) as { label: string; href: string; primary?: boolean }[];

  return (
    <p className="fig flex flex-wrap gap-x-5 gap-y-2 text-[11px]">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
          className={`inline-flex items-center gap-1 hover:underline pointer-coarse:min-h-10 ${l.primary ? "text-accent" : "text-ink-2 hover:text-accent"}`}
        >
          {l.label} <ArrowUpRight size={12} />
          <span className="sr-only">: {p.name} (opens in new tab)</span>
        </a>
      ))}
      {p.client && !p.server ? <span className="text-ink-3">Server repo private</span> : null}
    </p>
  );
}

export function FullStack() {
  const withApi = fullstack.filter((p) => p.api);
  const rest = fullstack.filter((p) => !p.api);

  return (
    <section
      id="fullstack"
      aria-labelledby="fullstack-title"
      data-accent="mint"
      className="mx-auto max-w-[1320px] scroll-mt-0 lg:-scroll-mt-6 px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <SectionHead id="fullstack-title" title="Full stack" meta="Node.js · Express · MongoDB · personal projects" />

      <p className="max-w-[62ch] text-lg leading-relaxed text-ink-2" data-line>
        On my own projects I{" "}
        <span className="mark" data-mark>
          build both sides
        </span>
        : React clients talking to REST APIs I write in Node.js and Express,
        persisted in MongoDB, with Firebase handling sign-in. Newer work like Hajira pairs a Next.js client
        with its own versioned Express API. Below is each project&apos;s REST API surface.
      </p>

      <div className="mt-14 flex flex-col">
        {withApi.map((p) => (
          <article
            key={p.name}
            className="grid grid-cols-1 gap-8 border-t border-rule py-10 lg:grid-cols-12 lg:gap-10"
            data-ledger
          >
            <div className="lg:col-span-5">
              <h3 className="text-[clamp(1.5rem,2.4vw,1.9rem)] leading-tight font-semibold tracking-[-0.015em] text-ink" data-line>
                {p.name}
              </h3>
              {p.tag ? (
                <p className="fig mt-2 inline-block border border-accent px-2 py-0.5 text-[11px] text-accent" data-line>
                  {p.tag}
                </p>
              ) : null}
              <p className="mt-3 max-w-[48ch] text-ink-2" data-line>
                {p.what}
              </p>
              {p.highlights ? (
                <ul className="mt-5 flex max-w-[52ch] flex-col gap-2 text-sm leading-relaxed text-ink-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="grid grid-cols-[1rem_1fr]" data-line>
                      <span aria-hidden className="text-accent">+</span>
                      {h}
                    </li>
                  ))}
                </ul>
              ) : null}
              {p.backend ? (
                <dl className="fig mt-5 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5 text-[11px] leading-relaxed" data-line>
                  <dt className="text-ink-2">Front end</dt>
                  <dd className="text-ink-3">{p.stack.join(" · ")}</dd>
                  <dt className="text-ink-2">Back end</dt>
                  <dd className="text-ink-3">{p.backend.join(" · ")}</dd>
                </dl>
              ) : (
                <p className="fig mt-5 text-[11px] leading-relaxed text-ink-3" data-line>
                  {p.stack.join(" · ")}
                </p>
              )}
              <div className="mt-6" data-line>
                <Links p={p} />
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-7">
              {p.access ? <Access p={p} /> : null}
              <Api p={p} />
            </div>
          </article>
        ))}

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule pt-8 pb-4" data-line>
          <h3 className="text-sm font-semibold text-ink">Where it started</h3>
          <p className="fig text-[11px] text-ink-3">Personal projects from the very beginning of my career</p>
        </div>
        <ul className="border-t border-rule">
          {rest.map((p) => (
            <li
              key={p.name}
              className="grid gap-x-6 gap-y-2 border-b border-rule py-6 sm:grid-cols-[10rem_1fr] lg:grid-cols-[10rem_1fr_16rem] lg:items-baseline"
              data-line
            >
              <h3 className="font-semibold text-ink">{p.name}</h3>
              <div>
                <p className="text-sm leading-relaxed text-ink-2">{p.what}</p>
                <p className="fig mt-2 text-[11px] text-ink-3">{p.stack.join(" · ")}</p>
              </div>
              <div className="sm:col-start-2 lg:col-start-3 lg:justify-self-end">
                <Links p={p} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
