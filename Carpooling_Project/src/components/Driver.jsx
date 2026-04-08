import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock3, IndianRupee, MapPinned, ShieldCheck, Users } from 'lucide-react';

const driverHighlights = [
  {
    title: 'Create weekly commute routes',
    description: 'Set pickup windows, recurring trips, and seat availability in a few taps.',
    icon: MapPinned,
  },
  {
    title: 'Fill empty seats faster',
    description: 'Match with nearby riders who are already searching for the same corridor.',
    icon: Users,
  },
  {
    title: 'Drive with confidence',
    description: 'Verified profiles, trip preferences, and clear pickup details before you start.',
    icon: ShieldCheck,
  },
];

const upcomingTrips = [
  { route: 'Noida Sector 62 to Gurugram Cyber Hub', time: '08:15 AM', seats: '3 seats open' },
  { route: 'Rohini to Connaught Place', time: '09:00 AM', seats: '2 seats open' },
  { route: 'Vaishali to Nehru Place', time: '06:45 PM', seats: '4 seats open' },
];

function Driver() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.35em] text-cyan-300">Driver hub</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Plan rides, publish seats, and earn on your commute.</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              This page gives drivers a simple dashboard-style landing area to manage ride supply and stay visible to riders.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to home
            </Link>
            <Link
              to="/rider"
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              View rider page
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-700 p-8 text-slate-950 shadow-2xl shadow-cyan-950/30">
            <div className="mb-8 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900/70">
              <Car className="h-5 w-5" />
              Driver control center
            </div>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              Turn your daily route into a reliable, shared trip for your city.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/25 p-4 backdrop-blur">
                <p className="text-sm text-slate-900/70">Estimated weekly earnings</p>
                <p className="mt-2 flex items-center gap-1 text-2xl font-semibold">
                  <IndianRupee className="h-5 w-5" />
                  2,800
                </p>
              </div>
              <div className="rounded-3xl bg-white/25 p-4 backdrop-blur">
                <p className="text-sm text-slate-900/70">Average detour</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <Clock3 className="h-5 w-5" />
                  9 min
                </p>
              </div>
              <div className="rounded-3xl bg-white/25 p-4 backdrop-blur">
                <p className="text-sm text-slate-900/70">Profile trust score</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <ShieldCheck className="h-5 w-5" />
                  4.9/5
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Upcoming trips</p>
            <div className="mt-5 space-y-4">
              {upcomingTrips.map((trip) => (
                <article key={`${trip.route}-${trip.time}`} className="rounded-3xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">{trip.time}</p>
                  <h3 className="mt-2 text-lg font-medium text-white">{trip.route}</h3>
                  <p className="mt-2 text-sm text-cyan-300">{trip.seats}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-3">
          {driverHighlights.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Driver;
