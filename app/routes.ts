import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("documents", "routes/documents.tsx"),
  route("providers", "routes/providers.tsx"),
  route("forms", "routes/forms.tsx"),
  route("reports", "routes/reports.tsx"),
] satisfies RouteConfig;
