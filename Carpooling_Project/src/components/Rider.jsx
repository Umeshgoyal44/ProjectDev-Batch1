import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, Leaf, LocateFixed, MapPinned, ShieldCheck, WalletCards } from 'lucide-react';

const riderBenefits = [
  {
    title: 'Search rides by corridor',
    description: 'Compare multiple matching trips around your pickup zone and office timing.',
    icon: MapPinned,
  },
  {
    title: 'Save on every commute',
    description: 'See transparent pricing before booking and keep your monthly travel spend predictable.',
    icon: WalletCards,
  },
  {
    title: 'Travel with verified people',
    description: 'Review ratings, trusted profiles, and ride preferences before confirming your seat.',
    icon: ShieldCheck,
  },
];

const riderMetrics = [
  { label: 'Pickup accuracy', value: '2 min avg' },
  { label: 'Monthly savings', value: 'INR 3,200' },
  { label: 'CO2 reduced', value: '18 kg' },
];

function Rider() {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-amber-900/10 bg-white/80 p-6 shadow-lg shadow-amber-950/5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.35em] text-amber-700">Rider space</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Find dependable seats for the trips you make every day.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                This page gives riders a clear landing experience with booking-focused information and quick navigation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-800 transition hover:border-amber-500 hover:text-amber-700"
              >
                Back to home
              </Link>
              <Link
                to="/driver"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View driver page
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="rounded-[2rem] bg-[#17342b] p-8 text-white shadow-2xl shadow-emerald-950/20">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-emerald-200">
              <LocateFixed className="h-5 w-5" />
              Commute snapshot
            </div>
            <h2 className="mt-6 text-3xl font-semibold leading-tight">Book the right ride without chasing last-minute availability.</h2>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-emerald-100/80">Morning route</p>
                <p className="mt-2 text-lg font-medium">Indirapuram to Noida Sector 18</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="flex items-center gap-2 text-sm text-emerald-100/80">
                  <Clock3 className="h-4 w-4" />
                  Best pickup window
                </p>
                <p className="mt-2 text-lg font-medium">08:05 AM to 08:20 AM</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="flex items-center gap-2 text-sm text-emerald-100/80">
                  <Leaf className="h-4 w-4" />
                  Sustainable choice
                </p>
                <p className="mt-2 text-lg font-medium">Share one car instead of four solo rides</p>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-amber-900/10 bg-white/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Why riders need this page</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {riderMetrics.map((metric) => (
                <article key={metric.label} className="rounded-3xl bg-[#f7f1e7] p-4">
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-4">
              {riderBenefits.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Rider;
