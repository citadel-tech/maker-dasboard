import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("maker", "routes/maker.tsx"),
  route("settings", "routes/settings.tsx"),
  route("makerDetails/:makerId", "routes/makerDetails.tsx"),
  route('addMaker', 'routes/addMaker.tsx'),
] satisfies RouteConfig