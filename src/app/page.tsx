import Link from "next/link";
import Image from "next/image";

const FACEBOOK_USERNAME = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME ?? "";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8 w-full max-w-[280px] shrink-0 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-200/50 transition duration-300 hover:scale-[1.02] hover:shadow-soft dark:bg-slate-800/80 dark:ring-slate-600/50 sm:mb-10 sm:max-w-[360px] md:max-w-[420px] lg:max-w-[500px]">
              <Image
                src="/images/logo.jpg"
                alt="Japan Surplus Store"
                width={500}
                height={250}
                className="block w-full h-auto"
                priority
                sizes="(max-width: 640px) 280px, (max-width: 768px) 360px, (max-width: 1024px) 420px, 500px"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              Japan Surplus Store
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Discover unique surplus items from Japan — quality goods at great
              prices. From tools to household items, find something special
              today.
            </p>
            <div className="mt-8">
              <Link
                href="/items"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 font-semibold text-white shadow-soft transition hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                View Items
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-semibold text-slate-800 dark:text-slate-100 sm:text-3xl">
            About Our Store
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600 dark:text-slate-300">
            We source quality surplus and second-hand items from Japan. Each
            product is selected for durability and value. Whether you need
            tools, kitchenware, or unique finds, we have something for you.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-semibold text-slate-800 dark:text-slate-100 sm:text-3xl">
            Get in Touch
          </h2>
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-center text-slate-600 dark:text-slate-300">
              Have questions or want to place an order? Reach us on Facebook
              Messenger for the fastest response.
            </p>
            {FACEBOOK_USERNAME ? (
              <a
                href={`https://m.me/${FACEBOOK_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1877F2] px-5 py-2.5 font-medium text-white transition hover:bg-[#166FE5]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Message us on Facebook
              </a>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Set NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME in .env.local to show the
                Facebook link.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
