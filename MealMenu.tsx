
import React, { useState } from 'react';
import { DailyMenu, ShoppingItem } from '../types';
import { suggestMenu } from '../services/geminiService';

interface MealMenuProps {
  menus: DailyMenu[];
  setMenus: React.Dispatch<React.SetStateAction<DailyMenu[]>>;
  shoppingItems: ShoppingItem[];
}

const MealMenu: React.FC<MealMenuProps> = ({ menus, setMenus, shoppingItems }) => {
  const [loading, setLoading] = useState(false);
  const [editingDate, setEditingDate] = useState(new Date().toISOString().split('T')[0]);
  
  const currentMenu = menus.find(m => m.date === editingDate) || { 
    date: editingDate, 
    lunch: '', 
    dinner: '' 
  };

  const handleUpdate = (field: keyof DailyMenu, value: string) => {
    const newMenu = { ...currentMenu, [field]: value };
    setMenus(prev => {
      const filtered = prev.filter(m => m.date !== editingDate);
      return [...filtered, newMenu].sort((a, b) => b.date.localeCompare(a.date));
    });
  };

  const handleAISuggestion = async () => {
    setLoading(true);
    const items = shoppingItems.slice(-15).map(i => i.item);
    const suggestion = await suggestMenu(items);
    if (suggestion) {
      const newMenu = { 
        date: editingDate, 
        lunch: suggestion.lunch, 
        dinner: suggestion.dinner 
      };
      setMenus(prev => {
        const filtered = prev.filter(m => m.date !== editingDate);
        return [...filtered, newMenu].sort((a, b) => b.date.localeCompare(a.date));
      });
    }
    setLoading(false);
  };

  const deleteMenu = (date: string) => {
    if (window.confirm(`Delete menu for ${date}?`)) {
      setMenus(prev => prev.filter(m => m.date !== date));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Meal Planning</h2>
          <p className="text-slate-500">Manage lunch and dinner menus for specific dates.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
           <input 
            type="date" 
            className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={editingDate}
            onChange={(e) => setEditingDate(e.target.value)}
          />
          <button
            onClick={handleAISuggestion}
            disabled={loading}
            className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 10-2 0h-1a1 1 0 100 2h1a1 1 0 102 0v-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 11a1 1 0 11-2 0V10a1 1 0 112 0v1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM16 8a6 6 0 10-12 0v.01A6 6 0 0016 8z" />
              </svg>
            )}
            AI Suggest
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lunch Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Afternoon Lunch</h3>
                <p className="text-xs text-slate-400">Primary Meal</p>
              </div>
            </div>
          </div>
          <textarea
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-40 text-slate-700 font-medium leading-relaxed"
            placeholder="Enter lunch menu details..."
            value={currentMenu.lunch}
            onChange={(e) => handleUpdate('lunch', e.target.value)}
          />
        </div>

        {/* Dinner Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Evening Dinner</h3>
                <p className="text-xs text-slate-400">Night Meal</p>
              </div>
            </div>
          </div>
          <textarea
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-40 text-slate-700 font-medium leading-relaxed"
            placeholder="Enter dinner menu details..."
            value={currentMenu.dinner}
            onChange={(e) => handleUpdate('dinner', e.target.value)}
          />
        </div>
      </div>

      {/* Menu History Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">Menu Archive</h3>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
            {menus.length} Days Logged
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Lunch Selection</th>
                <th className="px-6 py-4">Dinner Selection</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menus.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    No meal menus have been recorded yet.
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu.date} className={`hover:bg-slate-50 transition-colors ${menu.date === editingDate ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-bold">
                          {new Date(menu.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">
                          {new Date(menu.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <p className="text-sm text-slate-600 line-clamp-2">{menu.lunch || 'Not set'}</p>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <p className="text-sm text-slate-600 line-clamp-2">{menu.dinner || 'Not set'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setEditingDate(menu.date)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"
                          title="Edit Menu"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteMenu(menu.date)}
                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                          title="Delete Record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealMenu;
