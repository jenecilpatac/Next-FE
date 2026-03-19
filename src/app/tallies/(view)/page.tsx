import Link from "next/link";

export default function TalliesPage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{
        backgroundImage:
          'url("https://i.pinimg.com/600x315/a0/e8/2d/a0e82dc084c9f4f124a8fcb16f5b9e53.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-orange-300 bg-orange-500/10 border border-orange-500/30 rounded-full backdrop-blur-sm">
          <i className="fa-solid fa-basketball text-orange-400" />
          NBA Tallies
        </span>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full ring-4 ring-white/20 overflow-hidden shadow-2xl">
            <img
              src="https://cdn.worldvectorlogo.com/logos/dallas-mavericks.svg"
              alt="NBA"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
          Track Every{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Game
          </span>
        </h1>
        <p className="text-gray-300 text-base mb-10 leading-relaxed">
          Follow NBA schedules, explore team rosters, and stay up to date with
          every matchup.
        </p>

        {/* CTA cards */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <Link
            href="/tallies/schedules"
            className="flex flex-col items-center gap-2 px-5 py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-calendar-days text-2xl" />
            <span className="text-sm font-medium">Schedules</span>
          </Link>
          <Link
            href="/tallies/teams"
            className="flex flex-col items-center gap-2 px-5 py-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl backdrop-blur-sm active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-people-group text-2xl" />
            <span className="text-sm font-medium">Teams</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
