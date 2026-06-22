'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import API_URL from '../services/api'

export default function Dashboard() {
const router = useRouter()

const [trips, setTrips] = useState([])
const [destination, setDestination] = useState('')
const [days, setDays] = useState('')
const [budgetType, setBudgetType] = useState('Medium')
const [interests, setInterests] = useState('')
const [loading, setLoading] = useState(false)

useEffect(() => {
const token = localStorage.getItem('token')


if (!token) {
  router.push('/login')
  return
}

fetchTrips()


}, [])

const fetchTrips = async () => {
try {
const token = localStorage.getItem('token')


  const response = await fetch(`${API_URL}/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  setTrips(data)
} catch (error) {
  console.log(error)
}


}

const createTrip = async () => {
if (!destination || !days || !interests) {
alert('Please fill all fields')
return
}

try {
  setLoading(true)

  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      destination,
      days: Number(days),
      budgetType,
      interests: interests.split(','),
    }),
  })

  if (response.ok) {
    alert('Trip created successfully')

    setDestination('')
    setDays('')
    setBudgetType('Medium')
    setInterests('')

    fetchTrips()
  }

  setLoading(false)
} catch (error) {
  console.log(error)
  setLoading(false)
}


}

const deleteTrip = async tripId => {
try {
const token = localStorage.getItem('token')


  const response = await fetch(
    `${API_URL}/trips/${tripId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (response.ok) {
    fetchTrips()
  }
} catch (error) {
  console.log(error)
}


}

const logout = () => {
localStorage.removeItem('token')
router.push('/login')
}

return ( <div className="min-h-screen bg-slate-100 p-6"> <div className="flex justify-between items-center mb-6"> <div> <h1 className="text-3xl font-bold">
AI Travel Planner </h1>


      <p className="text-gray-600">
        Plan and manage your trips with AI
      </p>
    </div>

    <button
      onClick={logout}
      className="bg-gray-700 text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  </div>

  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 className="text-xl font-bold mb-4">
      Create New Trip
    </h2>

    <input
      type="text"
      placeholder="Destination"
      value={destination}
      onChange={e => setDestination(e.target.value)}
      className="border p-3 rounded-lg w-full mb-3"
    />

    <input
      type="number"
      placeholder="Number of Days"
      value={days}
      onChange={e => setDays(e.target.value)}
      className="border p-3 rounded-lg w-full mb-3"
    />

    <select
      value={budgetType}
      onChange={e => setBudgetType(e.target.value)}
      className="border p-3 rounded-lg w-full mb-3"
    >
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>

    <input
      type="text"
      placeholder="Food, Adventure, Culture"
      value={interests}
      onChange={e => setInterests(e.target.value)}
      className="border p-3 rounded-lg w-full mb-4"
    />

    <button
      onClick={createTrip}
      disabled={loading}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg"
    >
      {loading ? 'Generating...' : 'Generate Trip'}
    </button>
  </div>

  {trips.map(trip => (
    <div
      key={trip._id}
      className="bg-white rounded-xl shadow-md p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold">
          {trip.destination}
        </h2>

        <button
          onClick={() => deleteTrip(trip._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>

      <p className="mb-1">
        <strong>Days:</strong> {trip.days}
      </p>

      <p className="mb-4">
        <strong>Budget:</strong> {trip.budgetType}
      </p>

      <h3 className="font-bold text-lg mb-2">
        Budget Estimate
      </h3>

      <p className="mb-4">
        Total: {trip.budgetEstimate?.total}
      </p>

      <h3 className="font-bold text-lg mb-2">
        Recommended Hotels
      </h3>

      <ul className="list-disc pl-5 mb-4">
        {Array.isArray(trip.hotels) &&
        trip.hotels.slice(0, 3).map((hotel, index) => (
          <li key={index}>
            {hotel.name}
          </li>
        ))}
      </ul>

      <h3 className="font-bold text-lg mb-2">
        Itinerary
      </h3>

      {Array.isArray(trip.itinerary) &&
        trip.itinerary.map(day => (
        <div key={day.day} className="mb-3">
          <p className="font-semibold">
            Day {day.day}
          </p>

          <ul className="list-disc pl-5">
            {Array.isArray(day.activities) &&
            day.activities.map((activity, index) => (
              <li key={index}>
                {activity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ))}
</div>


)
}
