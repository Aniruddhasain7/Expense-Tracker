import React, { useState, useRef, useCallback } from "react";
import { LuUpload, LuScanLine, LuX, LuCircleCheck } from "react-icons/lu";
import { createWorker } from "tesseract.js";

const parseAmount = (text) => {
  const patterns = [
    /(?:total|amount|grand\s*total|net\s*total|subtotal|sum)[^\d]*?([\d,]+\.?\d*)/i,
    /₹\s*([\d,]+\.?\d*)/,
    /rs\.?\s*([\d,]+\.?\d*)/i,
    /inr\s*([\d,]+\.?\d*)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }
  }

  const numbers = [...text.matchAll(/[\d,]+\.?\d*/g)]
    .map((m) => parseFloat(m[0].replace(/,/g, "")))
    .filter((n) => n > 0 && n < 1000000);
  return numbers.length ? Math.max(...numbers) : null;
};

const parseDate = (text) => {
  const patterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{2,4})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      try {
        const d = new Date(m[0]);
        if (!isNaN(d)) return d.toISOString().split("T")[0];
      } catch (_) {}
    }
  }
  return new Date().toISOString().split("T")[0];
};

const guessCategory = (text) => {
  const t = text.toLowerCase();
  if (/restaurant|cafe|hotel|food|pizza|burger|swiggy|zomato|eat/i.test(t)) return "Food";
  if (/amazon|flipkart|shop|mart|store|mall|purchase/i.test(t)) return "Shopping";
  if (/uber|ola|metro|bus|taxi|fuel|petrol|diesel/i.test(t)) return "Transport";
  if (/pharmacy|medical|hospital|clinic|health/i.test(t)) return "Health";
  if (/electricity|water|gas|bill|utility/i.test(t)) return "Utilities";
  if (/netflix|spotify|youtube|subscription|prime/i.test(t)) return "Entertainment";
  return "Other";
};

const ReceiptScanner = ({ onDataExtracted }) => {
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extracted, setExtracted] = useState(null);
  const [rawText, setRawText] = useState("");
  const fileRef = useRef(null);
  const dropRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanning(true);
    setProgress(0);
    setExtracted(null);
    setRawText("");

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const text = data.text;
      setRawText(text);

      const result = {
        amount: parseAmount(text),
        date: parseDate(text),
        category: guessCategory(text),
        description: text.split("\n")[0]?.trim().slice(0, 60) || "",
      };

      setExtracted(result);
    } catch (err) {
      console.error("OCR Error:", err);
      setExtracted({
        amount: null,
        date: new Date().toISOString().split("T")[0],
        category: "Other",
        description: "",
      });
    } finally {
      setScanning(false);
      setProgress(100);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleUseData = () => {
    if (extracted) onDataExtracted(extracted);
  };

  const handleReset = () => {
    setPreview(null);
    setExtracted(null);
    setRawText("");
    setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {!preview && (
        <div
          ref={dropRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-green-300 dark:border-[#1b3d26] rounded-2xl p-8 bg-green-50/50 dark:bg-[#0c1f13]/20 cursor-pointer hover:bg-green-100/50 dark:hover:bg-[#0c1f13]/40 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-[#0c1f13] flex items-center justify-center text-green-600 dark:text-green-400">
            <LuUpload className="text-2xl" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              Drag & drop your receipt image
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              or click to browse (JPG, PNG, PDF)
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Receipt preview"
            className="w-full max-h-60 object-contain rounded-xl border border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#0c0c0c]"
          />
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 bg-white dark:bg-[#181818] rounded-full p-1.5 shadow-md text-slate-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 cursor-pointer border border-slate-200 dark:border-[#282828]"
            aria-label="Remove image"
          >
            <LuX size={15} />
          </button>
        </div>
      )}

      {scanning && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
            <LuScanLine className="animate-pulse" />
            Scanning receipt… {progress}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#1c1c1c] rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {extracted && !scanning && (
        <div className="border border-green-200 dark:border-[#1b3d26] bg-green-50/70 dark:bg-[#0c1f13]/30 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-sm">
            <LuCircleCheck size={18} />
            Data Extracted — Please verify
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                Amount (₹)
              </label>
              <input
                type="number"
                value={extracted.amount || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, amount: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282828] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                Date
              </label>
              <input
                type="date"
                value={extracted.date || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, date: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282828] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                Category
              </label>
              <input
                type="text"
                value={extracted.category || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, category: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282828] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
                placeholder="e.g. Food"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                Description
              </label>
              <input
                type="text"
                value={extracted.description || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, description: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282828] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Receipt description"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={handleReset}
              className="text-sm text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white px-4 py-2 rounded-xl border border-slate-200 dark:border-[#282828] hover:bg-slate-50 dark:hover:bg-[#1c1c1c] cursor-pointer transition-colors"
            >
              Scan Another
            </button>
            <button
              onClick={handleUseData}
              className="text-sm text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-medium cursor-pointer transition-colors shadow-sm"
            >
              Use This Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
