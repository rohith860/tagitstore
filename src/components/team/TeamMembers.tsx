import { useEffect, useState } from "react";
import {
  FaUserTie,
  FaCircle,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
}

const defaultTeam: TeamMember[] = [
  {
    id: 1,
    name: "John Smith",
    role: "Project Manager",
    email: "john@tagitstore.com",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    email: "sarah@tagitstore.com",
  },
  {
    id: 3,
    name: "David Wilson",
    role: "Frontend Developer",
    email: "david@tagitstore.com",
  },
  {
    id: 4,
    name: "Emily Brown",
    role: "Backend Developer",
    email: "emily@tagitstore.com",
  },
];

export default function TeamMembers() {
  const [team, setTeam] = useState<TeamMember[]>(() => {
    const savedTeam = localStorage.getItem(
      "tagit_team_members"
    );

    if (savedTeam) {
      return JSON.parse(savedTeam);
    }

    return defaultTeam;
  });

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "tagit_team_members",
      JSON.stringify(team)
    );
  }, [team]);

  const handleAddMember = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !role.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    };

    setTeam((prevTeam) => [
      ...prevTeam,
      newMember,
    ]);

    setName("");
    setEmail("");
    setRole("");
    setShowForm(false);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-200/40 transition-all duration-300 sm:p-6 lg:p-8 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />

            <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Team Members
            </h2>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Manage your team members and their roles
          </p>

        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-fit"
        >
          <FaPlus className="transition-transform duration-300 group-hover:rotate-90" />
          Add Member
        </button>

      </div>

      {/* =========================================
          ADD MEMBER FORM
      ========================================= */}

      {showForm && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-800/70">

          <div className="mb-5 flex items-center justify-between gap-3">

            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Add New Member
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Enter the member's basic details
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-700 dark:hover:border-red-900/40 dark:hover:bg-red-950/30"
              aria-label="Close form"
            >
              <FaTimes />
            </button>

          </div>

          <form onSubmit={handleAddMember}>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                />
              </div>

              {/* ROLE */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Role
                </label>

                <input
                  type="text"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  placeholder="Enter role"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                />
              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Save Member
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =========================================
          TEAM GRID
      ========================================= */}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">

        {team.map((member) => (

          <div
            key={member.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 sm:p-5 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
          >

            {/* HOVER LINE */}

            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-3 sm:gap-4">

              {/* AVATAR */}

              <div className="relative shrink-0">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-lg text-white shadow-lg transition-all duration-300 group-hover:scale-105 sm:h-16 sm:w-16 sm:text-xl">
                  <FaUserTie />
                </div>

                {/* ONLINE */}

                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900">
                  <FaCircle className="text-[6px] text-white" />
                </div>

              </div>

              {/* MEMBER INFO */}

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <h3 className="truncate text-sm font-bold text-slate-800 sm:text-base dark:text-white">
                    {member.name}
                  </h3>

                  <span className="hidden shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 sm:inline dark:bg-emerald-950/30 dark:text-emerald-400">
                    Online
                  </span>

                </div>

                <p className="mt-1 truncate text-xs font-bold text-indigo-500 dark:text-indigo-400">
                  {member.role}
                </p>

                <p className="mt-1 truncate text-[10px] font-medium text-slate-400 sm:text-xs">
                  {member.email}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">

        <p className="text-[10px] font-medium text-slate-400 sm:text-xs">
          {team.length}{" "}
          {team.length === 1
            ? "team member"
            : "team members"}
        </p>

        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
          Team
        </span>

      </div>

    </div>
  );
}