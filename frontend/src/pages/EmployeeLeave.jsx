import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, Plus, User, FileText } from 'lucide-react';
import EmployeeNav from '../components/EmployeeNav';
import api from '../utils/api';
import MyToast from '../components/MyToast';

export default function EmployeeLeave() {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [filterStatus, setFilterStatus] = useState('All');

    const [newLeave, setNewLeave] = useState({
        type: 'Paid',
        startDate: '',
        endDate: '',
        remarks: ''
    });

    // Fetch employee leave requests
    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await api.get('/leaves/emp');
            const data = response.data;
            
            // Map API response to component format
            const mappedLeaves = (data.leaves || []).map(leave => ({
                id: leave.leave_id,
                type: leave.leave_type,
                startDate: leave.start_date,
                endDate: leave.end_date,
                days: calculateDays(leave.start_date, leave.end_date),
                status: 'Pending',
                appliedDate: leave.start_date, // Using start_date as applied date for now
                remarks: '',
                adminComment: ''
            }));
            
            setLeaves(mappedLeaves);
        } catch (err) {
            console.error('Error fetching leaves:', err);
            setError(err.response?.data?.message || 'Failed to fetch leave requests');
            setToast({
                show: true,
                message: err.response?.data?.message || 'Failed to fetch leave requests',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateDays = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const handleSubmitLeave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const leaveData = {
                start_date: newLeave.startDate,
                end_date: newLeave.endDate,
                leave_type: newLeave.type
            };
            
            await api.post('/leaves/request', leaveData);
            
            setToast({
                show: true,
                message: 'Leave request submitted successfully!',
                type: 'success'
            });
            
            // Reset form and close modal
            setNewLeave({ type: 'Paid', startDate: '', endDate: '', remarks: '' });
            setShowApplyForm(false);
            
            // Refresh leave list
            fetchLeaves();
        } catch (err) {
            console.error('Error submitting leave:', err);
            setToast({
                show: true,
                message: err.response?.data?.message || 'Failed to submit leave request',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const stats = {
        pending: leaves.filter(l => l.status === 'Pending').length,
        approved: leaves.filter(l => l.status === 'Approved').length,
        rejected: leaves.filter(l => l.status === 'Rejected').length,
        total: leaves.length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50" onClick={() => setShowProfileMenu(false)}>
            {toast.show && (
                <MyToast 
                    show={toast.show}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
            <EmployeeNav 
                showProfileMenu={showProfileMenu} 
                setShowProfileMenu={setShowProfileMenu}
            />
            
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 mt-8">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                                <Calendar className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">My Leave Requests</h1>
                                <p className="text-gray-600">View your leave history and apply for new leave</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowApplyForm(!showApplyForm);
                            }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Apply for Leave
                        </button>
                    </div>
                </div>

                {/* Apply Leave Form */}
                {showApplyForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowApplyForm(false)}>
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full border-2 border-purple-200" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-purple-600" />
                                Apply for New Leave
                            </h2>
                            <form onSubmit={handleSubmitLeave}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Leave Type
                                        </label>
                                        <select
                                            value={newLeave.type}
                                            onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                            required
                                            disabled={loading}
                                        >
                                            <option value="Paid">Paid Leave</option>
                                            <option value="Sick">Sick Leave</option>
                                            <option value="Casual">Casual Leave</option>
                                            <option value="Unpaid">Unpaid Leave</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Duration: {calculateDays(newLeave.startDate, newLeave.endDate)} days
                                        </label>
                                        <div className="text-sm text-gray-500">
                                            Calculated from start to end date
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newLeave.startDate}
                                            onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                            required
                                            disabled={loading}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newLeave.endDate}
                                            onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                            required
                                            disabled={loading}
                                            min={newLeave.startDate || new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Leave Request'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowApplyForm(false)}
                                        disabled={loading}
                                        className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">Total Requests</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-blue-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-yellow-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold mb-1">Rejected</p>
                                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                            <XCircle className="w-10 h-10 text-red-500 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700">Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Leave History */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            My Leave History ({leaves.filter(l => filterStatus === 'All' || l.status === filterStatus).length})
                        </h2>
                    </div>

                    {loading && !leaves.length ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                            <p className="text-gray-600">Loading leave requests...</p>
                        </div>
                    ) : leaves.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-lg">No leave requests found</p>
                            <p className="text-sm mt-2">Click "Apply for Leave" to create your first request</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {leaves
                                .filter(l => filterStatus === 'All' || l.status === filterStatus)
                                .map((leave) => (
                                <div
                                    key={leave.id}
                                    className={`p-6 hover:bg-gray-50 transition-colors ${
                                        leave.status === 'Pending' ? 'bg-yellow-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Leave Details */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Calendar className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{leave.type} Leave</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Applied on {new Date(leave.appliedDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                                    <p className="text-sm font-semibold text-gray-800">{leave.days} days</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {new Date(leave.startDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {new Date(leave.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Remarks */}
                                            {leave.remarks && (
                                                <div className="mb-3">
                                                    <p className="text-xs text-gray-500 mb-1">Your Remarks</p>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                        {leave.remarks}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Admin Comment */}
                                            {leave.adminComment && (
                                                <div className="mb-3">
                                                    <p className="text-xs text-gray-500 mb-1">Admin Response</p>
                                                    <p className="text-sm text-purple-900 bg-purple-50 p-3 rounded-lg">
                                                        {leave.adminComment}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        <div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(leave.status)}`}>
                                                {getStatusIcon(leave.status)}
                                                {leave.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
