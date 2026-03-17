import React from 'react';
import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';
import { useAppKitAccount } from '@reown/appkit/react';

const features = [
  {
    icon: (
      <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Secure Escrow',
    desc: 'Funds are locked in smart contract escrow until work is verified and approved — full protection for both parties.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Instant Payments',
    desc: 'Blockchain-powered settlements in seconds — no bank delays, no wire fees, no waiting.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none">
        <path d="M12 1V23M17 5H9.5a3.5 3.5 0 000 7H14.5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Ultra-Low Fees',
    desc: 'Transaction costs measured in fractions of a cent — keep more of what you earn.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none">
        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Global Access',
    desc: 'Work with anyone, anywhere in the world — no borders, no currency conversions.',
  },
];

const steps = [
  { num: '01', title: 'Connect Wallet', desc: 'Link your crypto wallet to create your identity on ChainWork.' },
  { num: '02', title: 'Build Profile', desc: 'Showcase your skills as a freelancer or post your needs as a client.' },
  { num: '03', title: 'Find & Post Jobs', desc: 'Browse open projects or publish new opportunities in minutes.' },
  { num: '04', title: 'Get Paid in Crypto', desc: 'Release escrow on completion — funds arrive instantly in your wallet.' },
];

const Home: React.FC = () => {
  const { isConnected } = useAppKitAccount();

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-bg py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
            Powered by Blockchain
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-secondary-900 mb-5 leading-tight">
            Freelance without{' '}
            <span className="gradient-text">intermediaries</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            ChainWork connects clients and freelancers through smart contract escrow — transparent, trustless, and instant crypto payments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isConnected ? (
              <WalletButton />
            ) : (
              <>
                <Link
                  to="/jobs"
                  className="px-8 py-3.5 bg-primary-600 text-white font-bold rounded-xl btn-glow hover:bg-primary-700 transition-all text-base"
                >
                  Browse Jobs →
                </Link>
                <Link
                  to="/jobs/create"
                  className="px-8 py-3.5 border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all text-base"
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { val: '< $0.01', label: 'Per Transaction' },
              { val: '< 1s', label: 'Settlement Time' },
              { val: '100%', label: 'On-Chain' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold gradient-text">{val}</p>
                <p className="text-xs text-secondary-500 mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-3">
              Why <span className="gradient-text">ChainWork</span>?
            </h2>
            <p className="text-secondary-500 max-w-xl mx-auto text-base">
              We replace trust with math — smart contracts enforce every agreement automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-secondary-100 bg-white p-6 card-hover"
              >
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-1.5">{title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 hero-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-3">How It Works</h2>
            <p className="text-secondary-500 max-w-md mx-auto text-base">
              Get started in four simple steps — no bank account required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative bg-white rounded-2xl p-6 shadow-sm border border-secondary-100 card-hover">
                <span className="text-4xl font-black text-primary-100 absolute top-4 right-5 leading-none select-none">
                  {num}
                </span>
                <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center mb-4">
                  <span className="text-white font-extrabold text-sm">{parseInt(num)}</span>
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-1.5">{title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to build the future of work?</h2>
          <p className="text-primary-200 mb-8 text-base">
            Join ChainWork — where every agreement is enforced by code, not contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all"
              >
                Create Account →
              </Link>
            ) : (
              <WalletButton />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
