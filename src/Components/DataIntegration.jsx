import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

const DataIntegration = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  };

  // Delete a file from the list
  const handleDeleteFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Simulated upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (files.length === 0) throw new Error("Veuillez sélectionner un fichier.");

      // Simulate upload
      await new Promise((res) => setTimeout(res, 1000));

      setMessage("Fichier(s) uploadé(s) avec succès !");
      setFiles([]);
    } catch (err) {
      setError(err.message || "Erreur lors de l’upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      className="h-full min-h-screen flex items-start justify-center px-4 py-8 md:py-3"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/70 p-6 md:p-8 space-y-6"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F235A] leading-tight">
              Data Integration
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Téléversez vos fichiers et supprimez ceux que vous ne souhaitez pas conserver.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end text-xs gap-2">
            <span className="uppercase tracking-[0.18em] text-slate-500">
              Hackathon FORSA TIC
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Intelligent Assistant · Data Layer
            </span>
          </div>
        </motion.header>

        {/* Alerts */}
        <AnimatePresence mode="popLayout">
          {message && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.25, ease }}
              className="rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 text-sm flex items-start gap-2"
            >
              <span className="mt-[2px]">✅</span>
              <p>{message}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.25, ease }}
              className="rounded-2xl bg-red-50 text-red-800 border border-red-200 px-4 py-3 text-sm flex items-start gap-2"
            >
              <span className="mt-[2px]">⚠️</span>
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
          {/* Upload form */}
          <motion.form
            id="data-upload-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease }}
            className="space-y-6 rounded-3xl border border-slate-200/70 bg-[#F8FAFF] p-4 md:p-6"
          >
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-500">
              Upload des fichiers
            </h2>

            {/* File input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Choisissez un ou plusieurs fichiers
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            {/* Selected files with delete */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-600">Fichiers sélectionnés :</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-between"
                    >
                      <div className="flex-1 truncate">{file.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(index)}
                          className="text-red-500 text-xs hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile submit */}
            <div className="flex justify-end pt-2 md:hidden">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full bg-[#088141] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload"}
              </motion.button>
            </div>
          </motion.form>

          {/* Preview column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease }}
            className="space-y-5"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, ease }}
              className="border border-slate-200 rounded-3xl bg-[#F8FAFF] p-4 md:p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-[#1F235A] mb-2">Preview</h2>

              {files.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Aucun fichier sélectionné. Choisissez un fichier pour voir l’aperçu.
                </p>
              ) : (
                <ul className="space-y-3">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="rounded-2xl bg-white border border-slate-200 px-3 py-3 flex flex-col"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-slate-800 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(index)}
                          className="text-red-500 text-xs hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                      <span className="text-xs text-slate-500">{file.type}</span>
                      <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* Desktop submit */}
            <div className="hidden md:flex justify-end">
              <motion.button
                type="submit"
                form="data-upload-form"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full bg-[#088141] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DataIntegration;
