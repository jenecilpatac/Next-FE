"use client";

import Link from "next/link";
import publicAuth from "../lib/publicAuth";

const About = () => {
  return (
    <div className="min-h-screen py-16 px-3">
      <section className="text-center max-w-4xl mx-auto px-6 mb-12">
        <h1 className="text-4xl font-semibold mb-4">About Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We are a team of passionate individuals committed to providing
          innovative solutions for businesses.
        </p>
      </section>

      <section className="text-center max-w-4xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Our mission is to empower businesses by delivering high-quality,
          scalable, and efficient digital solutions that help them achieve their
          goals and grow.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-black hover:dark:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out p-6 rounded-lg shadow-xl border">
              <h3 className="text-xl font-semibold mb-2">
                <i className="far fa-lightbulb-gear"></i> Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We constantly strive to innovate and bring fresh ideas to solve
                problems efficiently.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-black hover:dark:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out p-6 rounded-lg shadow-xl border">
              <h3 className="text-xl font-semibold mb-2">
                <i className="far fa-handshake"></i> Integrity
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We maintain the highest level of integrity in our relationships
                with clients and partners.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-black hover:dark:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out p-6 rounded-lg shadow-xl border">
              <h3 className="text-xl font-semibold mb-2">
                <i className="far fa-trophy-star"></i> Excellence
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We are committed to excellence in every project, ensuring we
                exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:border">
              <img
                className="w-32 h-32 rounded-full mx-auto mb-4"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq3ps64efvuEfVM67Jx45gZ11aXksiHe1CXg&s"
                alt="Team Member"
              />
              <h3 className="text-xl font-semibold">Leomord The Cowboy</h3>
              <p className="text-gray-600 dark:text-gray-300">CEO & Founder</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
                John is the visionary behind our company, with over 10 years of
                experience in the tech industry.
              </p>
              <hr />
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
                You can follow on
              </p>
              <p className="flex space-x-5 justify-center mt-3">
                <Link
                  href="https://www.facebook.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-facebook text-blue-600 text-md"></i>
                </Link>
                <Link
                  href="https://www.instagram.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-instagram text-orange-600 text-md"></i>
                </Link>
                <Link
                  href="https://www.x.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-x-twitter text-white-600 text-md"></i>
                </Link>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:border">
              <img
                className="w-32 h-32 rounded-full mx-auto mb-4"
                src="https://s1.zerochan.net/Fanny.600.3260627.jpg"
                alt="Team Member"
              />
              <h3 className="text-xl font-semibold">Fanny Fibr</h3>
              <p className="text-gray-600 dark:text-gray-300">Lead Developer</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
                Jane leads our development team, ensuring top-quality products
                are delivered on time.
              </p>
              <hr />
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
                You can follow on
              </p>
              <p className="flex space-x-5 justify-center mt-3">
                <Link
                  href="https://www.facebook.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-facebook text-blue-600 text-md"></i>
                </Link>
                <Link
                  href="https://www.instagram.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-instagram text-orange-600 text-md"></i>
                </Link>
                <Link
                  href="https://www.x.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-x-twitter text-white-600 text-md"></i>
                </Link>
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:border">
              <img
                className="w-32 h-32 rounded-full mx-auto mb-4"
                src="https://i.pinimg.com/originals/7a/df/24/7adf247941ed75f6423abcba2219cbf8.jpg"
                alt="Team Member"
              />
              <h3 className="text-xl font-semibold">Johnson Truck</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Product Manager
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
                Alice ensures that our products meet the needs of our clients
                and are executed flawlessly.
              </p>
              <hr />
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
                You can follow on
              </p>
              <p className="flex space-x-5 justify-center mt-3">
                <Link
                  href="https://www.facebook.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-facebook text-blue-600 text-md"></i>
                </Link>
                <Link
                  href="https://www.instagram.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-instagram text-orange-600 text-md"></i>
                </Link>
                <Link
                  href="https://www.x.com"
                  className="border px-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <i className="fab fa-x-twitter text-white-600 text-md"></i>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 shadow-xl py-12 text-center">
        <h2 className="text-3xl font-semibold mb-4">Get In Touch</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Have questions or want to learn more? Reach out to us, and we'll get
          back to you as soon as possible.
        </p>
        <a
          href="#"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition duration-300 hover:translate-x-0.5 ease-in-out hover:-translate-y-0.5"
        >
          <i className="far fa-headset"></i> Contact Us
        </a>
      </section>
    </div>
  );
};

export default publicAuth(About);
