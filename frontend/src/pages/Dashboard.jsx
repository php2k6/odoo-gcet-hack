import React, { useState, useEffect } from 'react';
import { Search, Plane, XCircle, User, Calendar, FileText, LogOut, Bell, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmployeeNav from '../components/EmployeeNav.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

// Main Dashboard Component
export default function Dashboard() {
  // Get user role from context
  const { userRole, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState('employees');
  const [showNotifications, setShowNotifications] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch employees from API when component mounts (admin only)
  useEffect(() => {
    if (userRole === 'admin') {
      fetchEmployees();
    }
  }, [userRole]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/employees');
      const fetchedEmployees = response.data.employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.job_position || 'Employee',
        department: emp.department || 'General',
        email: emp.email,
        phone: emp.phone || 'N/A',
        status: getStatusFromCode(emp.current_status),
        joinDate: 'N/A', // Not provided in API
        manager: emp.manager || 'N/A',
        location: emp.location || 'N/A',
        profPic: emp.prof_pic || null
      }));
      setEmployees(fetchedEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Map current_status code to status string
  const getStatusFromCode = (statusCode) => {
    switch(statusCode) {
      case 0:
        return 'absent';
      case 1:
        return 'present';
      case 2:
        return 'leave';
      default:
        return 'absent';
    }
  };

  // Sample employee data
  const sampleEmployees = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Developer', department: 'Engineering', email: 'sarah.j@company.com', phone: '+1 234-567-8901', status: 'present', joinDate: '2022-01-15' },
    { id: 2, name: 'Michael Chen', role: 'Product Manager', department: 'Product', email: 'michael.c@company.com', phone: '+1 234-567-8902', status: 'leave', joinDate: '2021-06-20' },
    { id: 3, name: 'Emily Davis', role: 'UX Designer', department: 'Design', email: 'emily.d@company.com', phone: '+1 234-567-8903', status: 'absent', joinDate: '2023-03-10' },
    { id: 4, name: 'James Wilson', role: 'Backend Developer', department: 'Engineering', email: 'james.w@company.com', phone: '+1 234-567-8904', status: 'present', joinDate: '2022-08-05' },
    { id: 5, name: 'Lisa Anderson', role: 'Marketing Lead', department: 'Marketing', email: 'lisa.a@company.com', phone: '+1 234-567-8905', status: 'present', joinDate: '2021-11-30' },
    { id: 6, name: 'David Brown', role: 'HR Manager', department: 'Human Resources', email: 'david.b@company.com', phone: '+1 234-567-8906', status: 'leave', joinDate: '2020-04-15' },
    { id: 7, name: 'Jessica Martinez', role: 'Frontend Developer', department: 'Engineering', email: 'jessica.m@company.com', phone: '+1 234-567-8907', status: 'present', joinDate: '2023-01-20' },
    { id: 8, name: 'Robert Taylor', role: 'Sales Director', department: 'Sales', email: 'robert.t@company.com', phone: '+1 234-567-8908', status: 'absent', joinDate: '2019-09-12' },
    { id: 9, name: 'Amanda White', role: 'Data Analyst', department: 'Analytics', email: 'amanda.w@company.com', phone: '+1 234-567-8909', status: 'present', joinDate: '2022-05-18' },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present':
        return <div className="w-3 h-3 bg-green-500 rounded-full" title="Present in office"></div>;
      case 'leave':
        return <Plane className="w-4 h-4 text-blue-500" title="On leave" />;
      case 'absent':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Absent"></div>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'present':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Present</span>;
      case 'leave':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">On Leave</span>;
      case 'absent':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Absent</span>;
      default:
        return null;
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeEmployeeView = () => {
    setSelectedEmployee(null);
  };

  // Employee Dashboard Data
  const quickAccessCards = [
    { icon: User, label: 'Profile', color: 'from-blue-500 to-blue-600', action: 'profile', path: '/employee/profile' },
    { icon: Calendar, label: 'Attendance', color: 'from-green-500 to-green-600', action: 'attendance', path: '/employee/attendance' },
    { icon: FileText, label: 'Leave Requests', color: 'from-purple-500 to-purple-600', action: 'leave', path: '/employee/leave' },
    { icon: LogOut, label: 'Logout', color: 'from-red-500 to-red-600', action: 'logout', path: null }
  ];

  const recentActivity = [
    { text: 'Leave request approved', time: '2 hours ago', type: 'success' },
    { text: 'New salary slip available', time: '1 day ago', type: 'info' },
    { text: 'Profile updated successfully', time: '3 days ago', type: 'success' }
  ];

  // Admin View
  const renderAdminView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" onClick={() => setShowProfileMenu(false)}>
      {/* Navbar */}
      <EmployeeNav 
        showProfileMenu={showProfileMenu} 
        setShowProfileMenu={setShowProfileMenu}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Description */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Directory</h2>
          <p className="text-gray-600">View and manage employee information, attendance, and status</p>
        </div>

        {/* Search and View Button */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button 
            onClick={fetchEmployees}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'LOADING...' : 'REFRESH'}
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search employees by name, role, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 shadow-sm"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Status Legend */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Status Legend:</h3>
            {employees.length > 0 && (
              <span className="text-sm text-gray-600">Total: {employees.length} employees</span>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Present in Office</span>
            </div>
            <div className="flex items-center space-x-2">
              <Plane className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">On Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Absent (No Time-off Applied)</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={fetchEmployees}
              className="mt-2 text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading employees...</p>
          </div>
        )}

        {/* Employee Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleCardClick(employee)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {employee.profPic ? (
                      <img 
                        src={employee.profPic} 
                        alt={employee.name}
                        className="w-20 h-20 rounded-lg object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full">
                      {getStatusIcon(employee.status)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{employee.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{employee.role}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{employee.department}</span>
                    {getStatusBadge(employee.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredEmployees.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {employees.length === 0 ? 'No employees found.' : 'No employees found matching your search.'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeEmployeeView}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Employee Information</h2>
                  <p className="text-purple-100 text-sm mt-1">View-only mode</p>
                </div>
                <button
                  onClick={closeEmployeeView}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition duration-200"
                >
                  <XCircle className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="flex items-start space-x-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedEmployee.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedEmployee.role}</p>
                  {getStatusBadge(selectedEmployee.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Department Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium text-gray-900">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium text-gray-900">{selectedEmployee.role}</span>
                    </div>
                    {selectedEmployee.manager && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manager:</span>
                        <span className="font-medium text-gray-900">{selectedEmployee.manager}</span>
                      </div>
                    )}
                    {selectedEmployee.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900">{selectedEmployee.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Employment Details</h4>
                  <div className="space-y-2">
                    {selectedEmployee.joinDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Join Date:</span>
                        <span className="font-medium text-gray-900">{selectedEmployee.joinDate}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900 capitalize">{selectedEmployee.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  to={`/profile?id=${selectedEmployee.id}`}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-md flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Full Profile
                </Link>
                <button
                  onClick={closeEmployeeView}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition duration-200 shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Employee View
  const renderEmployeeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" onClick={() => setShowProfileMenu(false)}>
      {/* Navbar */}
      <EmployeeNav 
        showProfileMenu={showProfileMenu} 
        setShowProfileMenu={setShowProfileMenu}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickAccessCards.map((card, index) => (
            card.path ? (
              <Link
                key={index}
                to={card.path}
                className={`p-6 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center`}
              >
                <card.icon className="w-8 h-8 mb-2" />
                <span className="text-lg font-semibold">{card.label}</span>
              </Link>
            ) : (
              <button
                key={index}
                className={`p-6 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center`}
              >
                <card.icon className="w-8 h-8 mb-2" />
                <span className="text-lg font-semibold">{card.label}</span>
              </button>
            )
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Leaves</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+2 from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">98%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">Excellent performance</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.text}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  // Render based on user role
  return userRole === 'admin' ? renderAdminView() : renderEmployeeView();

}