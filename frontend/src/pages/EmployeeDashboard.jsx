import React, { useState, useEffect } from 'react'
import { salaryAPI, expenseAPI } from '../api'
import { SalaryChart, ExpenseChart } from '../components/Charts'

export default function EmployeeDashboard() {
  const [salarySlips, setSalarySlips] = useState([])
  const [expenses, setExpenses] = useState([])
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [formData, setFormData] = useState({ amount: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('salary')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [slipsRes, expensesRes] = await Promise.all([
        salaryAPI.list(),
        expenseAPI.list(),
      ])
      setSalarySlips(slipsRes.data)
      setExpenses(expensesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleExpenseSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await expenseAPI.create(parseFloat(formData.amount), formData.description)
      setMessage('Expense submitted successfully!')
      setFormData({ amount: '', description: '' })
      setShowExpenseForm(false)
      fetchData()
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
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'salary'
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
            Expenses
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
        {activeTab === 'salary' && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Your Salary Slips</h2>
            {salarySlips.length === 0 ? (
              <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-xl border border-gray-200">
                No salary slips available yet
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left font-medium text-gray-900">Month</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-900">Base</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-900">Bonus</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-900">Deductions</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-900">Net Salary</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salarySlips.map(slip => (
                      <tr key={slip.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-3 font-medium text-gray-900">{slip.month}</td>
                        <td className="px-6 py-3 text-right text-gray-900">₹{slip.base_salary.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right text-green-600">₹{slip.bonus.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right text-red-600">₹{slip.deductions.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right font-bold text-gray-900">₹{totalSalary(slip).toFixed(2)}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(slip.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Submit Expense</h2>
                <button
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  {showExpenseForm ? 'Cancel' : '+ New Expense'}
                </button>
              </div>

              {showExpenseForm && (
                <form onSubmit={handleExpenseSubmit} className="bg-gray-50 p-6 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition text-sm"
                      placeholder="Enter amount"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition text-sm"
                      placeholder="Enter description"
                      rows="3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 transition"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Expense History</h2>
              {expenses.length === 0 ? (
                <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-xl border border-gray-200">
                  No expenses submitted yet
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left font-medium text-gray-900">Amount</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-900">Description</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map(expense => (
                        <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-6 py-3 font-medium text-gray-900">₹{expense.amount.toFixed(2)}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Salary Trends</h2>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <SalaryChart salarySlips={salarySlips} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Expense Analysis</h2>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200" style={{ maxWidth: '600px' }}>
                <ExpenseChart expenses={expenses} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
