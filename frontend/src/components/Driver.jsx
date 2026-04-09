import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CarFront,
  Check,
  CheckCircle,
  CircleDot,
  Leaf,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Star,
  XCircle,
  Loader2,
} from 'lucide-react';

const sidebarItems = [
  { label: 'Find a Ride', to: '/rider', active: false },
  { label: 'Offer a Ride', to: '/driver', active: true },
  { label: 'My Trips', to: '/', active: false },
  { label: 'Messages', to: '/', active: false },
];

function Driver() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [rideForm, setRideForm] = useState({ from: '', to: '', time: '', seats: 3 });

  const user = JSON.parse(localStorage.getItem('user') || 'null') || { id: null, name: 'Krishna' };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/driver/requests?driverName=${encodeURIComponent(user.name)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setErrorMsg(err.message || 'Could not fetch ride requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      const res = await fetch(`/rides/request/${requestId}/${status}`, {
        method: 'POST',
      });
      if (res.ok) {
        setRequests(requests.map(r => r._id === requestId ? { ...r, status } : r));
      } else {
        const data = await res.json();
        alert(data.message || 'Error updating status');
      }
    } catch (err) {
      alert('Network error while updating status');
    }
  };

  const handlePublishRide = async (e) => {
    e.preventDefault();
    if (!rideForm.from || !rideForm.to || !rideForm.time) {
      alert('Please fill all fields');
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch('/addRide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverName: user.name,
          from: rideForm.from,
          to: rideForm.to,
          time: rideForm.time,
          seats: Number(rideForm.seats),
        }),
      });
      if (res.ok) {
        setRideForm({ from: '', to: '', time: '', seats: 3 });
        setShowForm(false);
        alert('Ride published successfully!');
      } else {
        alert('Failed to publish ride');
      }
    } catch (err) {
      alert('Network error publishing ride');
    } finally {
      setPublishing(false);
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
                  <p className="text-xs text-slate-400">Driver dashboard</p>
                </div>
              </div>

              <div className="mt-8 rounded-[24px] bg-slate-950 px-4 py-4 text-white shadow-lg shadow-slate-900/15">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 font-semibold text-slate-950">
                    {user.name?.[0]?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Welcome back</p>
                    <p className="font-semibold">Driver {user.name}</p>
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
                      {item.label === 'Offer a Ride' ? <CarFront className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
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
                  <Link to="/rider" className="font-medium text-slate-400 transition hover:text-slate-700">Find a Ride</Link>
                  <Link to="/driver" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-[10px]">Offer a Ride</Link>
                  <Link to="/" className="font-medium text-slate-400 transition hover:text-slate-700">My Trips</Link>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                    <Bell className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1 shadow-sm ring-1 ring-slate-200">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-semibold text-white">
                      {user.name?.[0]?.toUpperCase() || 'K'}
                    </div>
                  </div>
                </div>
              </header>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
                <section className="space-y-5">
                  <h2 className="text-xl font-semibold text-slate-900 border-b border-slate-200 pb-2">Rider Requests</h2>
                  
                  {loading && (
                    <div className="flex items-center justify-center gap-2 p-10">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-slate-500">Loading requests...</span>
                    </div>
                  )}
                  {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                  {!loading && !errorMsg && requests.length === 0 && (
                     <div className="text-center p-10 bg-white rounded-[30px] shadow-sm ring-1 ring-slate-100">
                       <CarFront className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                       <p className="text-xl font-semibold text-slate-700">No Requests Yet</p>
                       <p className="text-sm text-slate-500 mt-2">Publish a ride below to start getting requests from riders.</p>
                     </div>
                  )}

                  {!loading && requests.map(req => (
                     <div key={req._id} className="rounded-[30px] bg-white p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-slate-100">
                       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                         <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br from-orange-400 to-cyan-500 text-lg font-semibold text-white">
                              {req.riderId?.name?.[0]?.toUpperCase() || 'R'}
                            </div>
                            <div>
                               <h3 className="text-lg font-semibold text-slate-900">{req.riderId?.name || 'Rider'}</h3>
                               <p className="text-sm text-slate-500">{req.rideId?.from} → {req.rideId?.to}</p>
                               <p className="text-xs text-slate-400 mt-1">Departure: {req.rideId?.time} • Seats left: {req.rideId?.seats}</p>
                            </div>
                         </div>
                         <div className="mt-4 md:mt-0 flex gap-3 items-center">
                            {req.status === 'pending' ? (
                              <>
                                <button 
                                  onClick={() => handleAction(req._id, 'accepted')}
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                                >
                                  <CheckCircle className="h-4 w-4" /> Accept
                                </button>
                                <button
                                  onClick={() => handleAction(req._id, 'rejected')} 
                                  className="inline-flex items-center gap-1 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                                >
                                  <XCircle className="h-4 w-4" /> Reject
                                </button>
                              </>
                            ) : (
                               <span className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold ${req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                  {req.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                               </span>
                            )}
                         </div>
                       </div>
                     </div>
                  ))}
                </section>

                <aside className="space-y-5">
                  <div className="rounded-[28px] bg-white p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-700 text-xl font-semibold text-white">
                          {user.name?.[0]?.toUpperCase() || 'K'}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                          <p className="text-sm text-slate-500">Verified driver • Team commute lead</p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                              <Check className="h-3.5 w-3.5" />
                              98%
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
                      Privacy guaranteed. Rider contact info stays partially hidden until you approve a join request.
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#e9eff8] p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-white/70">
                    <h3 className="text-lg font-semibold text-slate-900">Publish a New Ride</h3>
                    <p className="mt-1 text-sm text-slate-500">Share your route to get rider requests.</p>

                    {!showForm ? (
                      <button 
                        onClick={() => setShowForm(true)}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800"
                      >
                        <Sparkles className="h-4 w-4" />
                        Create New Ride
                      </button>
                    ) : (
                      <form onSubmit={handlePublishRide} className="mt-4 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">From</label>
                          <input
                            type="text"
                            placeholder="e.g. Gurugram"
                            value={rideForm.from}
                            onChange={(e) => setRideForm({ ...rideForm, from: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">To</label>
                          <input
                            type="text"
                            placeholder="e.g. Noida Sector 62"
                            value={rideForm.to}
                            onChange={(e) => setRideForm({ ...rideForm, to: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 8:00 AM"
                            value={rideForm.time}
                            onChange={(e) => setRideForm({ ...rideForm, time: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Seats Available</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={rideForm.seats}
                            onChange={(e) => setRideForm({ ...rideForm, seats: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="submit"
                            disabled={publishing}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 disabled:opacity-50"
                          >
                            {publishing ? <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</> : <><Sparkles className="h-4 w-4" /> Publish Ride</>}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Driver;
