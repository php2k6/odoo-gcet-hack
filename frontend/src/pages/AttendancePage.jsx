import { useState, useMemo, useEffect } from "react";
import EmployeeNav from "../components/EmployeeNav";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function AttendancePage() {
    const { isAdmin } = useAuth();

    const [menu, setMenu] = useState(false);
    const [selDate, setSelDate] = useState(new Date());
    const [q, setQ] = useState("");
    const [attendanceData, setAttendanceData] = useState(null);
    const [summary, setSummary] = useState(null);
    const [adminSummary, setAdminSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeStatuses, setEmployeeStatuses] = useState({});
    const selDateStr = selDate.toISOString().slice(0, 10);

    // Fetch attendance data based on role
    useEffect(() => {
        if (isAdmin) {
            fetchAdminAttendance();
        } else {
            fetchEmployeeAttendance();
        }
    }, [isAdmin, selDate]);

    const fetchEmployeeStatus = async (empId) => {
        try {
            const response = await api.get(`/attendance/status?emp_id=${empId}`);
            return response.data;
        } catch (err) {
            console.error(`Error fetching status for employee ${empId}:`, err);
            return null;
        }
    };

    const fetchAdminAttendance = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Format date as YYYY-MM-DD
            const date = selDate.toISOString().slice(0, 10);
            
            const response = await api.get(`/attendance/company?date=${date}`);
            const data = response.data;
            
            setAttendanceData(data.records || []);
            setAdminSummary({
                total_employees: data.total_employees || 0,
                present_count: data.present_count || 0,
                absent_count: data.absent_count || 0,
                on_leave_count: data.on_leave_count || 0
            });

            // Fetch current status for each employee
            if (data.records && data.records.length > 0) {
                const statusPromises = data.records.map(record => 
                    fetchEmployeeStatus(record.emp_id)
                );
                const statuses = await Promise.all(statusPromises);
                
                const statusMap = {};
                data.records.forEach((record, index) => {
                    if (statuses[index]) {
                        statusMap[record.emp_id] = statuses[index];
                    }
                });
                setEmployeeStatuses(statusMap);
            }
        } catch (err) {
            console.error('Error fetching admin attendance:', err);
            setError(err.response?.data?.message || 'Failed to fetch attendance data');
            setAttendanceData([]);
            setAdminSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeeAttendance = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Format month as YYYY-MM
            const month = selDate.toISOString().slice(0, 7);
            
            const response = await api.get(`/attendance/employee?month=${month}`);
            const data = response.data;
            
            setAttendanceData(data.attendance_records || []);
            setSummary(data.summary || null);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError(err.response?.data?.message || 'Failed to fetch attendance data');
            setAttendanceData([]);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    // admin → selected date (use API data)
    const adminData = useMemo(() => {
        if (isAdmin && attendanceData) {
            // Map API response to display format
            const mapped = attendanceData.map(record => {
                const startTime = record.start_time ? new Date(record.start_time) : null;
                const endTime = record.end_time ? new Date(record.end_time) : null;
                const workHours = record.work_hours ? parseFloat(record.work_hours) : 0;
                const extraHours = record.extra_hours ? parseFloat(record.extra_hours) : 0;
                
                // Get current status from employeeStatuses
                const statusInfo = employeeStatuses[record.emp_id];
                let currentStatus = 'UNKNOWN';
                if (statusInfo) {
                    currentStatus = statusInfo.status_description || 
                        (statusInfo.current_status === 0 ? 'Checked Out' : 
                         statusInfo.current_status === 1 ? 'Checked In' : 
                         statusInfo.current_status === 2 ? 'On Leave' : 'Unknown');
                }
                
                return {
                    empId: record.emp_id,
                    name: record.employee_name,
                    date: record.date,
                    checkIn: startTime ? startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                    checkOut: endTime ? endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                    breakMin: 0, // Not provided in API
                    workHrs: workHours.toFixed(1),
                    extraHrs: extraHours.toFixed(1),
                    status: record.on_leave ? 'ON LEAVE' : 'PRESENT',
                    currentStatus: currentStatus,
                    currentStatusCode: statusInfo?.current_status,
                    department: record.department
                };
            });
            
            // Apply search filter
            return mapped.filter(a => 
                a.name.toLowerCase().includes(q.toLowerCase()) ||
                a.department.toLowerCase().includes(q.toLowerCase())
            );
        }
        
        return [];
    }, [isAdmin, attendanceData, q, employeeStatuses]);

    // employee → selected month (use API data)
    const empData = useMemo(() => {
        if (!isAdmin && attendanceData) {
            // Map API response to display format
            return attendanceData.map(record => {
                const startTime = record.start_time ? new Date(record.start_time) : null;
                const endTime = record.end_time ? new Date(record.end_time) : null;
                const workHours = record.work_hours ? parseFloat(record.work_hours) : 0;
                const extraHours = record.extra_hours ? parseFloat(record.extra_hours) : 0;
                
                return {
                    empId: record.emp_id,
                    name: record.employee_name,
                    date: record.date,
                    checkIn: startTime ? startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                    checkOut: endTime ? endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                    breakMin: 0, // Not provided in API
                    workHrs: workHours.toFixed(1),
                    extraHrs: extraHours.toFixed(1),
                    status: record.on_leave ? 'ON LEAVE' : 'PRESENT'
                };
            });
        }
        
        return [];
    }, [isAdmin, attendanceData]);

    const dispData = isAdmin ? adminData : empData;

    const moveDay = dir => {
        const d = new Date(selDate);
        d.setDate(d.getDate() + dir);
        setSelDate(d);
    };

    const moveMonth = dir => {
        const d = new Date(selDate);
        d.setMonth(d.getMonth() + dir);
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
                        {isAdmin ? (
                            <>
                                <button onClick={() => moveDay(-1)} className="px-3 py-2 bg-white border rounded-lg hover:bg-slate-50">←</button>
                                <input
                                    type="date"
                                    value={selDateStr}
                                    onChange={e => setSelDate(new Date(e.target.value))}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <button onClick={() => moveDay(1)} className="px-3 py-2 bg-white border rounded-lg hover:bg-slate-50">→</button>
                                <input
                                    placeholder="Search employee"
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                    className="ml-2 px-3 py-2 border rounded-lg"
                                />
                            </>
                        ) : (
                            <>
                                <button onClick={() => moveMonth(-1)} className="px-3 py-2 bg-white border rounded-lg hover:bg-slate-50">←</button>
                                <input
                                    type="month"
                                    value={selDate.toISOString().slice(0, 7)}
                                    onChange={e => setSelDate(new Date(e.target.value + '-01'))}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <button onClick={() => moveMonth(1)} className="px-3 py-2 bg-white border rounded-lg hover:bg-slate-50">→</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Context */}
                <p className="mb-4 text-slate-600">
                    {isAdmin
                        ? `Attendance for ${selDate.toDateString()}`
                        : `Attendance for ${selDate.toLocaleString("default", { month: "long", year: "numeric" })}`}
                </p>

                {/* Summary for Admin */}
                {isAdmin && adminSummary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">Total Employees</p>
                            <p className="text-2xl font-bold text-slate-700">{adminSummary.total_employees}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">Present</p>
                            <p className="text-2xl font-bold text-green-600">{adminSummary.present_count}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">On Leave</p>
                            <p className="text-2xl font-bold text-orange-600">{adminSummary.on_leave_count}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">Absent</p>
                            <p className="text-2xl font-bold text-red-600">{adminSummary.absent_count}</p>
                        </div>
                    </div>
                )}

                {/* Summary for Employee */}
                {!isAdmin && summary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">Present Days</p>
                            <p className="text-2xl font-bold text-green-600">{summary.present_days}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">Leave Taken</p>
                            <p className="text-2xl font-bold text-orange-600">{summary.leave_count}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">Leave Left</p>
                            <p className="text-2xl font-bold text-blue-600">{summary.leave_left}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-slate-600">Total Work Days</p>
                            <p className="text-2xl font-bold text-slate-700">{summary.tot_work_days}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-slate-600">Loading attendance data...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Table */}
                {!loading && (
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
                                {isAdmin && <th className="px-4 py-3">Current Status</th>}
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
                                        {isAdmin && (
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    a.currentStatusCode === 0 ? 'bg-slate-100 text-slate-700' :
                                                    a.currentStatusCode === 1 ? 'bg-green-100 text-green-700' :
                                                    a.currentStatusCode === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {a.currentStatus}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? 8 : 7} className="py-8 text-center text-slate-500">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                )}

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
