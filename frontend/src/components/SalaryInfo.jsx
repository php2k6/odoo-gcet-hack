import React from 'react';
import { User, Calendar, FileText, LogOut, Edit, Plus, Bell, TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function SalaryInfo() {
    const salaryData = {
        monthWage: 50000,
        yearlyWage: 600000,
        workingDaysPerWeek: 5,
        breakTimeHours: 1,
        components: [
            { name: 'Basic Salary', amount: 25000, percentage: 50, description: 'Before Basic Salary from company cost compute it based on monthly Wages' },
            { name: 'House Rent Allowance', amount: 12500, percentage: 50, description: 'HRA provided to employees 50% of the basic salary' },
            { name: 'Standard Allowance', amount: 4167, percentage: 16.67, description: 'A standard allowance is a predetermined, fixed amount provided to employee as part of their basic salary' },
            { name: 'Performance Bonus', amount: 2092.50, percentage: 9.33, description: 'Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary' },
            { name: 'Leave Travel Allowance', amount: 2092.50, percentage: 9.33, description: 'LTA is paid by the company to employees to cover their travel expenses, and calculated as a % of the basic salary' },
            { name: 'Fixed Allowance', amount: 2918, percentage: 11.67, description: 'Fixed allowance portion of wages is determined after calculating all salary components' }
        ],
        providentFund: {
            employee: 3000,
            employer: 3000,
            percentageEmployee: 12,
            percentageEmployer: 12
        },
        taxDeductions: {
            professionalTax: 200
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-100 text-sm font-medium">Month Wage</p>
                        <DollarSign className="w-5 h-5 text-blue-200" />
                    </div>
                    <p className="text-3xl font-bold">₹{salaryData.monthWage.toLocaleString()}</p>
                    <p className="text-blue-100 text-sm mt-1">/ Month</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-green-100 text-sm font-medium">Yearly Wage</p>
                        <TrendingUp className="w-5 h-5 text-green-200" />
                    </div>
                    <p className="text-3xl font-bold">₹{salaryData.yearlyWage.toLocaleString()}</p>
                    <p className="text-green-100 text-sm mt-1">/ Yearly</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-purple-100 text-sm font-medium">Working Days</p>
                        <Calendar className="w-5 h-5 text-purple-200" />
                    </div>
                    <p className="text-3xl font-bold">{salaryData.workingDaysPerWeek}</p>
                    <p className="text-purple-100 text-sm mt-1">days per week</p>
                    <p className="text-purple-100 text-xs mt-2">Break Time: {salaryData.breakTimeHours} hrs</p>
                </div>
            </div>

            {/* Salary Components */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">Salary Components</h3>
                </div>
                <div className="p-6 space-y-4">
                    {salaryData.components.map((component, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg">{component.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{component.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-3">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                                        <p className="text-2xl font-bold text-gray-900">₹{component.amount.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 mt-1">₹ / month</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end mb-1">
                                        <Percent className="w-4 h-4 text-blue-600 mr-1" />
                                        <p className="text-2xl font-bold text-blue-600">{component.percentage}%</p>
                                    </div>
                                    <p className="text-xs text-gray-500">of basic salary</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Provident Fund & Tax Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Provident Fund */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white">Provident Fund (PF) Contribution</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-indigo-900">Employee Contribution</p>
                                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                                    {salaryData.providentFund.percentageEmployee}%
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-indigo-900">₹{salaryData.providentFund.employee.toLocaleString()}</p>
                            <p className="text-sm text-indigo-600 mt-1">₹ / month</p>
                            <p className="text-xs text-gray-600 mt-2">PF is calculated based on the basic salary</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-green-900">Employer Contribution</p>
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                                    {salaryData.providentFund.percentageEmployer}%
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-green-900">₹{salaryData.providentFund.employer.toLocaleString()}</p>
                            <p className="text-sm text-green-600 mt-1">₹ / month</p>
                            <p className="text-xs text-gray-600 mt-2">PF is calculated based on the basic salary</p>
                        </div>
                    </div>
                </div>

                {/* Tax Deductions */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white">Tax Deductions</h3>
                    </div>
                    <div className="p-6">
                        <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-red-900">Professional Tax</p>
                            </div>
                            <p className="text-3xl font-bold text-red-900">₹{salaryData.taxDeductions.professionalTax.toLocaleString()}</p>
                            <p className="text-sm text-red-600 mt-1">₹ / month</p>
                            <p className="text-xs text-gray-600 mt-3">Professional Tax deducted from the Gross salary</p>
                        </div>

                        {/* Net Salary Summary */}
                        <div className="mt-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-5 text-white">
                            <p className="text-sm text-emerald-100 mb-2">Net Monthly Salary</p>
                            <p className="text-4xl font-bold">₹{(salaryData.monthWage - salaryData.providentFund.employee - salaryData.taxDeductions.professionalTax).toLocaleString()}</p>
                            <p className="text-sm text-emerald-100 mt-2">Take home after deductions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Pay Slips */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">Recent Pay Slips</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {['December 2024', 'November 2024', 'October 2024'].map((month, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{month}</p>
                                        <p className="text-sm text-gray-500">Salary Statement</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm">
                                    Download PDF
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
