import { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle, Search, Filter, Calendar, User } from 'lucide-react';

export default function AdminLeaveManagement() {
  // Sample data - in real app, this would come from backend API
  const [leaves, setLeaves] = useState([
    { 
      id: 1, 
      employee: 'John Smith', 
      employeeId: 'EMP001',
      department: 'Engineering',
      type: 'Paid', 
      startDate: '2026-01-15', 
      endDate: '2026-01-17', 
      days: 3,
      remarks: 'Family vacation', 
      status: 'Pending',
      appliedDate: '2026-01-05',
      adminComment: '' 
    },
    { 
      id: 2, 
      employee: 'Sarah Johnson', 
      employeeId: 'EMP002',
      department: 'Marketing',
      type: 'Sick', 
      startDate: '2026-01-20', 
      endDate: '2026-01-22', 
      days: 3,
      remarks: 'Medical checkup', 
      status: 'Pending',
      appliedDate: '2026-01-03',
      adminComment: '' 
    },
    { 
      id: 3, 
      employee: 'Mike Chen', 
      employeeId: 'EMP003',
      department: 'Sales',
      type: 'Unpaid', 
      startDate: '2026-02-10', 
      endDate: '2026-02-12', 
      days: 3,
      remarks: 'Personal matters', 
      status: 'Pending',
      appliedDate: '2026-01-02',
      adminComment: '' 
    },
    { 
      id: 4, 
      employee: 'Emily Davis', 
      employeeId: 'EMP004',
      department: 'HR',
      type: 'Sick', 
      startDate: '2025-12-20', 
      endDate: '2025-12-21', 
      days: 2,
      remarks: 'Flu symptoms', 
      status: 'Approved',
      appliedDate: '2025-12-15',
      adminComment: 'Get well soon!' 
    },
    { 
      id: 5, 
      employee: 'David Wilson', 
      employeeId: 'EMP005',
      department: 'Finance',
      type: 'Paid', 
      startDate: '2025-12-25', 
      endDate: '2025-12-30', 
      days: 6,
      remarks: 'Year-end holidays', 
      status: 'Approved',
      appliedDate: '2025-12-01',
      adminComment: 'Approved for year-end break' 
    },
    { 
      id: 6, 
      employee: 'Lisa Anderson', 
      employeeId: 'EMP006',
      department: 'Engineering',
      type: 'Paid', 
      startDate: '2025-11-15', 
      endDate: '2025-11-16', 
      days: 2,
      remarks: 'Personal work', 
      status: 'Rejected',
      appliedDate: '2025-11-10',
      adminComment: 'Critical project deadline approaching' 
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [adminComments, setAdminComments] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Handle approval/rejection
  const handleAction = (leaveId, action) => {
    setLeaves(leaves.map(leave => {
      if (leave.id === leaveId) {
        return {
          ...leave,
          status: action,
          adminComment: adminComments[leaveId] || ''
        };
      }
      return leave;
    }));
    
    setAdminComments({ ...adminComments, [leaveId]: '' });
    setSelectedLeave(null);
    
    // In real app, send to backend API
    // await fetch('/api/leaves/update', { method: 'POST', body: { leaveId, status: action, comment } });
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

          {filteredLeaves.length === 0 ? (
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
                        <button
                          onClick={() => setSelectedLeave(leave.id === selectedLeave ? null : leave.id)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                        >
                          {selectedLeave === leave.id ? 'Close' : 'Take Action'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Panel (shown when selected) */}
                  {selectedLeave === leave.id && leave.status === 'Pending' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Add Comment (Optional)
                      </label>
                      <textarea
                        value={adminComments[leave.id] || ''}
                        onChange={(e) => setAdminComments({ ...adminComments, [leave.id]: e.target.value })}
                        rows="3"
                        placeholder="Add your comment or reason for approval/rejection..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none mb-4"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(leave.id, 'Approved')}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Approve Leave
                        </button>
                        <button
                          onClick={() => handleAction(leave.id, 'Rejected')}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject Leave
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}