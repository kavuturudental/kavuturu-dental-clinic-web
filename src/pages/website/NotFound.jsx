import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import Footer from "../../components/website/footer/Footer";

const NotFound = () => {
  return (
    <main className="bg-white pt-[72px] lg:pt-[88px] min-h-screen flex flex-col justify-between">
      {/* Breadcrumb */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center px-5 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link to="/" className="flex items-center gap-2 text-slate-500 transition-colors hover:text-sky-600">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </nav>
      </div>
    </section>

    {/* Main Content */}
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-24 text-center my-auto">
      <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
        Error 404
      </span>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl leading-tight">
        Page Not Found
      </h1>

      <p className="mt-4 text-slate-600 max-w-md mx-auto">
        The page you are looking for does not exist, has been removed, or has been relocated to another address.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 font-semibold text-white hover:bg-sky-700 transition-colors shadow-md cursor-pointer"
      >
        <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default NotFound;
