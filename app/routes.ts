import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("documents", "routes/documents.tsx"),
  route("providers", "routes/providers.tsx"),
  route("forms", "routes/forms.tsx"),
  route("directory", "routes/directory.tsx"),
  route("knowledge", "routes/knowledge.tsx"),
  route("knowledge/*", "routes/knowledge.$.tsx"),
] satisfies RouteConfig;
