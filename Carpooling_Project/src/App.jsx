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

  const mockRideWithDetails = rides.map((ride) => ({
    ...ride,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    reviews: Math.floor(50 + Math.random() * 200),
    distance: Math.floor(1 + Math.random() * 15) + ' min away',
    carDetails: 'Demo Vehicle • Color',
  }))

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>CommuteFlow</h2>
        </div>

        <div className="sidebar-tabs">
          <button className="tab active">Find a Ride</button>
          <button className="tab">Offer a Ride</button>
        </div>

        <nav className="sidebar-menu">
          <a href="#" className="menu-item active">🚗 Find a Ride</a>
          <a href="#" className="menu-item">📍 Offer a Ride</a>
          <a href="#" className="menu-item">📋 My Trips</a>
          <a href="#" className="menu-item">💬 Messages</a>
        </nav>

        <div className="sidebar-stats">
          <div className="stat-badge">
            <span className="badge-label">Eco-Impact: 12kg</span>
            <span className="badge-value">saved</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>The smarter way<br />to move together.</h1>
            <p>Join verified commuters and reduce your carbon footprint while cutting travel costs. Your premium transit concierge.</p>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">🚐</div>
          </div>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-input-group">
                <label>📍 Pickup point</label>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>
              <div className="search-input-group">
                <label>📍 Where to?</label>
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="search-input-group">
                <label>📅 Today</label>
                <input type="date" />
              </div>
              <button type="submit" className="search-button">Search</button>
            </div>
          </form>

          {/* Filters */}
          <div className="filters">
            <button className="filter-btn">🔎 Filters</button>
            <button className="filter-btn">Gender</button>
            <button className="filter-btn">Timing ℹ️</button>
            <button className="filter-btn">Proximity</button>
            <button className="filter-btn eco">🌱 Eco-Friendly</button>
          </div>
        </section>

        {/* Content Layout */}
        <div className="content-layout">
          {/* Left Sidebar - Route Insight */}
          <aside className="left-sidebar">
            <div className="route-card">
              <h3>Live Route Insight</h3>
              <div className="map-placeholder">
                <div className="map-icon">🗺️</div>
              </div>
              <div className="drivers-info">
                <p className="drivers-count">Active Drivers <span className="count">12 Nearby</span></p>
                <p className="carbon-saved">Est. Carbon<br /><span className="value">4.2kg</span> Today</p>
              </div>
            </div>
          </aside>

          {/* Rides List */}
          <section className="rides-section">
            {loading && <p className="loading">Loading rides...</p>}

            {!loading && mockRideWithDetails.length === 0 && (
              <p className="no-rides">No rides available. Use POST /addRide to add rides.</p>
            )}

            <div className="rides-container">
              {mockRideWithDetails.map((ride) => (
                <article key={ride._id} className="ride-card">
                  <div className="ride-header">
                    <div className="driver-avatar">👤</div>
                    <div className="driver-info">
                      <h3>{ride.driverName}</h3>
                      <p>{ride.carDetails}</p>
                    </div>
                    <div className="ride-time">
                      <p className="time-badge">{ride.time}</p>
                      <p className="seats-badge">{ride.seats} Seats Available</p>
                    </div>
                  </div>

                  <div className="ride-body">
                    <p className="route">
                      <strong>{ride.from}</strong> → <strong>{ride.to}</strong>
                    </p>
                  </div>

                  <div className="ride-footer">
                    <div className="rating">
                      <span className="stars">⭐ {ride.rating}</span>
                      <span className="reviews">({ride.reviews})</span>
                      <span className="distance">• {ride.distance}</span>
                    </div>
                    <button type="button" className="book-btn">Book Seat</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
