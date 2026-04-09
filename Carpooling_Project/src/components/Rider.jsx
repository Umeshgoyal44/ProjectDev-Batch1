import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Check,
  CircleDot,
  Leaf,
  Lock,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Star,
  BriefcaseBusiness,
  VolumeX,
  Loader2,
} from 'lucide-react';

const sidebarItems = [
  { label: 'Find a Ride', to: '/rider', active: true },
  { label: 'Offer a Ride', to: '/driver', active: false },
  { label: 'My Trips', to: '/', active: false },
  { label: 'Messages', to: '/', active: false },
];

const tripFacts = [
  { label: 'Route', value: 'Express lane', icon: MapPinned },
  { label: 'Luggage', value: 'Small bag', icon: BriefcaseBusiness },
  { label: 'Rules', value: 'No smoking', icon: VolumeX },
];

function Rider() {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null') || { id: null, name: 'Guest' };

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/rides/search');
      if (!res.ok) throw new Error('Failed to fetch rides');
      const data = await res.json();
      setRides(data);
      if (data.length > 0) setSelectedRide(data[0]);

      // Fetch user's existing ride request statuses
      if (user.id) {
        const reqRes = await fetch(`/api/rider/requests?riderId=${user.id}`);
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          const statuses = {};
          reqData.forEach(r => {
            if (r.rideId) statuses[r.rideId._id] = r.status;
          });
          setRequestStatus(statuses);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!selectedRide || !user.id) {
      alert('Please login first to send a ride request.');
      return;
    }
    setSendingRequest(true);
    try {
      const res = await fetch('/rides/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: selectedRide._id, riderId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequestStatus({ ...requestStatus, [selectedRide._id]: 'pending' });
      } else {
        alert(data.message || 'Could not send request');
      }
    } catch (err) {
      alert('Network error sending request');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3fb] px-3 py-4 text-slate-900 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white/65 shadow-[0_25px_80px_rgba(27,56,104,0.14)] backdrop-blur">
          <div className="flex min-h-screen flex-col lg:flex-row">
            <aside className="w-full border-b border-slate-200/70 bg-white/92 px-4 py-5 lg:min-h-screen lg:w-[255px] lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                  <p className="text-lg font-semibold italic text-slate-900">CommuteFlow</p>
                  <p className="text-xs text-slate-400">Rider dashboard</p>
                </div>
              </div>

              <div className="mt-8 rounded-[24px] bg-slate-950 px-4 py-4 text-white shadow-lg shadow-slate-900/15">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-emerald-400 font-semibold text-slate-950">
                    {user.name?.[0]?.toUpperCase() || 'R'}
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Welcome back</p>
                    <p className="font-semibold">Rider {user.name}</p>
                  </div>
                </div>
              </div>

              <nav className="mt-6 space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        item.active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.label === 'Find a Ride' ? <MapPinned className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 rounded-[22px] bg-gradient-to-r from-emerald-400 to-cyan-500 p-[1px]">
                <div className="rounded-[21px] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Eco impact</p>
                  <p className="mt-2 text-sm text-slate-600">12kg saved this week</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500" />
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1 px-4 py-5 sm:px-6 lg:px-7">
              <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <Link to="/rider" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-[10px]">Find a Ride</Link>
                  <Link to="/driver" className="font-medium text-slate-400 transition hover:text-slate-700">Offer a Ride</Link>
                  <Link to="/" className="font-medium text-slate-400 transition hover:text-slate-700">My Trips</Link>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                    <Bell className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-semibold text-slate-950">
                      {user.name?.[0]?.toUpperCase() || 'K'}
                    </div>
                  </div>
                </div>
              </header>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
                <section className="space-y-5">
                  {loading && (
                    <div className="flex items-center justify-center gap-2 p-10">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-slate-500">Fetching available rides...</span>
                    </div>
                  )}
                  {errorMsg && <p className="text-red-500 text-center mt-5">{errorMsg}</p>}
                  {!loading && !errorMsg && rides.length === 0 && (
                     <div className="text-center p-10 bg-white rounded-[30px] shadow-sm ring-1 ring-slate-100">
                       <MapPinned className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                       <p className="text-xl font-semibold text-slate-700">No Ride Found</p>
                       <p className="text-sm text-slate-500 mt-2">No rides are available right now. Ask a driver to publish one!</p>
                     </div>
                  )}
                  {!loading && rides.map((ride) => (
                      <div 
                        key={ride._id}
                        onClick={() => setSelectedRide(ride)}
                        className={`cursor-pointer rounded-[30px] bg-white p-4 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ${selectedRide?._id === ride._id ? 'ring-blue-500 ring-2' : 'ring-slate-100'} transition transform hover:-translate-y-1`}
                      >
                        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50 p-6">
                          <div className="absolute inset-0 opacity-50">
                            <div className="h-full w-full bg-[linear-gradient(90deg,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.15)_1px,transparent_1px)] bg-[size:42px_42px]" />
                          </div>
                          <div className="relative h-[120px] rounded-[22px] border border-white/70 bg-white/40 flex flex-col justify-between p-4">
                             <div className="text-emerald-700 font-semibold text-sm">Pickup: {ride.from}</div>
                             <div className="flex items-center justify-between">
                               <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-600/30">
                                <Leaf className="h-4 w-4" />
                                 Seats left: {ride.seats}
                              </div>
                               <div className="text-blue-700 font-semibold text-sm">Drop: {ride.to}</div>
                             </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                          <div>
                            <p className="text-2xl font-semibold text-slate-900">{ride.from} → {ride.to}</p>
                            <p className="mt-2 text-sm text-slate-500">{ride.time} • Driver: {ride.driverName || 'Unknown'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Seats</p>
                            <p className="text-3xl font-semibold text-blue-700">{ride.seats}</p>
                          </div>
                        </div>

                        {selectedRide?._id === ride._id && (
                          <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {tripFacts.map(({ label, value, icon: Icon }) => (
                              <div key={label} className="rounded-[22px] bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-100">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                                <p className="mt-1 font-medium text-slate-800">{value}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                  ))}
                </section>

                <aside className="space-y-5">
                  {selectedRide ? (
                    <>
                      <div className="rounded-[28px] bg-white p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-slate-100">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-orange-400 to-cyan-500 text-xl font-semibold text-white">
                              {selectedRide.driverName ? selectedRide.driverName[0].toUpperCase() : 'D'}
                            </div>
                            <div>
                               <h2 className="text-xl font-semibold text-slate-900">{selectedRide.driverName || 'Driver'}</h2>
                              <p className="text-sm text-slate-500">Commuter</p>
                              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                                  <Check className="h-3.5 w-3.5" />
                                  90%
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  4.9
                                </span>
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        </div>
                        <div className="mt-5 rounded-[22px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                           <div className="flex items-start gap-3">
                             <Lock className="mt-0.5 h-4 w-4 text-slate-400" />
                            <p>Privacy guaranteed. Driver contact info is hidden until your request is confirmed.</p>
                          </div>
                         </div>
                      </div>

                      <div className="rounded-[28px] bg-[#e9eff8] p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-white/70">
                         <h3 className="text-lg font-semibold text-slate-900">Request to Join Pool</h3>
                        <p className="mt-1 text-sm text-slate-500">Send a request to secure your seat on this ride.</p>

                        {!requestStatus[selectedRide._id] ? (
                          <button 
                            onClick={handleRequest}
                            disabled={sendingRequest}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 disabled:opacity-50"
                          >
                            {sendingRequest ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                            ) : (
                              <><MessageSquareText className="h-4 w-4" /> Send Join Request</>
                            )}
                          </button>
                        ) : requestStatus[selectedRide._id] === 'pending' ? (
                          <div className="mt-5 text-center p-3 rounded-2xl bg-amber-100 text-amber-700 font-medium">
                            ⏳ Request Pending — Waiting for driver response...
                          </div>
                        ) : requestStatus[selectedRide._id] === 'accepted' ? (
                          <div className="mt-5 text-center p-3 rounded-2xl bg-emerald-100 text-emerald-700 font-medium">
                            ✅ Request Accepted! Booking confirmed.
                          </div>
                        ) : (
                          <div className="mt-5 text-center p-3 rounded-2xl bg-red-100 text-red-700 font-medium">
                            ❌ Request Rejected by driver.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-10 opacity-50">
                       <MapPinned className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                       <p>Select a ride to view details and request a seat.</p>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rider;
