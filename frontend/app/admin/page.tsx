'use client';
import React, { useState } from 'react';

interface Player {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  balance?: number;
}

export default function AdminDashboard() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<Player[]>([]);
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [newPlayer, setNewPlayer] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://casanova-af97.onrender.com';

  const fetchUsers = async (adminPin: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/games/admin/users`, {
        headers: { 'x-admin-pin': adminPin }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setIsAuthenticated(true);
        setMessage('');
      } else {
        setMessage('كلمة السر غير صحيحة!');
      }
    } catch {
      setMessage('خطأ في الاتصال بالخادم');
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(pin);
  };

  const handleDeposit = async (userId: string) => {
    const amount = amounts[userId];
    if (!amount || Number(amount) <= 0) return;

    try {
      const res = await fetch(`${API_URL}/games/admin/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin
        },
        body: JSON.stringify({ userId, amount: Number(amount) })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ تم شحن ${amount} دينار تونسي (TND) بنجاح!`);
        setAmounts({ ...amounts, [userId]: '' });
        fetchUsers(pin);
      }
    } catch {
      setMessage('حدث خطأ أثناء الشحن');
    }
  };

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPlayer,
          dateOfBirth: '1995-01-01',
          address: {
            street: 'Tunis',
            city: 'Tunis',
            state: 'Tunis',
            zipCode: '1000',
            country: 'Tunisia'
          }
        })
      });
      const data = await res.json();
      if (data.success || data.token || data.user) {
        setMessage(`🎉 تم إنشاء حساب اللاعب (${newPlayer.username}) بنجاح!`);
        setNewPlayer({ username: '', email: '', password: '', firstName: '', lastName: '' });
        fetchUsers(pin);
      } else {
        setMessage(data.message || 'تأكد من عدم تكرار اسم المستخدم أو البريد');
      }
    } catch {
      setMessage('فشل إنشاء الحساب');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4" dir="rtl">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-2xl border border-yellow-500/30 max-w-md w-full shadow-2xl">
          <h1 className="text-2xl font-bold text-yellow-400 mb-2 text-center">لوحة تحكم الأدمن 🇹🇳</h1>
          <p className="text-gray-400 text-sm text-center mb-6">إدارة اللاعبين وشحن الرصيد الافتراضي (TND)</p>
          <input
            type="password"
            placeholder="أدخل رمز الأدمن السري..."
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white mb-4 focus:outline-none focus:border-yellow-400"
          />
          {message && <p className="text-red-400 text-sm mb-4 text-center">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition"
          >
            {loading ? 'جاري التحقق...' : 'دخول اللوحة'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">نادي الأصدقاء الترفيهي 🇹🇳</h1>
            <p className="text-gray-400 text-sm">إدارة حسابات الأصدقاء والرصيد الافتراضي بالدينار التونسي (TND)</p>
          </div>
          <button onClick={() => fetchUsers(pin)} className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
            تحديث القائمة 🔄
          </button>
        </div>

        {message && (
          <div className="bg-green-900/40 border border-green-500 text-green-300 p-4 rounded-xl mb-6 text-center font-semibold">
            {message}
          </div>
        )}

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">➕ إضافة صديق (لاعب جديد)</h2>
          <form onSubmit={handleCreatePlayer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="اسم المستخدم (Username)"
              required
              value={newPlayer.username}
              onChange={(e) => setNewPlayer({ ...newPlayer, username: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني (مثلاً friend@club.tn)"
              required
              value={newPlayer.email}
              onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="كلمة المرور (8 خانات على الأقل)"
              required
              value={newPlayer.password}
              onChange={(e) => setNewPlayer({ ...newPlayer, password: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="الاسم الأول"
              value={newPlayer.firstName}
              onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="اللقب"
              value={newPlayer.lastName}
              onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition">
              إنشاء حساب للاعب
            </button>
          </form>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">👥 قائمة اللاعبين ({users.length})</h2>
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u._id} className="bg-gray-800/60 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-700/50">
                <div>
                  <h3 className="font-bold text-lg text-yellow-400">{u.username} <span className="text-xs text-gray-400">({u.firstName} {u.lastName})</span></h3>
                  <p className="text-sm text-gray-400">{u.email}</p>
                  <p className="text-md font-bold text-green-400 mt-1">
                    الرصيد الحالي: {u.balance?.toFixed(2) || '0.00'} د.ت (TND)
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input
                    type="number"
                    placeholder="المبلغ بالدينار..."
                    value={amounts[u._id] || ''}
                    onChange={(e) => setAmounts({ ...amounts, [u._id]: e.target.value })}
                    className="p-2.5 rounded-lg bg-gray-900 border border-gray-600 text-white w-36 text-center"
                  />
                  <button
                    onClick={() => handleDeposit(u._id)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition"
                  >
                    + شحن TND
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
