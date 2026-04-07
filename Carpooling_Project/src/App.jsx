import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRides() {
      try {
        const response = await fetch('/rides')
        if (!response.ok) {
          throw new Error('Failed to fetch rides')
        }
        const data = await response.json()
        setRides(data)
      } catch (error) {
        setRides([])
      } finally {
        setLoading(false)
      }
    }

    loadRides()
  }, [])

  function handleSearch(event) {
    event.preventDefault()
  }

  return (
    <main className="page">
      <h1>Find a Ride</h1>

      <form className="searchRow" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Pickup"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <section className="rideList">
        {loading && <p>Loading rides...</p>}

        {!loading && rides.length === 0 && (
          <p>No rides found yet. Add one using POST /addRide.</p>
        )}

        {rides.map((ride) => (
          <article key={ride._id} className="rideCard">
            <h3>{ride.driverName}</h3>
            <p>
              {ride.from} to {ride.to}
            </p>
            <p>Time: {ride.time}</p>
            <p>Seats available: {ride.seats}</p>
            <button type="button">Book</button>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
