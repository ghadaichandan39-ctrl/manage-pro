
import React from 'react';
import { Student, StudentMonthlySummary } from '../types';

interface ManagerViewProps {
  stats: {
    totalSpent: number;
    totalMeals: number;
    mealRate: number;
    studentStats: StudentMonthlySummary[];
  };
  user: Student;
  managerId: string | null;
  students: Student[];
  onArchive: () => void;
  onTakeOver: () => void;
}

const ManagerView: React.FC<ManagerViewProps> = ({ stats, user, managerId, students, onArchive, onTakeOver }) => {
  const currentManager = students.find(s => s.id === managerId);
  const isUserManager = user.id === managerId;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Monthly Management</h2>
        <p className="text-slate-500">Manage the mess administration and settle the month's accounts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Management Status Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Role Assignment</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${currentManager ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Current Mess Manager</p>
                <p className="text-xl font-bold text-slate-900">{currentManager?.name || "Unassigned"}</p>
                {currentManager && <p className="text-xs text-indigo-600 font-bold">{currentManager.mobile}</p>}
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-8">
              The manager is responsible for ensuring all shopping items are logged accurately and meal records are updated daily. Only the manager should finalize the month.
            </p>
          </div>

          {!isUserManager ? (
            <button 
              onClick={onTakeOver}
              className="w-full bg-indigo-50 text-indigo-600 font-bold py-4 rounded-2xl hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Take Over Management
            </button>
          ) : (
            <div className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You are managing this month
            </div>
          )}
        </div>

        {/* Action Card */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">Month Finalization</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Total Expenditure</span>
                <span className="font-bold">₹{stats.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Meal Consumption</span>
                <span className="font-bold">{stats.totalMeals} Meals</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Final Meal Rate</span>
                <span className="font-bold">₹{stats.mealRate.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-4 italic">
              Archiving will move all data to history and clear current logs for the next month. This action cannot be undone.
            </p>
            <button 
              onClick={onArchive}
              disabled={!isUserManager}
              className={`w-full font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${isUserManager ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Archive & Start New Month
            </button>
            {!isUserManager && <p className="text-[10px] text-center text-red-400 mt-2 font-bold uppercase">Manager permissions required to archive</p>}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Manager Availability
        </h4>
        <p className="text-sm text-indigo-700 leading-relaxed">
          If the current manager is unavailable, any student can click "Take Over Management" to assume the responsibilities for the remainder of the month. This ensures data entry never stops and bills are always calculated on time.
        </p>
      </div>
    </div>
  );
};

export default ManagerView;
