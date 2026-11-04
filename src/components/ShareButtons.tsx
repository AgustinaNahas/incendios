"use client";

import { useEffect, useState } from "react";

const TITLE =
  "Bosques Patagónicos · Incendios sin prevención ni presupuesto claro";
const TEXT =
  "Incendios sin prevención ni presupuesto claro y la emergencia como único plan";

type Network = "facebook" | "x" | "whatsapp" | "email" | "linkedin";

const NETWORKS: { id: Network; label: string }[] = [
  { id: "facebook", label: "Compartir en Facebook" },
  { id: "x", label: "Compartir en X" },
  { id: "whatsapp", label: "Compartir en WhatsApp" },
  { id: "email", label: "Compartir por correo" },
  { id: "linkedin", label: "Compartir en LinkedIn" },
];

/** Bootstrap Icons (MIT) — viewBox 0 0 16 16 */
const PATHS: Record<Network, string> = {
  facebook:
    "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951",
  x: "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z",
  whatsapp:
    "M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232",
  email:
    "M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z",
  linkedin:
    "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
};

function shareHref(network: Network, url: string) {
  const encodedUrl = encodeURIComponent(url);
  const blurb = `${TITLE}. ${TEXT}`;

  switch (network) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(blurb)}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${blurb} ${url}`)}`;
    case "email":
      return `mailto:?subject=${encodeURIComponent(TITLE)}&body=${encodeURIComponent(`${TEXT}\n\n${url}`)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }
}

function Icon({ id }: { id: Network }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-[17px]"
      aria-hidden
      fill="currentColor"
    >
      <path d={PATHS[id]} />
    </svg>
  );
}

export function ShareButtons() {
  const [pageUrl, setPageUrl] = useState<string | null>(null);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  return (
    <nav
      aria-label="Compartir"
      className="mt-6 flex items-center justify-center gap-3"
    >
      {NETWORKS.map((network) => {
        const href = pageUrl ? shareHref(network.id, pageUrl) : undefined;
        const external = network.id !== "email";

        return (
          <a
            key={network.id}
            href={href ?? "#compartir"}
            aria-label={network.label}
            {...(external && href
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            onClick={(event) => {
              if (href) return;
              event.preventDefault();
              const next = shareHref(network.id, window.location.href);
              if (network.id === "email") {
                window.location.href = next;
                return;
              }
              window.open(next, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex size-10 items-center justify-center rounded-full border-[1.5px] border-foreground text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <Icon id={network.id} />
          </a>
        );
      })}
    </nav>
  );
}
