import type { Metadata } from "next";
import Link from "next/link";
import anexo from "@/content/anexo.json";
import { TextLink } from "@/components/TextLink";

type Part = { text: string; href: string | null };
type Block =
  | { type: "h2" | "h3" | "p"; parts: Part[] }
  | { type: "table"; rows: string[][] };

const blocks = anexo as Block[];

export const metadata: Metadata = {
  title: "Anexo · Pedidos de acceso a la información",
  description:
    "Cronología de los pedidos de acceso a la información pública y de las entrevistas a las autoridades de la Patagonia.",
};

function Rich({ parts }: { parts: Part[] }) {
  return parts.map((part, index) =>
    part.href ? (
      <TextLink key={index} href={part.href}>
        {part.text}
      </TextLink>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}

export default function AnexoPage() {
  return (
    <main className="bg-background text-foreground">
      <article className="mx-auto max-w-[800px] px-5 py-16 md:px-8 md:py-24">
        <p className="mb-10">
          <Link href="/">Volver a la investigación</Link>
        </p>
        {blocks.map((block, index) => {
          if (block.type === "h2") {
            return (
              <h1 key={index} className="type-h2">
                <Rich parts={block.parts} />
              </h1>
            );
          }
          if (block.type === "h3") {
            return (
              <h2 key={index} className="type-h3">
                <Rich parts={block.parts} />
              </h2>
            );
          }
          if (block.type === "table") {
            const [head, ...rows] = block.rows;
            return (
              <div key={index} className="my-8 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  {head ? (
                    <thead>
                      <tr>
                        {head.map((cell) => (
                          <th
                            key={cell}
                            className="border-b border-foreground/30 px-3 py-2 font-bold"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  ) : null}
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.join("|")}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${cell}-${cellIndex}`}
                            className="border-b border-foreground/15 px-3 py-2"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return (
            <p key={index} className="type-body mt-5">
              <Rich parts={block.parts} />
            </p>
          );
        })}
      </article>
    </main>
  );
}
