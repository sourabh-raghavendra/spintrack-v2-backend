import React from "react";
import { ShieldCheck, Calendar, Clock } from "lucide-react";

// --- Types ---
export interface WarrantyData {
  status: "active" | "expired" | "pending";
  closureDate: string;
  warantyValidTill: string;
  jo: string;
  daysRemaining: number;
  totalDays: number;
}

// --- Warranty Card Component ---
export const WarrantyCard: React.FC<{ data: WarrantyData }> = ({ data }) => {
  const isPending = data.status === "pending";
  const progress = isPending
    ? 0
    : Math.max(0, Math.min(100, (data.daysRemaining / data.totalDays) * 100));
  const isExpiringSoon =
    !isPending && data.daysRemaining < 30 && data.status === "active";

  return (
    <div className="mt-6 border border-slate-100 bg-slate-50/50 rounded-2xl p-6 transition-all hover:shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left Side: Status & Progress */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Spindle Warranty
              </h3>
              <p className="text-xs text-slate-500">
                {isPending
                  ? "Warranty information will be available soon"
                  : "Protection plan for your equipment"}
              </p>
            </div>
            <span
              className={`ml-auto md:ml-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                data.status === "active"
                  ? "bg-green-100 text-green-700"
                  : data.status === "expired"
                    ? "bg-slate-200 text-slate-600"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {isPending ? "Pending Activation" : "Warranty Progress"}
              </span>
              <span
                className={
                  isExpiringSoon
                    ? "text-orange-600 font-bold"
                    : "text-slate-700 font-semibold"
                }
              >
                {isPending
                  ? "Awaiting Order Closure"
                  : `${data.daysRemaining} days remaining`}
              </span>
            </div>

            {/* Aesthetic Progress Bar */}
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isPending
                    ? "bg-slate-300"
                    : isExpiringSoon
                      ? "bg-orange-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${isPending ? 100 : progress}%` }}
              />
            </div>

            {isPending ? (
              <div className="flex items-center gap-2 pt-2 text-amber-700">
                <Clock size={14} />
                <span className="text-xs font-medium italic">
                  Note: Warranty will be valid after order closure.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase">
                      Activated (Closure)
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {data.closureDate || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase">
                      Expires (Warranty Till)
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {data.warantyValidTill || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details Only */}
        <div className="w-full md:w-64 flex flex-col gap-3">
          <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-500">JO Number</span>
              <span className="text-xs font-mono font-bold text-slate-800">
                {data.jo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyCard;
