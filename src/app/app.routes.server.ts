import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: "",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "status/:slug",
    renderMode: RenderMode.Client,
  },
  {
    path: "**",
    renderMode: RenderMode.Client,
  },
];
