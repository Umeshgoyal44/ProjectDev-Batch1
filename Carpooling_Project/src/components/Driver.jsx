import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CarFront,
  Check,
  CircleDot,
  Clock3,
  Leaf,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';

const sidebarItems = [
  { label: 'Find a Ride', to: '/rider', active: false },
  { label: 'Offer a Ride', to: '/driver', active: true },
  { label: 'My Trips', to: '/', active: false },
  { label: 'Messages', to: '/', active: false },
];

const quickStats = [
  { label: 'Route', value: 'Express lane' },
  { label: 'Luggage', value: '2 cabin bags' },
  { label: 'Rules', value: 'No smoking' },
];

function Driver() {
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
                    D
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Welcome back</p>
                    <p className="font-semibold">Driver Krishna</p>
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
                      K
                    </div>
                  </div>
                </div>
              </header>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
                <section className="space-y-5">
                  <div className="rounded-[30px] bg-white p-4 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-slate-100">
                    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50 p-6">
                      <div className="absolute inset-0 opacity-50">
                        <div className="h-full w-full bg-[linear-gradient(90deg,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.15)_1px,transparent_1px)] bg-[size:42px_42px]" />
                      </div>
                      <div className="relative h-[240px] rounded-[22px] border border-white/70 bg-white/40">
                        <svg viewBox="0 0 520 280" className="h-full w-full">
                          <path d="M42 218C96 199 111 142 159 136C213 128 236 39 289 44C338 49 353 144 415 154C448 159 473 128 492 99" fill="none" stroke="#1b72c9" strokeWidth="10" strokeLinecap="round" />
                          <path d="M57 233C120 192 152 181 193 171C246 157 268 71 325 76C388 82 402 143 466 164" fill="none" stroke="#18a0aa" strokeWidth="8" strokeLinecap="round" strokeDasharray="12 12" />
                          <path d="M166 126L210 80L279 87L329 45L395 124" fill="none" stroke="#62c56f" strokeWidth="7" strokeLinecap="round" />
                        </svg>
                        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-600/30">
                          <Leaf className="h-4 w-4" />
                          Eco-impact: 6.1kg CO2 saved
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-3xl font-semibold text-slate-900">Gurugram to Noida Sector 62</p>
                        <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-4 w-4 text-blue-600" />
                            7:45 AM departure
                          </span>
                          <span>42 min duration</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Earning / seat</p>
                        <p className="mt-1 text-4xl font-semibold text-blue-700">₹185</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {quickStats.map((item) => (
                        <div key={item.label} className="rounded-[22px] bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                          <p className="mt-2 font-medium text-slate-800">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="space-y-5">
                  <div className="rounded-[28px] bg-white p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-700 text-xl font-semibold text-white">
                          K
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Krishna</h2>
                          <p className="text-sm text-slate-500">Verified driver • Team commute lead</p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                              <Check className="h-3.5 w-3.5" />
                              98%
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              4.9 (142 rides)
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

                  <div className="rounded-[28px] bg-white p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-slate-100">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Vehicle</p>
                        <p className="mt-2 font-medium text-slate-800">Tesla Model 3 • White</p>
                      </div>
                      <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Seats open</p>
                        <p className="mt-2 font-medium text-slate-800">4 of 5</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#e9eff8] p-5 shadow-[0_15px_40px_rgba(30,64,175,0.08)] ring-1 ring-white/70">
                    <h3 className="text-lg font-semibold text-slate-900">Publish this pool</h3>
                    <p className="mt-1 text-sm text-slate-500">Share route details and invite riders to request seats.</p>

                    <div className="mt-4 rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Ride note</p>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        Pickup starts at Cyber City metro. Riders should arrive 5 minutes early for a smooth departure.
                      </p>
                    </div>

                    <label className="mt-4 flex items-start gap-3 text-sm text-slate-500">
                      <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
                      I agree to the carpool community guidelines and verified passenger policy.
                    </label>

                    <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800">
                      <Sparkles className="h-4 w-4" />
                      Publish Ride Request
                    </button>

                    <p className="mt-3 text-center text-xs text-slate-500">Drivers usually get matching rider requests within 15 minutes.</p>
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
