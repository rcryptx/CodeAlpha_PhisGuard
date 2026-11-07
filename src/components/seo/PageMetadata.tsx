import { useEffect } from "react";

type PageMetadataProps = {
  title: string;
  description: string;
  path: string;
};

function setMetaDescription(description: string) {
  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.append(meta);
  }
  meta.content = description;
}

export function PageMetadata({ title, description, path }: PageMetadataProps) {
  useEffect(() => {
    document.title = `${title} | PhisGuard`;
    setMetaDescription(description);

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }

    const canonicalPath = path.startsWith("/") ? path : `/${path}`;
    canonical.href = new URL(canonicalPath, window.location.origin).href;
  }, [description, path, title]);

  return null;
}
