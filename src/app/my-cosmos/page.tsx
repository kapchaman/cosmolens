import type { Metadata } from "next";
import { MyCosmosPanel } from "@/components/my-cosmos/MyCosmosPanel";

export const metadata: Metadata = {
  title: "My Cosmos | CosmoLens",
  description: "A private local space for saved astronomical objects and exploration notes.",
};

export default function MyCosmosPage() {
  return (
    <section className="workspace-section">
      <div className="obs-container">
        <div className="workspace-heading">
          <div className="eyebrow">My Cosmos</div>
          <h1>Your corner of the cosmos.</h1>
          <p>
            Saved objects, unresolved questions, and notes from this device.
          </p>
        </div>
        <MyCosmosPanel />
      </div>
    </section>
  );
}
