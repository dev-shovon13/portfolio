import { fullstack } from "@/content/profile";
import { SectionHead } from "@/components/ledger/SectionHead";
import { ArrowUpRight } from "@/components/icons";

const repoName = (url: string) => url.split("/").pop();

function Links({ p }: { p: (typeof fullstack)[number] }) {
  const links = [
    p.live && { label: "Live", href: p.live, primary: true },
    { label: "Client", href: p.client },
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
      {!p.server ? <span className="text-ink-3">Server repo private</span> : null}
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
        persisted in MongoDB, with Firebase handling sign-in. Below is each project&apos;s REST API surface.
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
              <p className="mt-3 max-w-[48ch] text-ink-2" data-line>
                {p.what}
              </p>
              <p className="fig mt-5 text-[11px] leading-relaxed text-ink-3" data-line>
                {p.stack.join(" · ")}
              </p>
              <div className="mt-6" data-line>
                <Links p={p} />
              </div>
            </div>

            <figure className="border border-rule bg-paper-2 lg:col-span-7" data-ledger>
              <figcaption className="fig flex justify-between gap-4 border-b border-rule px-4 py-2.5 text-[11px] text-ink-2">
                <span>{repoName(p.server!)} · Express</span>
                <span className="text-ink-3">{p.api!.length} routes</span>
              </figcaption>
              <ol className="fig px-4 py-2 text-[12px]">
                {p.api!.map((e) => (
                  <li
                    key={`${e.method} ${e.path}`}
                    className="grid grid-cols-[4.25rem_1fr] border-b border-rule py-2 last:border-0"
                    data-line
                  >
                    <span className={e.method === "GET" ? "text-ink-3" : "text-ink"}>{e.method}</span>
                    <span className="truncate text-ink-2" data-scramble>
                      {e.path}
                    </span>
                  </li>
                ))}
              </ol>
            </figure>
          </article>
        ))}

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
