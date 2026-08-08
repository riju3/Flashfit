import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const AdminSettings = () => {
  const [upiId, setUpiId] = useState('')
  const [supportPhone, setSupportPhone] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSettings
      })
      if (response.data.success && response.data.data) {
        setUpiId(response.data.data.upiId || '')
        setSupportPhone(response.data.data.supportPhone || '+91 98765 43210')
        setSupportEmail(response.data.data.supportEmail || 'support@flashfit.com')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateSettings,
        data: { upiId, supportPhone, supportEmail }
      })
      if (response.data.success) {
        toast.success("Settings updated successfully!")
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto my-6">
      <h2 className="text-xl font-bold text-fashion-dark mb-4">Store & Support Settings (Admin)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-fashion-charcoal mb-1">
            Merchant UPI ID (e.g. flashfit@upi, 9876543210@paytm)
          </label>
          <input
            type="text"
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-fashion-charcoal mb-1">
            Customer Support Phone Number (Call redirect & dialer)
          </label>
          <input
            type="text"
            placeholder="e.g. +91 98765 43210"
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-fashion-charcoal mb-1">
            Customer Support Email Address
          </label>
          <input
            type="email"
            placeholder="e.g. support@flashfit.com"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  )
}

export default AdminSettings
