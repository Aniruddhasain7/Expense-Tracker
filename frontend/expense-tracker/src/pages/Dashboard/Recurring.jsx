import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Modal } from "../../components/Modal";
import AddRecurringForm from "../../components/Recurring/AddRecurringForm";
import RecurringList from "../../components/Recurring/RecurringList";
import DeleteAlert from "../../components/DeleteAlert";
import { LuRepeat, LuPlus, LuRefreshCw, LuTrendingUp, LuTrendingDown } from "react-icons/lu";

const Recurring = () => {
  useUserAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const fetchRecurring = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.RECURRING.GET_ALL);
      if (res.data) setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (form) => {
    const { type, title, amount, startDate } = form;
    if (!title.trim()) { toast.error("Title is required."); return; }
    if (!amount || isNaN(amount) || Number(amount) <= 0) { toast.error("Enter a valid amount."); return; }
    if (!startDate) { toast.error("Start date is required."); return; }
    try {
      await axiosInstance.post(API_PATHS.RECURRING.CREATE, {
        ...form,
        category: type === "expense" ? title : undefined,
        source: type === "income" ? title : undefined,
      });
      toast.success("Recurring transaction added!");
      setOpenAdd(false);
      fetchRecurring();
    } catch (err) {
      toast.error("Failed to add recurring transaction.");
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axiosInstance.put(API_PATHS.RECURRING.UPDATE(id), { isActive });
      toast.success(isActive ? "Resumed" : "Paused");
      fetchRecurring();
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.RECURRING.DELETE(id));
      toast.success("Deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      fetchRecurring();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const handleProcessDue = async () => {
    setProcessing(true);
    try {
      const res = await axiosInstance.post(API_PATHS.RECURRING.PROCESS_DUE);
      const count = res.data?.processed || 0;
      toast.success(
        count > 0
          ? `✅ ${count} due transaction${count > 1 ? "s" : ""} auto-added!`
          : "No due transactions at this time."
      );
      fetchRecurring();
    } catch (err) {
      toast.error("Failed to process due transactions.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => { fetchRecurring(); }, []);


  const active = items.filter((i) => i.isActive);
  const monthlyIncome = active
    .filter((i) => i.type === "income" && i.frequency === "monthly")
    .reduce((s, i) => s + i.amount, 0);
  const monthlyExpense = active
    .filter((i) => i.type === "expense" && i.frequency === "monthly")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <DashboardLayout activeMenu="Recurring">
      <div className="my-5 mx-auto">


        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <LuRepeat className="text-green-500" /> Recurring Transactions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Auto-add salary, rent, subscriptions &amp; EMI
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleProcessDue}
              disabled={processing}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-500 hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LuRefreshCw className={processing ? "animate-spin" : ""} size={15} />
              {processing ? "Processing…" : "Process Due"}
            </button>
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer"
            >
              <LuPlus size={15} />
              Add New
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active Rules</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{active.length}</p>
            <p className="text-xs text-gray-400 mt-1">{items.length - active.length} paused</p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1">
              <LuTrendingUp className="text-green-500" /> Monthly Income
            </p>
            <p className="text-3xl font-bold text-green-500 mt-2">
              ₹{monthlyIncome.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1">
              <LuTrendingDown className="text-red-500" /> Monthly Expense
            </p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              ₹{monthlyExpense.toLocaleString("en-IN")}
            </p>
          </div>
        </div>


        <div className="card">
          <h5 className="text-base font-semibold text-gray-800 mb-1">All Recurring Rules</h5>
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm">Loading…</div>
          ) : (
            <RecurringList
              items={items}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onToggle={handleToggle}
            />
          )}
        </div>


        <Modal isOpen={openAdd} onClose={() => setOpenAdd(false)} title="New Recurring Transaction">
          <AddRecurringForm onAdd={handleAdd} />
        </Modal>


        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Recurring"
        >
          <DeleteAlert
            content="Are you sure you want to delete this recurring transaction?"
            onDelete={() => handleDelete(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Recurring;
