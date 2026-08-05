import { FaUserShield, FaEnvelope, FaCircle } from "react-icons/fa";

export default function ProfileCard() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
            R
          </div>

          <div className="absolute bottom-1 right-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-slate-900">
            <FaCircle className="text-[8px] text-white" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Rohith
          </h2>

          <p className="mt-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <FaUserShield className="text-indigo-500" />
            Administrator
          </p>

          <p className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <FaEnvelope className="text-cyan-500" />
            rohithbecsc@gmail.com
          </p>

          <span className="inline-block mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg">
            ⭐ Premium Member
          </span>
        </div>
      </div>
    </div>
  );
}