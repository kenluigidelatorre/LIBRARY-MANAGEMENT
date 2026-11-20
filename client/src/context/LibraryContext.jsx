import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { libraryService } from '../services/libraryService';
import { libraryApi } from '../services/libraryApi';

const LibraryContext = createContext(null);

const EMPTY_DATA = {
  books: [],
  categories: [],
  students: [],
  faculty: [],
  borrowings: [],
  returns: [],
  reservations: [],
  fines: [],
  payments: [],
};

export function LibraryProvider({ children }) {
  const [data, setData] = useState(() => ({
    ...EMPTY_DATA,
    settings: libraryService.loadSettings(),
  }));
  const [loading, setLoading] = useState(true);
  const [serverConnected, setServerConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const syncFromServer = useCallback(async () => {
    setLoading(true);
    try {
      await libraryApi.checkHealth();
      const serverData = await libraryApi.loadAll();
      setServerConnected(true);

      const categoryMap = new Map();
      serverData.books.forEach((b, idx) => {
        if (b.category && !categoryMap.has(b.category)) {
          categoryMap.set(b.category, {
            id: `CAT-${String(idx + 1).padStart(2, '0')}`,
            name: b.category,
            code: b.category.slice(0, 4).toUpperCase(),
            description: `${b.category} catalog collection.`,
          });
        }
      });

      setData((prev) => ({
        ...prev,
        books: serverData.books,
        students: serverData.students,
        faculty: serverData.faculty,
        borrowings: serverData.borrowings,
        returns: serverData.returns,
        reservations: serverData.reservations,
        fines: serverData.fines,
        payments: serverData.payments || [],
        categories: Array.from(categoryMap.values()),
      }));
      setLoading(false);
      return true;
    } catch {
      setServerConnected(false);
      setLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    syncFromServer();
  }, [syncFromServer]);

  useEffect(() => {
    libraryService.saveSettings(data.settings);
  }, [data.settings]);

  const requireServer = () => {
    if (!serverConnected) {
      addToast(
        'Backend server is not connected. Start the Express server on port 5000.',
        'error'
      );
      return false;
    }
    return true;
  };

  // Books CRUD -> /api/books
  const addBook = async (book) => {
    if (!requireServer()) return;
    try {
      const created = await libraryApi.createBook(book);
      await syncFromServer();
      addToast(`Book "${created.title}" added to catalog.`);
    } catch (err) {
      addToast(err.message || 'Failed to add book on server.', 'error');
    }
  };

  const updateBook = async (id, updates) => {
    if (!requireServer()) return;
    try {
      await libraryApi.updateBook(id, updates);
      await syncFromServer();
      addToast('Book record updated.');
    } catch (err) {
      addToast(err.message || 'Failed to update book on server.', 'error');
    }
  };

  const deleteBook = async (id) => {
    if (!requireServer()) return;
    try {
      await libraryApi.deleteBook(id);
      await syncFromServer();
      addToast('Book record deleted.', 'info');
    } catch (err) {
      addToast(
        err.message || 'Cannot delete book with active loan or reservation references.',
        'error'
      );
    }
  };

  // Categories (derived from books on server; supports client session additions when tagging new books)
  const addCategory = (cat) => {
    const newCat = {
      ...cat,
      id: `CAT-${String(data.categories.length + 1).padStart(2, '0')}`,
    };
    setData((prev) => ({ ...prev, categories: [newCat, ...prev.categories] }));
    addToast(`Category "${newCat.name}" added for catalog selection.`);
  };

  const updateCategory = (id, updates) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    addToast('Category updated.');
  };

  const deleteCategory = (id) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
    addToast('Category removed.', 'info');
  };

  // Students & Faculty (read-only from Registrar & Library Faculty APIs on unmodified server)
  const addStudent = () => {
    addToast(
      'Students are synced directly from the Registrar module (read-only).',
      'info'
    );
  };

  const updateStudent = () => {
    addToast(
      'Student records are managed by the Registrar module.',
      'info'
    );
  };

  const deleteStudent = () => {
    addToast(
      'Student records cannot be deleted from the Library module.',
      'info'
    );
  };

  const addFaculty = () => {
    addToast(
      'Faculty records are managed by the server database (read-only API).',
      'info'
    );
  };

  const updateFaculty = () => {
    addToast(
      'Faculty records are read-only on the current server API.',
      'info'
    );
  };

  const deleteFaculty = () => {
    addToast(
      'Faculty records cannot be deleted from the client.',
      'info'
    );
  };

  // Borrowing CRUD -> /api/loans
  const addBorrowing = async (record) => {
    if (!requireServer()) return;
    try {
      await libraryApi.createLoan({
        borrowerId: record.borrowerId,
        borrowerType: record.role,
        bookId: record.bookId,
        borrowedDate: record.borrowDate,
        dueDate: record.dueDate,
      });
      await syncFromServer();
      addToast(`Issued "${record.bookTitle}" to ${record.borrowerName}.`);
    } catch (err) {
      addToast(err.message || 'Failed to issue loan.', 'error');
    }
  };

  const updateBorrowing = async (id, updates) => {
    if (!requireServer()) return;
    try {
      await libraryApi.updateLoan(id, {
        status: updates.status,
        returnedDate:
          updates.status === 'Returned'
            ? updates.returnedDate || new Date().toISOString().slice(0, 10)
            : null,
      });
      await syncFromServer();
      addToast('Borrowing record updated.');
    } catch (err) {
      addToast(err.message || 'Failed to update loan.', 'error');
    }
  };

  const deleteBorrowing = async (id) => {
    if (!requireServer()) return;
    try {
      await libraryApi.deleteLoan(id);
      await syncFromServer();
      addToast('Borrowing record removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete loan.', 'error');
    }
  };

  // Process Return -> PUT /api/loans/:loanId + optional POST /api/fines
  const processReturn = async ({ borrowId, returnDate, condition }) => {
    if (!requireServer()) return;
    const borrowing = data.borrowings.find((b) => b.id === borrowId);
    if (!borrowing) return;

    const due = new Date(borrowing.dueDate);
    const ret = new Date(returnDate);
    const diffMs = ret.getTime() - due.getTime();
    const daysLate = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const fineRate = Number(data.settings.dailyFineRate || 1);
    const damageFee = condition === 'Damaged' ? 10 : condition === 'Lost' ? 35 : 0;
    const fineAmount = daysLate * fineRate + damageFee;
    const isLate = daysLate > 0;

    try {
      await libraryApi.updateLoan(borrowId, {
        status: 'RETURNED',
        returnedDate: returnDate,
      });
      if (fineAmount > 0) {
        await libraryApi.createFine({
          borrowerId: borrowing.borrowerId,
          borrowerType: borrowing.role,
          loanId: borrowing.id,
          amount: fineAmount,
          reason:
            condition !== 'Good'
              ? `${isLate ? `Late (${daysLate}d) + ` : ''}${condition} Condition`
              : `Late Return (${daysLate} days)`,
        });
      }
      await syncFromServer();
      addToast(
        fineAmount > 0
          ? `Return processed with $${fineAmount.toFixed(2)} fine assessed.`
          : `Book "${borrowing.bookTitle}" returned on time.`
      );
    } catch (err) {
      addToast(err.message || 'Failed to process return on server.', 'error');
    }
  };

  const deleteReturn = async (id) => {
    const target = data.returns.find((r) => r.id === id);
    if (target?.borrowId) {
      await deleteBorrowing(target.borrowId);
    }
  };

  // Reservations CRUD -> /api/reservations
  const addReservation = async (res) => {
    if (!requireServer()) return;
    try {
      await libraryApi.createReservation({
        borrowerId: res.borrowerId,
        borrowerType: res.role,
        bookId: res.bookId,
      });
      await syncFromServer();
      addToast(`Reservation created for "${res.bookTitle}".`);
    } catch (err) {
      addToast(err.message || 'Failed to create reservation.', 'error');
    }
  };

  const updateReservation = () => {
    addToast(
      'Reservation status updates are not exposed on the current server API.',
      'info'
    );
  };

  const deleteReservation = async (id) => {
    if (!requireServer()) return;
    try {
      await libraryApi.deleteReservation(id);
      await syncFromServer();
      addToast('Reservation removed.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete reservation.', 'error');
    }
  };

  // Fines CRUD -> /api/fines & /api/finance/payments
  const addFine = async (fine) => {
    if (!requireServer()) return;
    try {
      await libraryApi.createFine({
        borrowerId: fine.borrowerId,
        borrowerType: fine.borrowerType || 'STUDENT',
        loanId: fine.loanId,
        amount: Number(fine.amount),
        reason: fine.reason,
      });
      await syncFromServer();
      addToast('Fine record assessed.');
    } catch (err) {
      addToast(err.message || 'Failed to assess fine.', 'error');
    }
  };

  const updateFineStatus = async (id, status) => {
    if (!requireServer()) return;
    const targetFine = data.fines.find((f) => f.id === id);
    if (!targetFine) return;

    try {
      if (status === 'Paid') {
        const res = await libraryApi.payFine({
          fineId: targetFine.id,
          borrowerId: targetFine.borrowerId,
          borrowerType: targetFine.borrowerType || 'STUDENT',
          amount: targetFine.amount,
          paymentMethod: 'CASH',
        });
        if (res?.simulated) {
          await syncFromServer();
          addToast(
            res.message ||
              'Finance mock mode: simulated payment only (fine remains UNPAID in database).',
            'info'
          );
          return;
        }
        if (res?.status === 'PENDING') {
          await syncFromServer();
          addToast(
            res.message || 'Finance has not confirmed this payment yet.',
            'info'
          );
          return;
        }
        await syncFromServer();
        addToast('Fine payment confirmed via Finance module.');
        return;
      }

      await libraryApi.updateFineStatus(id, status);
      await syncFromServer();
      addToast(`Fine marked as ${status}.`);
    } catch (err) {
      addToast(err.message || 'Failed to update fine status.', 'error');
    }
  };

  const deleteFine = () => {
    addToast(
      'Fines cannot be deleted from the database; use Waive instead.',
      'info'
    );
  };

  // Settings
  const updateSettings = (updates) => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, ...updates } }));
    addToast('System settings saved.');
  };

  const resetSampleData = async () => {
    const ok = await syncFromServer();
    if (ok) {
      addToast('Synchronized live data from backend server.', 'info');
    } else {
      addToast('Unable to reach backend server on port 5000.', 'error');
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        ...data,
        loading,
        serverConnected,
        syncFromServer,
        toasts,
        addToast,
        dismissToast,
        globalSearch,
        setGlobalSearch,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        updateCategory,
        deleteCategory,
        addStudent,
        updateStudent,
        deleteStudent,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        addBorrowing,
        updateBorrowing,
        deleteBorrowing,
        processReturn,
        deleteReturn,
        addReservation,
        updateReservation,
        deleteReservation,
        addFine,
        updateFineStatus,
        deleteFine,
        updateSettings,
        resetSampleData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used inside LibraryProvider');
  }
  return ctx;
}
