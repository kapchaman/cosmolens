import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy and local data | CosmoLens", description: "How CosmoLens stores notes, loads external astronomy data and handles its disabled AI assistant." };
export default function PrivacyPage() {
  return <section className="section"><div className="app-container max-w-3xl">
    <div className="eyebrow">Your data</div><h1 className="mt-4 text-4xl font-semibold">Privacy and local data</h1>
    <div className="mt-8 space-y-8 text-[color:var(--muted)]">
      <section><h2 className="text-xl font-semibold text-[color:var(--foreground)]">Notes and saved objects</h2><p className="mt-3">My Cosmos stores your notes and saved objects in this browser on this device. They are not synced to an account or sent to a CosmoLens database. Clearing this site's browser data removes them. You can delete individual notes and unsave objects in My Cosmos. Keep a separate copy of anything important; private browsing, browser settings or storage limits can prevent saving.</p></section>
      <section><h2 className="text-xl font-semibold text-[color:var(--foreground)]">Astronomy data and external links</h2><p className="mt-3">CosmoLens requests NASA pictures and astronomy news through its server. Loading external images or following source and media links connects your browser to those providers, which can receive normal connection information such as your IP address. Their privacy policies apply to those requests.</p></section>
      <section><h2 className="text-xl font-semibold text-[color:var(--foreground)]">Observation Planner</h2><p className="mt-3">The planner uses the broad latitude band you select. It does not request your device's precise location.</p></section>
      <section><h2 className="text-xl font-semibold text-[color:var(--foreground)]">AI and analytics</h2><p className="mt-3">The AI assistant is currently disabled. Questions are not sent to OpenAI. This application does not include advertising or analytics trackers. Hosting services may process access logs to operate and protect the site.</p></section>
    </div>
  </div></section>;
}
