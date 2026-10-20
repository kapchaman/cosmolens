import { notFound } from "next/navigation";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import { ObjectHero } from "@/components/object/ObjectHero";
import { MeasurementGrid } from "@/components/object/MeasurementGrid";
import { ObjectScaleContext } from "@/components/object/ObjectScaleContext";
import { ObjectScienceProfile } from "@/components/object/ObjectScienceProfile";
import { RelationshipList } from "@/components/object/RelationshipList";
import { SourceList } from "@/components/object/SourceList";
import {
  getAllObjects,
  getObjectById,
  getRelatedObjects,
  getSourcesForObject,
} from "@/lib/astronomy/catalog";

type ObjectPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export function generateStaticParams() {
  return getAllObjects().map((object) => ({ id: object.id }));
}

export async function generateMetadata({ params }: ObjectPageProps) {
  const { id } = await params;
  const object = getObjectById(id);

  return {
    title: object ? `${object.name} | CosmoLens` : "Object | CosmoLens",
    description: object?.summary,
  };
}

export default async function ObjectPage({ params }: ObjectPageProps) {
  const { id } = await params;
  const object = getObjectById(id);

  if (!object) {
    notFound();
  }

  const sources = getSourcesForObject(object);
  const relationships = getRelatedObjects(object);

  return (
    <>
      <ObjectHero object={object} />

      <section className="section pt-0">
        <div className="app-container grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-8">
            <div className="panel p-6">
              <div className="eyebrow">Overview</div>
              <p className="mt-4 text-lg text-[color:var(--muted)]">{object.description}</p>
            </div>

            <div>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <div className="eyebrow">Physical Properties</div>
                  <h2 className="mt-2 text-3xl font-semibold">Measurements</h2>
                </div>
              </div>
              <MeasurementGrid measurements={object.measurements} />
            </div>

            <div className="panel p-6">
              <div className="eyebrow">Scientific Significance</div>
              <p className="mt-4 text-lg text-[color:var(--muted)]">{object.scientificSignificance}</p>
            </div>

            <ObjectScienceProfile object={object} sourceCount={sources.length} />

            <ObjectScaleContext objectId={object.id} />

            {relationships.length ? (
              <div>
                <div className="mb-4">
                  <div className="eyebrow">Relationships</div>
                  <h2 className="mt-2 text-3xl font-semibold">You might also explore</h2>
                </div>
                <RelationshipList items={relationships} />
              </div>
            ) : null}
          </div>

          <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
            <AssistantPanel objectId={object.id} suggestedQuestion={`What should I notice about ${object.name}?`} />
            <div>
              <div className="mb-4">
                <div className="eyebrow">Sources</div>
                <h2 className="mt-2 text-2xl font-semibold">References</h2>
              </div>
              <SourceList sources={sources} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
