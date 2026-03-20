"use client";

import publicAuth from "../lib/publicAuth";
import Link from "next/link";

const services = [
  { icon: "fa-cogs", color: "text-blue-500 bg-blue-500/10", title: "Custom Development", desc: "Tailored development solutions for your business needs, whether it's a website or a complex web app." },
  { icon: "fa-magnifying-glass", color: "text-green-500 bg-green-500/10", title: "SEO Optimization", desc: "Improve your search engine rankings with our proven SEO strategies that drive organic traffic." },
  { icon: "fa-laptop-code", color: "text-purple-500 bg-purple-500/10", title: "Web & App Design", desc: "Create stunning, user-friendly websites and mobile apps with our expert design services." },
  { icon: "fa-users", color: "text-yellow-500 bg-yellow-500/10", title: "Consulting & Strategy", desc: "Expert consulting services to help you grow your business with the right strategies." },
  { icon: "fa-cloud-arrow-up", color: "text-teal-500 bg-teal-500/10", title: "Cloud Solutions", desc: "Secure and scalable cloud-based solutions to help your business stay ahead of the competition." },
  { icon: "fa-headset", color: "text-orange-500 bg-orange-500/10", title: "Customer Support", desc: "24/7 customer support to assist your users and ensure their satisfaction with your products." },
];

const Services = () => {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto px-6 pt-16 pb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full">
          <i className="fa-solid fa-briefcase" /> What We Offer
        </span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          From development to support, we provide end-to-end solutions to help your business thrive.
        </p>
      </section>

      {/* Services grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map(({ icon, color, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fa-solid ${icon} text-xl`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-500 py-14">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Let's work together to build something great. Reach out and we'll find the right solution for you.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-blue-500 bg-white hover:bg-blue-50 rounded-xl shadow-md active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-arrow-right" />
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default publicAuth(Services);
