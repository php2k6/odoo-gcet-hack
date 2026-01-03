import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle, Search, Filter, Calendar, User } from 'lucide-react';
import EmployeeNav from '../components/EmployeeNav';
import api from '../utils/api';
import MyToast from '../components/MyToast';

export default function AdminLeaveManagement() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [adminComments, setAdminComments] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Fetch admin leave requests
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/leaves/admin');
      const data = response.data;
      
      // Map API response to component format
      const mappedLeaves = (data.leaves || []).map(leave => {
        const calculateDays = (start, end) => {
          if (!start || !end) return 0;
          const startDate = new Date(start);
          const endDate = new Date(end);
          const diffTime = Math.abs(endDate - startDate);
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        };
        
        return {
          id: leave.leave_id,
          employee: leave.emp_id, // Will need employee name from another endpoint
          employeeId: leave.emp_id,
          department: '',
          type: leave.leave_type,
          startDate: leave.start_date,
          endDate: leave.end_date,
          days: calculateDays(leave.start_date, leave.end_date),
          status: 'Pending',
          appliedDate: leave.start_date,
          remarks: '',
          adminComment: ''
        };
      });
      
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

  // Handle approval/rejection
  const handleAction = async (leaveId, action) => {
    setLoading(true);
    
    try {
      if (action === 'Approved') {
        // Call approve endpoint
        await api.put(`/leaves/${leaveId}/approve`);
        
        setToast({
          show: true,
          message: 'Leave request approved successfully!',
          type: 'success'
        });
      } else if (action === 'Rejected') {
        // Call reject endpoint (deletes the record)
        await api.delete(`/leaves/${leaveId}/reject`);
        
        setToast({
          show: true,
          message: 'Leave request rejected and removed!',
          type: 'success'
        });
      }
      
      // Remove the leave card from local state immediately
      setLeaves(prevLeaves => prevLeaves.filter(leave => leave.id !== leaveId));
      
      // Clear comment and close panel
      setAdminComments({ ...adminComments, [leaveId]: '' });
      setSelectedLeave(null);
    } catch (err) {
      console.error('Error updating leave:', err);
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to update leave request',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || leave.status === filterStatus;
    const matchesType = filterType === 'All' || leave.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {toast.show && (
        <MyToast 
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      <EmployeeNav showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Admin/HR Leave Management</h1>
              <p className="text-gray-600">Review and manage all employee leave requests</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Filter & Search</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              <option value="All">All Types</option>
              <option value="Paid">Paid Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Leave Requests ({filteredLeaves.length})
            </h2>
          </div>

          {loading && !leaves.length ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600">Loading leave requests...</p>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No leave requests found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    leave.status === 'Pending' ? 'bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Employee Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{leave.employee}</h3>
                          <p className="text-sm text-gray-600">{leave.employeeId} • {leave.department}</p>
                        </div>
                      </div>

                      {/* Leave Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Leave Type</p>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                            {leave.type}
                          </span>
                        </div>
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
                          <p className="text-xs text-gray-500 mb-1">Employee Remarks</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {leave.remarks}
                          </p>
                        </div>
                      )}

                      {/* Admin Comment (if exists) */}
                      {leave.adminComment && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Admin Comment</p>
                          <p className="text-sm text-purple-900 bg-purple-50 p-3 rounded-lg">
                            {leave.adminComment}
                          </p>
                        </div>
                      )}

                      {/* Applied Date */}
                      <p className="text-xs text-gray-500">
                        Applied on: {new Date(leave.appliedDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(leave.status)}`}>
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </span>

                      {leave.status === 'Pending' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAction(leave.id, 'Approved')}
                            disabled={loading}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(leave.id, 'Rejected')}
                            disabled={loading}
                            className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Panel (shown when selected) - Removed */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}