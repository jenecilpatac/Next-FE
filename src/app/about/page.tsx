"use client";

import Link from "next/link";
import publicAuth from "../lib/publicAuth";

const values = [
  {
    icon: "fa-lightbulb",
    color: "text-yellow-500 bg-yellow-500/10",
    title: "Innovation",
    desc: "We constantly strive to innovate and bring fresh ideas to solve problems efficiently.",
  },
  {
    icon: "fa-handshake",
    color: "text-blue-500 bg-blue-500/10",
    title: "Integrity",
    desc: "We maintain the highest level of integrity in our relationships with clients and partners.",
  },
  {
    icon: "fa-trophy",
    color: "text-purple-500 bg-purple-500/10",
    title: "Excellence",
    desc: "We are committed to excellence in every project, ensuring we exceed expectations.",
  },
];

const team = [
  {
    name: "Leomord The Cowboy",
    role: "CEO & Founder",
    bio: "The visionary behind our company, with over 10 years of experience in the tech industry.",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq3ps64efvuEfVM67Jx45gZ11aXksiHe1CXg&s",
  },
  {
    name: "Fanny Fibr",
    role: "Lead Developer",
    bio: "Leads our development team, ensuring top-quality products are delivered on time.",
    avatar: "https://s1.zerochan.net/Fanny.600.3260627.jpg",
  },
  {
    name: "Johnson Truck",
    role: "Product Manager",
    bio: "Ensures that our products meet the needs of our clients and are executed flawlessly.",
    avatar:
      "https://i.pinimg.com/originals/7a/df/24/7adf247941ed75f6423abcba2219cbf8.jpg",
  },
];

const socials = [
  {
    href: "https://www.facebook.com",
    icon: "fab fa-facebook",
    color: "text-blue-500",
  },
  {
    href: "https://www.instagram.com",
    icon: "fab fa-instagram",
    color: "text-pink-500",
  },
  {
    href: "https://www.x.com",
    icon: "fab fa-x-twitter",
    color: "text-gray-700 dark:text-gray-300",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto px-6 pt-16 pb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full">
          <i className="fa-solid fa-circle-info" /> About Us
        </span>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Who We Are
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
          We are a team of passionate individuals committed to providing
          innovative solutions for businesses.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-blue-500 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <i className="fa-solid fa-bullseye text-white/60 text-3xl mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-blue-100 leading-relaxed">
            To empower businesses by delivering high-quality, scalable, and
            efficient digital solutions that help them achieve their goals and
            grow.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map(({ icon, color, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <i className={`fa-solid ${icon} text-lg`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map(({ name, role, bio, avatar }) => (
              <div
                key={name}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/20 mx-auto"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {name}
                </h3>
                <p className="text-xs text-blue-500 font-medium mb-3">{role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {bio}
                </p>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-center gap-2">
                  {socials.map(({ href, icon, color }) => (
                    <Link
                      key={icon}
                      href={href}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <i className={`${icon} text-sm ${color}`} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-headset text-2xl text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Get In Touch
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Have questions or want to learn more? Reach out to us and we'll get
            back to you as soon as possible.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-paper-plane" />
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default publicAuth(About);
