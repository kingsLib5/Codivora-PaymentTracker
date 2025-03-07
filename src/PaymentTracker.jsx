import { useState, useEffect } from 'react';

const PaymentTracker = () => {
  const [entries, setEntries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [service, setService] = useState('');
  const [payment, setPayment] = useState('');
  const [date, setDate] = useState('');

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('entries');
    console.log('Loaded entries from localStorage:', savedEntries);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    setIsLoaded(true);
  }, []);

  // Save entries to localStorage whenever entries change, but only after initial load
  useEffect(() => {
    if (!isLoaded) return;
    console.log('Saving entries to localStorage:', entries);
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries, isLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !service || !payment || !date) return;

    const newEntry = {
      id: Date.now(),
      customerName,
      service,
      payment: parseFloat(payment),
      date,
    };

    setEntries([...entries, newEntry]);
    // Clear form fields
    setCustomerName('');
    setService('');
    setPayment('');
    setDate('');
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

        {/* Responsive table container */}
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
                <tr key={entry.id}>
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
