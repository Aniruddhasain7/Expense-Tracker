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
      setExtracted({ amount: null, date: new Date().toISOString().split("T")[0], category: "Other", description: "" });
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
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-green-300 rounded-2xl p-10 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <LuUpload className="text-2xl text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Drag & drop your receipt</p>
            <p className="text-xs text-gray-400 mt-1">or click to browse (JPG, PNG, PDF)</p>
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
            className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
          />
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <LuX size={16} />
          </button>
        </div>
      )}


      {scanning && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <LuScanLine className="animate-pulse" />
            Scanning receipt… {progress}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}


      {extracted && !scanning && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
            <LuCircleCheck />
            Data Extracted — Please verify
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Amount (₹)</label>
              <input
                type="number"
                value={extracted.amount || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, amount: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Date</label>
              <input
                type="date"
                value={extracted.date || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, date: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Category</label>
              <input
                type="text"
                value={extracted.category || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, category: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                placeholder="e.g. Food"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Description</label>
              <input
                type="text"
                value={extracted.description || ""}
                onChange={({ target }) =>
                  setExtracted({ ...extracted, description: target.value })
                }
                className="w-full mt-1 text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Receipt description"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              Scan Another
            </button>
            <button
              onClick={handleUseData}
              className="text-sm text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg cursor-pointer transition-colors"
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
