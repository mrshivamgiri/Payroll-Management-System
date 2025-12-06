import React from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export function SalaryChart({ salarySlips }) {
  if (!salarySlips || salarySlips.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data to display</div>
  }

  const months = salarySlips.map(s => s.month).reverse()
  const baseSalaries = salarySlips.map(s => s.base_salary).reverse()
  const bonuses = salarySlips.map(s => s.bonus).reverse()
  const deductions = salarySlips.map(s => s.deductions).reverse()
  const netSalaries = salarySlips.map(s => s.base_salary + s.bonus - s.deductions).reverse()

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Base Salary',
        data: baseSalaries,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
      },
      {
        label: 'Bonus',
        data: bonuses,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
      },
      {
        label: 'Deductions',
        data: deductions,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
      },
      {
        label: 'Net Salary',
        data: netSalaries,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Salary Trend Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Line data={data} options={options} />
}

export function ExpenseChart({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data to display</div>
  }

  // Group expenses by status
  const statusGroups = {
    submitted: 0,
    approved: 0,
    rejected: 0,
  }

  expenses.forEach(exp => {
    if (exp.status in statusGroups) {
      statusGroups[exp.status] += exp.amount
    }
  })

  const data = {
    labels: ['Submitted', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Total Amount (₹)',
        data: [statusGroups.submitted, statusGroups.approved, statusGroups.rejected],
        backgroundColor: ['rgba(234, 179, 8, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)'],
        borderColor: ['rgb(234, 179, 8)', 'rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expense Status Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Bar data={data} options={options} />
}
