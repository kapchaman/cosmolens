import { expect, test } from "vitest";
import { getAllObjects, getAllSources, getCosmicScale, getJourneys, getObjectById } from "@/lib/astronomy/catalog";
test('all scientific references and relationship targets resolve without duplicate IDs', () => {
 const objects = getAllObjects(), sources = getAllSources(), nodes = getCosmicScale(), journeys = getJourneys();
 for (const records of [objects,sources,nodes,journeys]) expect(new Set(records.map(r=>r.id)).size).toBe(records.length);
 const sourceIds = new Set(sources.map(s=>s.id)), objectIds = new Set(objects.map(o=>o.id));
 const validSources = (ids:string[]) => { expect(ids.length).toBeGreaterThan(0); for(const id of ids) expect(sourceIds.has(id),id).toBe(true); };
 for(const object of objects) {validSources(object.sourceIds); for(const m of object.measurements) validSources(m.sourceIds); for(const r of object.relationships) {expect(objectIds.has(r.targetId)).toBe(true); expect(r.targetId).not.toBe(object.id);} }
 for(const node of nodes) { for(const id of node.objectIds) expect(objectIds.has(id)).toBe(true); for(const m of node.measurements) validSources(m.sourceIds); expect(node.sizeDescription.length).toBeGreaterThan(15); expect(node.approximateSizeMeters).toBeGreaterThan(0); }
 for(const journey of journeys) { validSources(journey.sourceIds); for(const step of journey.steps) for(const id of step.objectIds) expect(objectIds.has(id)).toBe(true); }
});
test('scale references increase and match catalog equatorial diameters in metres',()=>{
 const nodes=getCosmicScale(); for(let i=1;i<nodes.length;i++) expect(nodes[i].approximateSizeMeters).toBeGreaterThan(nodes[i-1].approximateSizeMeters);
 for(const id of ['earth','moon','jupiter']) {const m=getObjectById(id)!.measurements.find(m=>m.label==='Equatorial diameter')!; expect(nodes.find(n=>n.id===`${id}-scale`)!.approximateSizeMeters).toBe(Number(m.value.replaceAll(',',''))*1000);}
});
test('model-dependent inferences retain uncertainty and explanatory notes',()=>{
 for(const [id,label] of [['enceladus','Ocean evidence'],['m87-star','Mass'],['cygnus-x-1','Black hole mass']]) {const m=getObjectById(id)!.measurements.find(m=>m.label===label)!;expect(m.confidence).toBe('modeled');expect(m.note!.length).toBeGreaterThan(20);}
 expect(getAllSources().find(s=>s.id==='nasa-bullet-cluster-webb')?.year).toBe(2025);
});
