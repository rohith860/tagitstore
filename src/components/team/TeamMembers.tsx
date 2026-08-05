import { FaUserTie, FaCircle } from "react-icons/fa";

const team = [
  {
    name: "John Smith",
    role: "Project Manager",
    email: "john@tagitstore.com",
  },
  {
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    email: "sarah@tagitstore.com",
  },
  {
    name: "David Wilson",
    role: "Frontend Developer",
    email: "david@tagitstore.com",
  },
  {
    name: "Emily Brown",
    role: "Backend Developer",
    email: "emily@tagitstore.com",
  },
];

export default function TeamMembers() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-8">
        Team Members
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map((member, index) => (
          <div
            key={index}
            className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl">
                  <FaUserTie />
                </div>

                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <FaCircle className="text-[6px] text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {member.name}
                </h3>

                <p className="text-indigo-500 font-medium">
                  {member.role}
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {member.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}