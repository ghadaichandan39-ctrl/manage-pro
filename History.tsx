
import React, { useState, useMemo } from 'react';
import { MonthSummary, Student } from '../types';

interface HistoryProps {
  history: MonthSummary[];
  students: Student[];
}

const History: React.FC<HistoryProps> = ({ history, students }) => {
  const [selectedMonth, setSelectedMonth] = useState<MonthSummary | null>(null);
  const [filterMonth, setFilterMonth] = useState('');

  const filteredHistory = useMemo(() => {
    if (!filterMonth) return history;
    return history.filter(h => h.month === filterMonth);
  }, [history, filterMonth]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const getStudentName = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) return student.name;
    // Check in the archived summaries if student was deleted later
    const archStudent = selectedMonth?.studentSummaries.find(s => s.studentId === id);
    return archStudent?.studentName || "Former Member";
  };

  if (history.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">No History Records</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">Historical reports will appear here once the manager archives a month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial History</h2>
          <p className="text-slate-500">Access and download detailed reports from previous months.</p>
        </div>
        <div className="w-full md:w-auto">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Select Month</label>
          <input 
            type="month" 
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
        </div>
      </header>

      {/* Month Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 no-print">
        {filteredHistory.map((m) => (
          <button
            key={m.month}
            onClick={() => setSelectedMonth(m)}
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all text-left group ${
              selectedMonth?.month === m.month ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-indigo-200'
            }`}
          >
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">
              {new Date(m.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xl font-black text-slate-900">₹{m.totalSpent.toLocaleString()}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-slate-400">{m.totalMeals} meals</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">View Report &rarr;</span>
            </div>
          </button>
        ))}
      </div>

      {selectedMonth && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden report-card animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Action Header (No Print) */}
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center no-print">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m32-2a4 4 0 00-4-4h-2a4 4 0 00-4 4v2m-9-4h4m-4 4h4m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-lg font-bold">Month Detail: {new Date(selectedMonth.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
                 <p className="text-slate-400 text-xs">Full statement of accounts</p>
               </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleDownloadPDF}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Export PDF
              </button>
              <button onClick={() => setSelectedMonth(null)} className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* PRINT ONLY HEADER */}
          <div className="hidden print:block p-10 border-b-2 border-slate-100">
             <div className="flex justify-between items-end">
               <div>
                 <h1 className="text-4xl font-black text-indigo-600">MessManager Pro</h1>
                 <p className="text-slate-500 mt-2 font-medium tracking-wide">COMPREHENSIVE FINANCIAL REPORT</p>
                 <h2 className="text-2xl font-bold text-slate-900 mt-6">
                   {new Date(selectedMonth.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                 </h2>
               </div>
               <div className="text-right border-l pl-8 border-slate-100">
                 <div className="mb-4">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Mess Spend</p>
                   <p className="text-3xl font-black text-indigo-700">₹{selectedMonth.totalSpent.toLocaleString()}</p>
                 </div>
                 <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Meals Served</p>
                      <p className="text-lg font-bold">{selectedMonth.totalMeals}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Meal Rate</p>
                      <p className="text-lg font-bold text-indigo-600">₹{selectedMonth.mealRate.toFixed(2)}</p>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="p-6 md:p-8 space-y-12">
            {/* Section 1: Member Billing */}
            <section className="print:break-inside-avoid">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                1. Member Billing Summary
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4 text-center">Meals</th>
                      <th className="px-6 py-4 text-right">Shopping</th>
                      <th className="px-6 py-4 text-right">Bill</th>
                      <th className="px-6 py-4 text-right">Payable/Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedMonth.studentSummaries.map((s) => (
                      <tr key={s.studentId} className="text-sm font-medium">
                        <td className="px-6 py-4 text-slate-900">{s.studentName}</td>
                        <td className="px-6 py-4 text-center text-slate-600">{s.mealsEaten}</td>
                        <td className="px-6 py-4 text-right text-slate-900">₹{s.totalSpent.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-indigo-600">₹{s.payableAmount.toFixed(2)}</td>
                        <td className={`px-6 py-4 text-right font-bold ${s.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {s.balance >= 0 ? '+' : ''}₹{s.balance.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold text-slate-900">
                    <tr>
                      <td className="px-6 py-4">Total</td>
                      <td className="px-6 py-4 text-center">{selectedMonth.totalMeals}</td>
                      <td className="px-6 py-4 text-right">₹{selectedMonth.totalSpent.toLocaleString()}</td>
                      <td colSpan={2} className="px-6 py-4 text-right text-indigo-600">Rate: ₹{selectedMonth.mealRate.toFixed(2)} / meal</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Section 2: Detailed Shopping Ledger */}
            {selectedMonth.shoppingItems && selectedMonth.shoppingItems.length > 0 && (
              <section className="print:break-before-page">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                  2. Detailed Shopping Ledger
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Payer</th>
                        <th className="px-6 py-4">Items Description</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedMonth.shoppingItems.map((item) => (
                        <tr key={item.id} className="text-sm">
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{getStudentName(item.studentId)}</td>
                          <td className="px-6 py-4 text-slate-600">{item.item}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Section 3: Student Activity Log */}
            {selectedMonth.mealRecords && selectedMonth.mealRecords.length > 0 && (
              <section className="print:break-before-page">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                  3. Student Activity Log (Daily Meals)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   {selectedMonth.studentSummaries.map(student => {
                     const studentDaily = selectedMonth.mealRecords?.filter(r => r.studentId === student.studentId) || [];
                     return (
                       <div key={student.studentId} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                         <p className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">{student.studentName}</p>
                         <div className="flex flex-wrap gap-1">
                           {studentDaily.sort((a,b) => a.date.localeCompare(b.date)).map(record => (
                             <div key={record.id} className="text-[9px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                               <span className="font-bold">{new Date(record.date).getDate()}:</span> {record.mealCount}m
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                   })}
                </div>
              </section>
            )}
          </div>
          
          <div className="hidden print:block p-10 mt-8 text-xs text-slate-400 text-center border-t border-slate-100 italic">
             This report was generated by MessManager Pro on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}.
             The data contained herein is an archival record of historical student mess participation.
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
