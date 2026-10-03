"use client";

import { useEffect, useState, type FormEvent } from "react";
import { defaultHeroProjects, type HeroProject } from "@/lib/hero-projects";

type Session = { authenticated: boolean; configured: boolean; storageMode: "local" | "blob" | "unconfigured" };

export function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<HeroProject[]>(defaultHeroProjects);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  async function loadProjects() {
    const response = await fetch("/api/hero-projects", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load projects.");
    setProjects(data.projects);
    setDirty(false);
  }

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then(response => response.json())
      .then(async (data: Session) => { if (!mounted) return; setSession(data); if (data.authenticated) await loadProjects(); })
      .catch(() => { if (mounted) setMessage("Could not connect to the admin server."); });
    return () => { mounted = false; };
  }, []);

  function edit(index: number, change: Partial<HeroProject>) {
    setProjects(current => current.map((project, i) => i === index ? { ...project, ...change } : project));
    setDirty(true);
    setMessage("");
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      setPassword("");
      setSession(current => current ? { ...current, authenticated: true } : null);
      await loadProjects();
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSession(current => current ? { ...current, authenticated: false } : null);
    setMessage("");
  }

  async function upload(index: number, file?: File) {
    if (!file) return;
    setUploading(projects[index].id); setMessage("");
    try {
      const form = new FormData(); form.append("image", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not upload image.");
      edit(index, { imageUrl: data.imageUrl });
      setMessage("Image uploaded. Save changes to make it live.");
    } catch (error) { setMessage((error as Error).message); }
    finally { setUploading(null); }
  }

  async function save() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/hero-projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projects }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save changes.");
      setProjects(data.projects);
      setDirty(false);
      setMessage("Saved. Reload the homepage to see your changes.");
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }

  return <main className="admin-shell">
    <header className="admin-header"><a className="admin-brand" href="/" aria-label="Damacii Studios home"><img src="/assets/logos/damacii-white-orange.png" width="799" height="157" alt="Damacii Studios" /><small>STUDIO ADMIN</small></a><div className="admin-header-actions"><a href="/" target="_blank" rel="noreferrer">View site ↗</a>{session?.authenticated && <button type="button" onClick={signOut}>Sign out</button>}</div></header>
    {!session ? <div className="admin-state">Loading admin…</div> : !session.configured ? <div className="admin-login"><p className="admin-eyebrow">SETUP REQUIRED</p><h1>Admin access<br />isn’t configured.</h1><p>Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET to your environment, then restart the server.</p></div> : !session.authenticated ? <div className="admin-login"><p className="admin-eyebrow">PRIVATE ACCESS / DAMACII</p><h1>Make the<br /><em>first impression.</em></h1><p>Sign in to edit the homepage hero projects.</p><form onSubmit={signIn}><label htmlFor="admin-password">ADMIN PASSWORD</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /><button type="submit" disabled={busy}>{busy ? "Signing in…" : "Enter studio →"}</button></form>{message && <p className="admin-message" role="status">{message}</p>}</div> : <div className="admin-content">
      <div className="admin-heading"><div><p className="admin-eyebrow">HOMEPAGE / HERO PROJECTS</p><h1>Shape the<br /><em>first impression.</em></h1><p>Edit the cards visitors hover over to change the hero. Images and text appear together.</p></div><div className="admin-heading-side"><span>{String(projects.length).padStart(2, "0")} PROJECTS</span><span>{session.storageMode === "blob" ? "CLOUD STORAGE" : session.storageMode === "local" ? "LOCAL STORAGE" : "STORAGE NOT CONNECTED"}</span></div></div>
      {session.storageMode === "unconfigured" && <p className="admin-alert">Connect a Vercel Blob store and set BLOB_READ_WRITE_TOKEN to enable uploads and saving on Vercel.</p>}
      <div className="admin-projects">{projects.map((project, index) => <section className="admin-card" key={project.id}><div className="admin-card-head"><span>0{index + 1} / HERO PROJECT</span><strong>{project.name || `PROJECT 0${index + 1}`}</strong></div><div className="admin-card-grid"><div className="admin-image-area"><div className="admin-image-preview">{project.imageUrl ? <img src={project.imageUrl} alt={`Preview for ${project.name}`} /> : <span>IMAGE PREVIEW<br />0{index + 1}</span>}</div><label className="admin-upload">{uploading === project.id ? "Uploading…" : "Upload image ↗"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={!!uploading || busy} onChange={event => { void upload(index, event.target.files?.[0]); event.target.value = ""; }} /></label><small>JPG, PNG, WebP, or AVIF · up to 4 MB</small></div><div className="admin-fields"><label>Project name <input type="text" maxLength={45} value={project.name} onChange={event => edit(index, { name: event.target.value })} placeholder="e.g. ATELIER NORTH" /></label><label>Hero title <span>One line per row, up to three</span><textarea rows={3} value={project.titleLines.join("\n")} onChange={event => edit(index, { titleLines: event.target.value.split("\n") })} placeholder="ATELIER\nNORTH." /></label><label>Category <input type="text" maxLength={70} value={project.category} onChange={event => edit(index, { category: event.target.value })} placeholder="WEB DESIGN + DEVELOPMENT" /></label><label>Description <textarea rows={3} maxLength={260} value={project.description} onChange={event => edit(index, { description: event.target.value })} placeholder="A short project description." /></label><label>Image path or URL <span>Optional if you uploaded an image</span><input type="text" value={project.imageUrl} onChange={event => edit(index, { imageUrl: event.target.value })} placeholder="/assets/images/hero/example.jpg" /></label></div></div></section>)}</div>
      <div className="admin-savebar"><p>{message || (dirty ? "You have unsaved changes." : "All changes saved.")}</p><button type="button" onClick={save} disabled={busy || !!uploading || !dirty || session.storageMode === "unconfigured"}>{busy ? "Saving…" : "Save changes ↗"}</button></div>
    </div>}
  </main>;
}
