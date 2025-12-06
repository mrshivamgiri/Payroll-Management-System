import React, { useState, useEffect } from 'react'
import { salaryAPI } from '../api'
import api from '../api'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([])
  const [salarySlips, setSalarySlips] = useState([])
  const [expenses, setExpenses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    user_id: '',
    month: '',
    base_salary: '',
    bonus: 0,
    deductions: 0,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('slips')

  useEffect(() => {
    fetchEmployees()
    fetchSalarySlips()
    fetchExpenses()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/users')
      setEmployees(response.data.filter(u => u.role === 'employee'))
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const fetchSalarySlips = async () => {
    try {
      const response = await api.get('/salary-slip-all')
      setSalarySlips(response.data)
    } catch (error) {
      console.error('Error fetching salary slips:', error)
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses-all')
      setExpenses(response.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await salaryAPI.update(editingId, {
          month: formData.month,
          base_salary: parseFloat(formData.base_salary),
          bonus: parseFloat(formData.bonus),
          deductions: parseFloat(formData.deductions),
        })
        setMessage('Salary slip updated successfully!')
      } else {
        await salaryAPI.create(
          parseInt(formData.user_id),
          formData.month,
          parseFloat(formData.base_salary),
          parseFloat(formData.bonus),
          parseFloat(formData.deductions)
        )
        setMessage('Salary slip created successfully!')
      }
      setFormData({ user_id: '', month: '', base_salary: '', bonus: 0, deductions: 0 })
      setEditingId(null)
      setShowForm(false)
      fetchSalarySlips()
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (slip) => {
    setEditingId(slip.id)
    setFormData({
      user_id: slip.user_id,
      month: slip.month,
      base_salary: slip.base_salary,
      bonus: slip.bonus,
      deductions: slip.deductions,
    })
    setShowForm(true)
  }

  const handleExpenseStatusUpdate = async (id, status) => {
    setLoading(true)
    try {
      await api.put(`/expense/${id}/status?status=${status}`)
      setMessage('Expense status updated!')
      fetchExpenses()
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  const totalSalary = (slip) => slip.base_salary + slip.bonus - slip.deductions

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Dashboard</h1>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('slips')}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'slips'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Salary Slips
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'expenses'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Expense Approvals
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'charts'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Salary Slips Tab */}
        {activeTab === 'slips' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900">Salary Slip Management</h2>
              <button
                onClick={() => {
                  setShowForm(!showForm)
                  if (showForm) {
                    setEditingId(null)
                    setFormData({ user_id: '', month: '', base_salary: '', bonus: 0, deductions: 0 })
                  }
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {showForm ? 'Cancel' : '+ Create'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Employee</label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition text-sm"
                    required
                    disabled={editingId}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.email}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Month (YYYY-MM)</label>
                  <input
                    type="text"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    placeholder="2025-01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Base Salary</label>
                  <input
                    type="number"
                    value={formData.base_salary}
                    onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Bonus</label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Deductions</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 transition"
                  >
                    {loading ? 'Processing...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-900">Employee</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">Month</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-900">Base</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-900">Bonus</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-900">Deductions</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-900">Net</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salarySlips.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No salary slips found
                      </td>
                    </tr>
                  ) : (
                    salarySlips.map(slip => (
                      <tr key={slip.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-gray-900">{slip.user.email}</td>
                        <td className="px-6 py-3 text-gray-900">{slip.month}</td>
                        <td className="px-6 py-3 text-right text-gray-900">₹{slip.base_salary.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right text-green-600">₹{slip.bonus.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right text-red-600">₹{slip.deductions.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right font-medium text-gray-900">₹{totalSalary(slip).toFixed(2)}</td>
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() => handleEdit(slip)}
                            className="text-gray-700 hover:text-gray-900 text-sm font-medium transition"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Expense Approvals</h2>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-900">Employee</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-900">Amount</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">Description</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">Date</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No expenses found
                      </td>
                    </tr>
                  ) : (
                    expenses.map(expense => (
                      <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-gray-900">{expense.user_email}</td>
                        <td className="px-6 py-3 text-right text-gray-900 font-medium">₹{expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-3 text-gray-900">{expense.description || '-'}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            expense.status === 'submitted'
                              ? 'bg-yellow-100 text-yellow-800'
                              : expense.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600 text-xs">
                          {new Date(expense.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-center space-x-2">
                          {expense.status === 'submitted' && (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleExpenseStatusUpdate(expense.id, 'approved')}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleExpenseStatusUpdate(expense.id, 'rejected')}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50 transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {expense.status !== 'submitted' && (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Salary Distribution by Month</h2>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              {salarySlips.length > 0 ? (
                <div style={{ maxHeight: '400px' }}>
                  {(() => {
                    const monthlyData = {}
                    salarySlips.forEach(slip => {
                      if (!monthlyData[slip.month]) {
                        monthlyData[slip.month] = { base: 0, bonus: 0, deductions: 0, net: 0, count: 0 }
                      }
                      monthlyData[slip.month].base += slip.base_salary
                      monthlyData[slip.month].bonus += slip.bonus
                      monthlyData[slip.month].deductions += slip.deductions
                      monthlyData[slip.month].net += slip.base_salary + slip.bonus - slip.deductions
                      monthlyData[slip.month].count += 1
                    })

                    const months = Object.keys(monthlyData).sort().reverse()
                    const data = {
                      labels: months,
                      datasets: [
                        {
                          label: 'Total Net Salary',
                          data: months.map(m => monthlyData[m].net.toFixed(2)),
                          backgroundColor: 'rgba(17, 24, 39, 0.7)',
                          borderColor: 'rgb(17, 24, 39)',
                          borderWidth: 1,
                          borderRadius: 4,
                        },
                      ],
                    }

                    const options = {
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: { font: { size: 12 } }
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { drawBorder: false, color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                          grid: { display: false }
                        }
                      },
                    }

                    return <Bar data={data} options={options} />
                  })()}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">No salary data to display</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
