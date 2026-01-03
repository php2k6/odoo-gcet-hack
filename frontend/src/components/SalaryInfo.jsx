import React from 'react';
import { Calendar, FileText, TrendingUp, DollarSign, Percent, Edit, Save, X } from 'lucide-react';

export default function SalaryInfo({ 
    isAdmin, 
    salaryData, 
    isEditing, 
    onEdit, 
    onSave, 
    onCancel, 
    editableData, 
    onFieldChange,
    isLoading 
}) {
    isLoading 
}) {
    // Use provided salaryData or fallback to demo data
    const defaultSalaryData = {
        monthly_wage: 50000,
        yearly_wage: 600000,
        basic_sal: 25000,
        hra: 12500,
        sa: 4167,
        perf_bonus: 2092.50,
        ita: 2092.50,
        fa: 2918,
        pf1: 3000,
        pf2: 3000,
        prof_tax: 200
    };

    const displayData = isEditing ? editableData : (salaryData || defaultSalaryData);

    return (
        <div className="space-y-6">
            {/* Admin Edit/Save Buttons */}
            {isAdmin && onEdit && (
                <div className="flex justify-end gap-2 mb-6">
                    {!isEditing ? (
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-md flex items-center"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Salary
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onSave}
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-200 shadow-md flex items-center disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isLoading ? 'Saving...' : 'Save Salary'}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition duration-200 shadow-md flex items-center disabled:opacity-50"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            )}
            
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-100 text-sm font-medium">Month Wage</p>
                        <DollarSign className="w-5 h-5 text-blue-200" />
                    </div>
                    {isEditing ? (
                        <input
                            type="number"
                            value={editableData.monthly_wage || 0}
                            onChange={(e) => onFieldChange('monthly_wage', e.target.value)}
                            className="w-full px-3 py-2 text-3xl font-bold bg-blue-400 text-white border-2 border-white rounded-lg"
                        />
                    ) : (
                        <p className="text-3xl font-bold">₹{(displayData.monthly_wage || 0).toLocaleString()}</p>
                    )}
                    <p className="text-blue-100 text-sm mt-1">/ Month</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-green-100 text-sm font-medium">Yearly Wage</p>
                        <TrendingUp className="w-5 h-5 text-green-200" />
                    </div>
                    {isEditing ? (
                        <input
                            type="number"
                            value={editableData.yearly_wage || 0}
                            onChange={(e) => onFieldChange('yearly_wage', e.target.value)}
                            className="w-full px-3 py-2 text-3xl font-bold bg-green-400 text-white border-2 border-white rounded-lg"
                        />
                    ) : (
                        <p className="text-3xl font-bold">₹{(displayData.yearly_wage || 0).toLocaleString()}</p>
                    )}
                    <p className="text-green-100 text-sm mt-1">/ Yearly</p>
                </div>
            </div>

            {/* Salary Components */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">Salary Components</h3>
                </div>
                <div className="p-6 space-y-4">
                    {/* Basic Salary */}
                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">Basic Salary</h4>
                                <p className="text-sm text-gray-500 mt-1">Before Basic Salary from company cost compute it based on monthly Wages</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-3">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editableData.basic_sal || 0}
                                            onChange={(e) => onFieldChange('basic_sal', e.target.value)}
                                            className="w-32 px-2 py-1 text-2xl font-bold text-gray-900 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">₹{(displayData.basic_sal || 0).toLocaleString()}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">₹ / month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HRA */}
                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">House Rent Allowance (HRA)</h4>
                                <p className="text-sm text-gray-500 mt-1">HRA provided to employees</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-3">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editableData.hra || 0}
                                            onChange={(e) => onFieldChange('hra', e.target.value)}
                                            className="w-32 px-2 py-1 text-2xl font-bold text-gray-900 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">₹{(displayData.hra || 0).toLocaleString()}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">₹ / month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Standard Allowance */}
                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">Standard Allowance (SA)</h4>
                                <p className="text-sm text-gray-500 mt-1">Fixed standard allowance</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-3">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editableData.sa || 0}
                                            onChange={(e) => onFieldChange('sa', e.target.value)}
                                            className="w-32 px-2 py-1 text-2xl font-bold text-gray-900 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">₹{(displayData.sa || 0).toLocaleString()}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">₹ / month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Bonus */}
                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">Performance Bonus</h4>
                                <p className="text-sm text-gray-500 mt-1">Variable amount based on performance</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-3">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editableData.perf_bonus || 0}
                                            onChange={(e) => onFieldChange('perf_bonus', e.target.value)}
                                            className="w-32 px-2 py-1 text-2xl font-bold text-gray-900 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">₹{(displayData.perf_bonus || 0).toLocaleString()}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">₹ / month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ITA - Leave Travel Allowance */}
                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">Leave Travel Allowance (ITA)</h4>
                                <p className="text-sm text-gray-500 mt-1">LTA for travel expenses</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-3">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editableData.ita || 0}
                                            onChange={(e) => onFieldChange('ita', e.target.value)}
                                            className="w-32 px-2 py-1 text-2xl font-bold text-gray-900 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">₹{(displayData.ita || 0).toLocaleString()}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">₹ / month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Allowance */}
                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">Fixed Allowance (FA)</h4>
                                <p className="text-sm text-gray-500 mt-1">Fixed allowance portion</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-3">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editableData.fa || 0}
                                            onChange={(e) => onFieldChange('fa', e.target.value)}
                                            className="w-32 px-2 py-1 text-2xl font-bold text-gray-900 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">₹{(displayData.fa || 0).toLocaleString()}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">₹ / month</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                <p className="text-sm font-medium text-indigo-900">Employee Contribution (PF1)</p>
                            </div>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editableData.pf1 || 0}
                                    onChange={(e) => onFieldChange('pf1', e.target.value)}
                                    className="w-full px-3 py-2 text-3xl font-bold text-indigo-900 border border-indigo-300 rounded"
                                />
                            ) : (
                                <p className="text-3xl font-bold text-indigo-900">₹{(displayData.pf1 || 0).toLocaleString()}</p>
                            )}
                            <p className="text-sm text-indigo-600 mt-1">₹ / month</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-green-900">Employer Contribution (PF2)</p>
                            </div>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editableData.pf2 || 0}
                                    onChange={(e) => onFieldChange('pf2', e.target.value)}
                                    className="w-full px-3 py-2 text-3xl font-bold text-green-900 border border-green-300 rounded"
                                />
                            ) : (
                                <p className="text-3xl font-bold text-green-900">₹{(displayData.pf2 || 0).toLocaleString()}</p>
                            )}
                            <p className="text-sm text-green-600 mt-1">₹ / month</p>
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
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editableData.prof_tax || 0}
                                    onChange={(e) => onFieldChange('prof_tax', e.target.value)}
                                    className="w-full px-3 py-2 text-3xl font-bold text-red-900 border border-red-300 rounded"
                                />
                            ) : (
                                <p className="text-3xl font-bold text-red-900">₹{(displayData.prof_tax || 0).toLocaleString()}</p>
                            )}
                            <p className="text-sm text-red-600 mt-1">₹ / month</p>
                            <p className="text-xs text-gray-600 mt-3">Professional Tax deducted from the Gross salary</p>
                        </div>

                        {/* Net Salary Summary */}
                        <div className="mt-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-5 text-white">
                            <p className="text-sm text-emerald-100 mb-2">Net Monthly Salary</p>
                            <p className="text-4xl font-bold">
                                ₹{((displayData.monthly_wage || 0) - (displayData.pf1 || 0) - (displayData.prof_tax || 0)).toLocaleString()}
                            </p>
                            <p className="text-sm text-emerald-100 mt-2">Take home after deductions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Pay Slips - Only show for employees */}
            {!isAdmin && (
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
            )}
        </div>
    );
}
