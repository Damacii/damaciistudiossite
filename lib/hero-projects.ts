import initialProjects from "@/data/hero-projects.json";

export type HeroProject = {
  id: string;
  name: string;
  titleLines: string[];
  category: string;
  description: string;
  imageUrl: string;
};

export const defaultHeroProjects: HeroProject[] = initialProjects.map(project => ({ ...project }));

function isAllowedImageUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/assets/images/") && !value.split("/").includes("..")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function parseHeroProjects(value: unknown): HeroProject[] {
  if (!Array.isArray(value) || value.length < 2 || value.length > 3) throw new Error("Two or three hero projects are required.");
  return value.map((item, index) => {
    if (!item || typeof item !== "object") throw new Error(`Project ${index + 1} is invalid.`);
    const project = item as Record<string, unknown>;
    const id = `0${index + 1}`;
    const name = typeof project.name === "string" ? project.name.trim() : "";
    const category = typeof project.category === "string" ? project.category.trim() : "";
    const description = typeof project.description === "string" ? project.description.trim() : "";
    const imageUrl = typeof project.imageUrl === "string" ? project.imageUrl.trim() : "";
    const titleLines = Array.isArray(project.titleLines) ? project.titleLines.map(line => typeof line === "string" ? line.trim() : "") : [];
    if (!name || name.length > 45) throw new Error(`Project ${index + 1} needs a name of 45 characters or fewer.`);
    if (!category || category.length > 70) throw new Error(`Project ${index + 1} needs a category of 70 characters or fewer.`);
    if (!description || description.length > 260) throw new Error(`Project ${index + 1} needs a description of 260 characters or fewer.`);
    if (titleLines.length < 1 || titleLines.length > 3 || titleLines.some(line => !line || line.length > 24)) throw new Error(`Project ${index + 1} needs one to three title lines, each 24 characters or fewer.`);
    if (!isAllowedImageUrl(imageUrl)) throw new Error(`Project ${index + 1} needs an uploaded image or a path under /assets/images/.`);
    return { id, name, titleLines, category, description, imageUrl };
  });
}
