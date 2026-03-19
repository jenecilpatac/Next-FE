"use client";

import publicAuth from "../lib/publicAuth";

const Services = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-12">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex justify-center mb-4">
              <i className="fa-solid fa-cogs text-4xl text-blue-500"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Custom Development
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tailored development solutions for your business needs, whether
              it's a website or a complex web app.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex justify-center mb-4">
              <i className="fa-solid fa-search text-4xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              SEO Optimization
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Improve your search engine rankings with our proven SEO strategies
              that drive organic traffic.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex justify-center mb-4">
              <i className="fa-solid fa-laptop-code text-4xl text-purple-500"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Web & App Design
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create stunning, user-friendly websites and mobile apps with our
              expert design services.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex justify-center mb-4">
              <i className="fa-solid fa-users text-4xl text-yellow-500"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Consulting & Strategy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We offer expert consulting services to help you grow your business
              with the right strategies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex justify-center mb-4">
              <i className="fa-solid fa-cloud-upload-alt text-4xl text-teal-500"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Cloud Solutions
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Secure and scalable cloud-based solutions to help your business
              stay ahead of the competition.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex justify-center mb-4">
              <i className="fa-solid fa-headset text-4xl text-orange-500"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Customer Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              24/7 customer support to assist your users and ensure their
              satisfaction with your products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default publicAuth(Services);
