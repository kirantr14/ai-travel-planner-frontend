import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="text-5xl font-bold mb-4">
        AI Travel Planner
      </h1>

      <p className="text-gray-600 mb-8 text-center">
        Generate personalized travel itineraries,
        budget estimates, and hotel recommendations using AI.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="bg-gray-700 text-white px-6 py-3 rounded-lg"
        >
          Register
        </Link>
      </div>
    </div>
  )
}