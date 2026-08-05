import { UserCircle, Mail, Shield } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="flex flex-col items-center">
          <UserCircle size={120} className="text-indigo-600" />

          <h1 className="text-3xl font-bold mt-4">
            Rohith S
          </h1>

          <p className="text-gray-500">
            Administrator
          </p>
        </div>

        <div className="mt-10 space-y-5">

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
            <Mail className="text-indigo-600" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-500">
                rohithbecsc@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
            <Shield className="text-green-600" />
            <div>
              <p className="font-semibold">Role</p>
              <p className="text-gray-500">
                Super Admin
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}