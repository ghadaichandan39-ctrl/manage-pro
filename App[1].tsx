
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Student, 
  ShoppingItem, 
  MealRecord, 
  DailyMenu, 
  AppView, 
  MonthSummary,
  StudentMonthlySummary
} from './types';
import { INITIAL_STUDENTS } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MealMenu from './components/MealMenu';
import Shopping from './components/Shopping';
import MealTracker from './components/MealTracker';
import History from './components/History';
import StudentManager from './components/StudentManager';
import ManagerView from './components/ManagerView';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem('mess_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('mess_students');
    const parsed = saved ? JSON.parse(saved) : null;
    return (parsed && parsed.length > 0) ? parsed : INITIAL_STUDENTS;
  });

  const [managerId, setManagerId] = useState<string | null>(() => {
    return localStorage.getItem('mess_manager_id');
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('mess_shopping');
    return saved ? JSON.parse(saved) : [];
  });

  const [mealRecords, setMealRecords] = useState<MealRecord[]>(() => {
    const saved = localStorage.getItem('mess_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [menus, setMenus] = useState<DailyMenu[]>(() => {
    const saved = localStorage.getItem('mess_menus');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<MonthSummary[]>(() => {
    const saved = localStorage.getItem('mess_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');

  useEffect(() => {
    localStorage.setItem('mess_students', JSON.stringify(students));
    localStorage.setItem('mess_shopping', JSON.stringify(shoppingItems));
    localStorage.setItem('mess_meals', JSON.stringify(mealRecords));
    localStorage.setItem('mess_menus', JSON.stringify(menus));
    localStorage.setItem('mess_history', JSON.stringify(history));
    if (managerId) localStorage.setItem('mess_manager_id', managerId);
    if (currentUser) localStorage.setItem('mess_user', JSON.stringify(currentUser));
    else localStorage.removeItem('mess_user');
  }, [students, shoppingItems, mealRecords, menus, history, currentUser, managerId]);

  const currentMonthStats = useMemo(() => {
    const totalSpent = shoppingItems.reduce((acc, item) => acc + item.amount, 0);
    const totalMeals = mealRecords.reduce((acc, rec) => acc + rec.mealCount, 0);
    const mealRate = totalMeals > 0 ? totalSpent / totalMeals : 0;

    const studentStats = students.map(student => {
      const studentMeals = mealRecords
        .filter(r => r.studentId === student.id)
        .reduce((acc, r) => acc + r.mealCount, 0);
      
      const studentTotalSpent = shoppingItems
        .filter(i => i.studentId === student.id)
        .reduce((acc, i) => acc + i.amount, 0);
      
      const payableAmount = studentMeals * mealRate;
      
      return {
        studentId: student.id,
        studentName: student.name,
        mealsEaten: studentMeals,
        totalSpent: studentTotalSpent,
        payableAmount: payableAmount,
        balance: studentTotalSpent - payableAmount
      };
    });

    return { totalSpent, totalMeals, mealRate, studentStats };
  }, [students, shoppingItems, mealRecords]);

  const handleLogin = (name: string, mobile: string) => {
    const existing = students.find(s => s.mobile === mobile);
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser = { id: Date.now().toString(), name, mobile, isActive: true };
      setStudents(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      if (!managerId) setManagerId(newUser.id);
    }
  };

  const addStudent = (name: string, mobile: string) => {
    if (students.some(s => s.mobile === mobile)) {
      alert("Mobile number already exists!");
      return;
    }
    const newUser = { id: Date.now().toString(), name, mobile, isActive: true };
    setStudents(prev => [...prev, newUser]);
  };

  const deleteStudent = (id: string) => {
    if (currentUser?.id === id) {
      alert("You cannot delete yourself while logged in.");
      return;
    }
    if (window.confirm("Delete this student? Records remain but student name is removed from active lists.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      if (managerId === id) setManagerId(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('DASHBOARD');
  };

  const archiveMonth = () => {
    const confirmArchive = window.confirm("Archive this month? This clears all current records for a fresh start.");
    if (!confirmArchive) return;

    const summary: MonthSummary = {
      month: new Date().toISOString().slice(0, 7),
      totalSpent: currentMonthStats.totalSpent,
      totalMeals: currentMonthStats.totalMeals,
      mealRate: currentMonthStats.mealRate,
      studentSummaries: currentMonthStats.studentStats,
      shoppingItems: [...shoppingItems],
      mealRecords: [...mealRecords]
    };

    setHistory(prev => [summary, ...prev]);
    setShoppingItems([]);
    setMealRecords([]);
    setMenus([]);
  };

  const takeOverManagement = () => {
    if (currentUser) {
      setManagerId(currentUser.id);
      alert("You are now the active manager for this month.");
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard stats={currentMonthStats} user={currentUser} managerId={managerId} />;
      case 'MENU':
        return <MealMenu menus={menus} setMenus={setMenus} shoppingItems={shoppingItems} />;
      case 'SHOPPING':
        return <Shopping items={shoppingItems} setItems={setShoppingItems} user={currentUser} students={students} />;
      case 'MEALS':
        return <MealTracker records={mealRecords} setRecords={setMealRecords} students={students} />;
      case 'STUDENTS':
        return <StudentManager students={students} onAdd={addStudent} onDelete={deleteStudent} />;
      case 'MANAGER':
        return (
          <ManagerView 
            stats={currentMonthStats} 
            user={currentUser} 
            managerId={managerId} 
            students={students}
            onArchive={archiveMonth}
            onTakeOver={takeOverManagement}
          />
        );
      case 'HISTORY':
        return <History history={history} students={students} />;
      default:
        return <Dashboard stats={currentMonthStats} user={currentUser} managerId={managerId} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );
};

export default App;
