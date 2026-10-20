import Link from "next/link";
import { MoveUpRight, Ruler } from "lucide-react";
import { getCosmicScale } from "@/lib/astronomy/catalog";

export function ObjectScaleContext({ objectId }: { objectId: string }) {
  const scaleNodes = getCosmicScale().filter((node) => node.objectIds.includes(objectId));

  if (!scaleNodes.length) {
    return null;
  }

  return (
    <div className="panel p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Cosmic Scale</div>
          <h2 className="mt-2 text-2xl font-semibold">Where it appears</h2>
        </div>
        <Ruler aria-hidden="true" size={18} color="var(--accent)" />
      </div>
      <div className="grid gap-3">
        {scaleNodes.map((node) => (
          <Link
            key={node.id}
            href={`/?scale=${encodeURIComponent(node.id)}#cosmic-scale`}
            className="quiet-panel flex items-start justify-between gap-4 p-4 hover:border-[color:var(--border-strong)]"
          >
            <span>
              <span className="tiny-label">{node.visualMode.replaceAll("-", " ")}</span>
              <span className="mt-1 block font-semibold">{node.title}</span>
              <span className="mt-1 block text-sm text-[color:var(--muted)]">{node.context}</span>
            </span>
            <MoveUpRight aria-hidden="true" className="mt-1 shrink-0" size={16} color="var(--muted)" />
          </Link>
        ))}
      </div>
    </div>
  );
}
