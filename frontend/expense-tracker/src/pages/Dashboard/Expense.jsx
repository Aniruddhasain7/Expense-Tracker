import React, { useEffect, useState, useCallback } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import { Modal } from "../../components/Modal";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import SearchFilters from "../../components/Inputs/SearchFilters";
import ReceiptScanner from "../../components/Receipt/ReceiptScanner";
import { LuScanLine } from "react-icons/lu";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const [prefillData, setPrefillData] = useState(null);

  const fetchExpenseDetails = useCallback(
    async (filters = activeFilters) => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE, {
          params: filters,
        });
        if (response.data) setExpenseData(response.data);
      } catch (error) {
        console.log("Something went wrong. Please try again.", error);
      } finally {
        setLoading(false);
      }
    },
    [activeFilters]
  );

  const handleFilter = (params) => {
    setActiveFilters(params);
    fetchExpenseDetails(params);
  };

  const handleFilterReset = () => {
    setActiveFilters({});
    fetchExpenseDetails({});
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category.trim()) { toast.error("Category is required."); return; }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) { toast.error("Date is required."); return; }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, { category, amount, date, icon });
      setOpenAddExpenseModal(false);
      setPrefillData(null);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding expense:", error.response?.data?.message || error.message);
    }
  };

  const deleteExpense = async (id) => {
    if (!id) return;
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      toast.success("Expense deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      fetchExpenseDetails();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download expense details. Please try again.");
    }
  };


  const handleReceiptData = (data) => {
    setPrefillData({
      category: data.category || "",
      amount: data.amount || "",
      date: data.date || "",
      icon: "",
    });
    setOpenReceiptModal(false);
    setOpenAddExpenseModal(true);
  };

  useEffect(() => { fetchExpenseDetails(); return () => {}; }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>


          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800">All Expenses</h5>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenReceiptModal(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  <LuScanLine size={14} /> Scan Receipt
                </button>
              </div>
            </div>

            <SearchFilters
              type="expense"
              onFilter={handleFilter}
              onReset={handleFilterReset}
            />

            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={handleDownloadExpenseDetails}
              hideHeader
            />
          </div>
        </div>


        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => { setOpenAddExpenseModal(false); setPrefillData(null); }}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} prefill={prefillData} />
        </Modal>


        <Modal
          isOpen={openReceiptModal}
          onClose={() => setOpenReceiptModal(false)}
          title="📷 Scan Receipt"
        >
          <ReceiptScanner onDataExtracted={handleReceiptData} />
        </Modal>


        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense details?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;