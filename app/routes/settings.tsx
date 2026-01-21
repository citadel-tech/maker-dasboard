import type { Route } from "./+types/settings"
import Nav from "../components/Nav"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - Coinswap" },
    { name: "description", content: "Settings for your maker" },
  ]
}

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Nav />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
      
      </main>
    </div>
  )
}