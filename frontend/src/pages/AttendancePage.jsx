import { useState, useMemo } from "react";
import EmployeeNav from "../components/EmployeeNav";
import { useAuth } from "../context/AuthContext";

// mock data
const genData = () => {
    const t = new Date().toISOString().slice(0, 10);
    return [
        { empId: "EMP001", name: "Rahul", date: t, checkIn: "10:00", checkOut: "19:00", breakMin: 60, workHrs: 8, extraHrs: 1, status: "PRESENT" },
        { empId: "EMP002", name: "Anita", date: t, checkIn: "09:45", checkOut: "18:30", breakMin: 45, workHrs: 8, extraHrs: 0.5, status: "PRESENT" },
        { empId: "EMP003", name: "Priya", date: t, checkIn: "09:30", checkOut: "18:15", breakMin: 45, workHrs: 8, extraHrs: 0, status: "PRESENT" },
    ];
};

export default function AttendancePage() {
    const { isAdmin } = useAuth();

    const [menu, setMenu] = useState(false);
    const [selDate, setSelDate] = useState(new Date());
    const [q, setQ] = useState("");

    const data = useMemo(() => genData(), []);
    const selDateStr = selDate.toISOString().slice(0, 10);

    // admin → selected date
    const adminData = useMemo(() => {
        return data
            .filter(a => a.date === selDateStr)
            .filter(a => a.name.toLowerCase().includes(q.toLowerCase()));
    }, [data, selDateStr, q]);

    // employee → selected month
    const empData = useMemo(() => {
        const m = selDate.getMonth();
        const y = selDate.getFullYear();
        return data.filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === m && d.getFullYear() === y;
        });
    }, [data, selDate]);

    const dispData = isAdmin ? adminData : empData;

    const moveDay = dir => {
        const d = new Date(selDate);
        d.setDate(d.getDate() + dir);
        setSelDate(d);
    };

    return (
        <div className="min-h-screen bg-slate-50" onClick={() => setMenu(false)}>
            <EmployeeNav showProfileMenu={menu} setShowProfileMenu={setMenu} />

            <div className="p-6">
                {/* Header */}
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-slate-800">Attendance</h1>

                    <div className="flex items-center gap-2">
                        <button onClick={() => moveDay(-1)} className="px-3 py-2 bg-white border rounded-lg">←</button>

                        <input
                            type="date"
                            value={selDateStr}
                            onChange={e => setSelDate(new Date(e.target.value))}
                            className="px-3 py-2 border rounded-lg"
                        />

                        <button onClick={() => moveDay(1)} className="px-3 py-2 bg-white border rounded-lg">→</button>

                        {isAdmin && (
                            <input
                                placeholder="Search employee"
                                value={q}
                                onChange={e => setQ(e.target.value)}
                                className="ml-2 px-3 py-2 border rounded-lg"
                            />
                        )}
                    </div>
                </div>

                {/* Context */}
                <p className="mb-4 text-slate-600">
                    {isAdmin
                        ? `Attendance for ${selDate.toDateString()}`
                        : `Attendance for ${selDate.toLocaleString("default", { month: "long", year: "numeric" })}`}
                </p>

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                {isAdmin ? (
                                    <th className="px-4 py-3 text-left">Employee</th>
                                ) : (
                                    <th className="px-4 py-3 text-left">Date</th>
                                )}
                                <th className="px-4 py-3">In</th>
                                <th className="px-4 py-3">Out</th>
                                <th className="px-4 py-3">Break</th>
                                <th className="px-4 py-3">Work</th>
                                <th className="px-4 py-3">Extra</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dispData.length ? (
                                dispData.map((a, i) => (
                                    <tr key={i} className="border-t hover:bg-slate-50">
                                        {isAdmin ? (
                                            <td className="px-4 py-3 font-medium">{a.name}</td>
                                        ) : (
                                            <td className="px-4 py-3">{a.date}</td>
                                        )}
                                        <td className="px-4 py-3 text-center">{a.checkIn}</td>
                                        <td className="px-4 py-3 text-center">{a.checkOut}</td>
                                        <td className="px-4 py-3 text-center">{a.breakMin}m</td>
                                        <td className="px-4 py-3 text-center">{a.workHrs}</td>
                                        <td className="px-4 py-3 text-center">{a.extraHrs}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {isAdmin && (
                    <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                        <p className="font-medium text-indigo-700">
                            Attendance is the source of payable-day & payroll calculation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
