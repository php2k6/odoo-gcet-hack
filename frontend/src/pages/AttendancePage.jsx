import { useState, useMemo } from "react";
import EmployeeNav from '../components/EmployeeNav';
import { useAuth } from '../context/AuthContext';

// Generate mock data with today's date
const generateMockData = () => {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      empId: "EMP001",
      name: "Rahul",
      date: today,
      checkIn: "10:00",
      checkOut: "19:00",
      breakMin: 60,
      workHrs: 8,
      extraHrs: 1,
      status: "PRESENT",
    },
    {
      empId: "EMP002",
      name: "Anita",
      date: today,
      checkIn: "09:45",
      checkOut: "18:30",
      breakMin: 45,
      workHrs: 8,
      extraHrs: 0.5,
      status: "PRESENT",
    },
    {
      empId: "EMP003",
      name: "Priya",
      date: today,
      checkIn: "09:30",
      checkOut: "18:15",
      breakMin: 45,
      workHrs: 8,
      extraHrs: 0,
      status: "PRESENT",
    },
  ];
};

export default function AttendancePage() {
  const { isAdmin: authIsAdmin } = useAuth();
  const isAdmin = false; // Default to false for testing (employee view)
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [view, setView] = useState("day");

  const mockData = useMemo(() => generateMockData(), []);
  const today = new Date().toISOString().slice(0, 10);

  const todayData = useMemo(
    () => mockData.filter(a => a.date === today),
    [mockData, today]
  );

  const payableDays = useMemo(() => {
    return mockData.filter(a => a.status === "PRESENT").length;
  }, [mockData]);

  // Data to display in table
  const displayData = isAdmin ? todayData : mockData;

  console.log("AttendancePage Debug:", {
    isAdmin,
    mockDataLength: mockData.length,
    todayDataLength: todayData.length,
    displayDataLength: displayData.length,
    today,
    displayData
  });

  return (
    <div className="min-h-screen bg-slate-50" onClick={() => setShowProfileMenu(false)}>
      <EmployeeNav 
        showProfileMenu={showProfileMenu} 
        setShowProfileMenu={setShowProfileMenu}
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            Attendance
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setView("day")}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === "day"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              Day
            </button>

            <button
              onClick={() => setView("month")}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === "month"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Payable Days Card */}
        {!isAdmin && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <p className="text-sm opacity-90">Payable Days (Current Month)</p>
            <p className="text-3xl font-bold">{payableDays}</p>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                {isAdmin && <th className="px-4 py-3 text-left">Employee</th>}
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3">Break</th>
                <th className="px-4 py-3">Work Hrs</th>
                <th className="px-4 py-3">Extra</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {displayData && displayData.length > 0 ? (
                displayData.map((a, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    {isAdmin && (
                      <td className="px-4 py-3 font-medium">
                        {a.name}
                      </td>
                    )}
                    <td className="px-4 py-3 text-center">{a.checkIn}</td>
                    <td className="px-4 py-3 text-center">{a.checkOut}</td>
                    <td className="px-4 py-3 text-center">
                      {a.breakMin}m
                    </td>
                    <td className="px-4 py-3 text-center">
                      {a.workHrs}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {a.extraHrs}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Admin Insight */}
        {isAdmin && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200">
            <p className="font-medium text-indigo-700">
              Attendance today is used to calculate payroll & payable days.
            </p>
            <p className="text-sm text-indigo-600">
              Half-days, leaves, and absents automatically adjust salary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
