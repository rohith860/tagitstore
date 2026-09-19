export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
        <div>
          <p className="mb-4 text-indigo-400">
            🚀 Welcome to TAGITStore
          </p>

          <h1 className="text-5xl font-bold">
            Manage Your Store
            <span className="block text-indigo-400">
              Smarter & Faster
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Manage products, orders, customers and analytics
            from one powerful dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}