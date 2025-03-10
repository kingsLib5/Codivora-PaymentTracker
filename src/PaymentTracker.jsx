import { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentTracker = () => {
  const [entries, setEntries] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [service, setService] = useState('');
  const [payment, setPayment] = useState('');
  const [date, setDate] = useState('');

  // Load entries from the backend on component mount
  useEffect(() => {
    axios
      .get('http://codivora-payment-tracker.vercel.app/api/server/entries')
      .then((response) => {
        setEntries(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !service || !payment || !date) return;

    const newEntry = {
      customerName,
      service,
      payment: parseFloat(payment),
      date,
    };

    axios
      .post('http://codivora-payment-tracker.vercel.app/api/server/entries', newEntry)
      .then((response) => {
        setEntries([...entries, response.data]);
        // Clear form fields
        setCustomerName('');
        setService('');
        setPayment('');
        setDate('');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Codivora Payment Tracker
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Service Rendered"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Payment Amount"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add Entry
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Rendered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Made
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₦{entry.payment.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No entries yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracker;
