import type { Metadata } from "next";
import { MyCosmosPanel } from "@/components/my-cosmos/MyCosmosPanel";

export const metadata: Metadata = {
  title: "My Cosmos | CosmoLens",
  description: "A private local space for saved astronomical objects and exploration notes.",
};

export default function MyCosmosPage() {
  return (
    <section className="section">
      <div className="app-container">
        <div className="mb-8 max-w-4xl">
          <div className="eyebrow">My Cosmos</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">Personal exploration journal</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)]">
            Saved objects, unresolved questions, and notes from this device.
          </p>
        </div>
        <MyCosmosPanel />
      </div>
    </section>
  );
}
