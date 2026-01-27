import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative isolate overflow-hidden pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center py-20">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Campus Events, <br /> Unified.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Discover, register, and manage all your college festivals in one
            place. Tech, Cultural, and Sports events at your fingertips.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/events"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore Events
            </Link>
            <Link
              to="/about"
              className="text-sm font-semibold leading-6 text-white"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div
        className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl opacity-20 transform-gpu overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-primary to-[#ff80b5] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
    </div>
  );
}
