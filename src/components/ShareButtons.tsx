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
  const common = {
    viewBox: "0 0 24 24",
    className: "size-[17px]",
    "aria-hidden": true as const,
  };

  switch (id) {
    case "facebook":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M14.2 8.6V6.9c0-.7.4-1.1 1.2-1.1h1.5V3.2c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.2v2.8h2.8V21h3.2v-9.2h2.6l.4-2.8h-3z"
          />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M14.6 10.4 20.7 3.5h-1.5l-5.3 5.7L9.4 3.5H4l6.4 8.7L4 20.5h1.5l5.6-6 4.5 6H20l-5.4-10.1zm-2 .2-.6-.9-5.2-6.9h2.2l4.2 5.6.6.9 5.5 7.3h-2.2l-4.5-6z"
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M12 3.4a8.5 8.5 0 0 0-7.3 12.8L3.6 20.6l4.5-1.2A8.5 8.5 0 1 0 12 3.4zm4.8 12c-.2.6-1.1 1.1-1.6 1.1-.4.1-.9.1-1.5-.1-.3-.1-.8-.3-1.4-.5-2.3-1-3.9-3.4-4-3.5-.1-.2-1-1.3-1-2.4s.6-1.7.8-1.9c.2-.2.5-.3.7-.3h.4c.2 0 .3 0 .5.4.2.5.6 1.6.7 1.7.1.1.1.3 0 .4l-.4.5c-.1.1-.2.2-.1.4.1.2.6.9 1.2 1.5.8.7 1.5 1 1.8 1.1.2.1.3.1.5-.1.1-.2.6-.7.7-.9.1-.2.3-.2.5-.1l1.5.7c.2.1.3.2.4.3.1.2.1.6-.1 1.1z"
          />
        </svg>
      );
    case "email":
      return (
        <svg {...common} fill="none">
          <rect
            x="3.2"
            y="5.2"
            width="17.6"
            height="13.6"
            rx="1.6"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M4 7.2 12 12.6 20 7.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M6.3 9.1H3.8V20h2.5V9.1zM5.05 3.8a1.55 1.55 0 1 0 .02 3.1 1.55 1.55 0 0 0-.02-3.1zM20.2 20h-2.5v-5.2c0-1.4-.5-2.4-1.8-2.4-1 0-1.5.6-1.8 1.3-.1.2-.1.5-.1.8V20H11.5V9.1h2.4v1.4c.3-.6 1.1-1.5 2.7-1.5 2 0 3.6 1.3 3.6 4.1V20z"
          />
        </svg>
      );
  }
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
            className="inline-flex size-10 items-center justify-center rounded-full border-[1.5px] border-[#f3efe8] text-[#f3efe8] transition-colors hover:bg-[#f3efe8] hover:text-[#2b2b2b]"
          >
            <Icon id={network.id} />
          </a>
        );
      })}
    </nav>
  );
}
