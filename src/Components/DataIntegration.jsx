import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialFormState = {
    name: "",
    category: "",
    type: "",
    sector: "",
    partner: "",
    language: "fr",
    validFrom: "",
    validTo: "",
    description: "",
    pdfUrl: "",
    sourceFile: ""
};

const DataIntegration = () => {
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Required: name, category, pdfUrl
    const validate = () => {
        if (!form.name.trim()) return false;
        if (!form.category) return false;
        return form.pdfUrl.trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!validate()) {
            setError("Please fill all required fields (*) before submitting.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/offers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    category: form.category,
                    type: form.type || null,
                    sector: form.sector || null,
                    partner: form.partner || null,
                    language: form.language || null,
                    valid_from: form.validFrom || null,
                    valid_to: form.validTo || null,
                    description: form.description || null,
                    pdf_url: form.pdfUrl,
                    source_file: form.sourceFile || null
                })
            });

            if (!res.ok) {
                throw new Error(`Server responded with status ${res.status}`);
            }

            setMessage("Record inserted successfully ✅");
            setForm(initialFormState);
        } catch (err) {
            setError(err.message || "Error while inserting data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full bg-white ml-[3vw] flex items-center justify-center px-4 py-3">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-white rounded-3xl shadow-lg border border-slate-200 p-6 md:p-8"
            >
                {/* Top header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                >
                    <div>
                        <h1 className="text-2xl md:text-6xl font-bold text-[#1F235A]">
                            Data Integration
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Phase 3 · Add or update offers, conventions and guides in the
                            knowledge base.
                        </p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-start md:items-end text-xs"
                    >
                        <span className="uppercase tracking-wide text-slate-500">
                            Hackathon FORSA tic
                        </span>
                        <span className="mt-1 inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                            Intelligent Assistant · Data Layer
                        </span>
                    </motion.div>
                </motion.div>

                {/* Alerts */}
                <AnimatePresence>
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 text-sm"
                        >
                            {message}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4 rounded-xl bg-red-50 text-red-800 border border-red-200 px-4 py-2 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main form */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left: metadata fields */}
                    <div className="md:col-span-2 space-y-5">
                        {/* Name + Category */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid md:grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Name / Title *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                    placeholder="Offre Idoom Fibre Entreprise"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                >
                                    <option value="">Select category</option>
                                    <option value="offres">Offres</option>
                                    <option value="offres_arabe">Offres en arabe</option>
                                    <option value="guide_ngbss">Guide NGBSS</option>
                                    <option value="depot_vente">Dépôt vente</option>
                                    <option value="conventions">Conventions</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* Type / Sector / Partner */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid md:grid-cols-3 gap-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Type (optional)
                                </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                >
                                    <option value="">Select type</option>
                                    <option value="offre">Offre</option>
                                    <option value="convention">Convention</option>
                                    <option value="guide">Guide</option>
                                    <option value="depot_vente">Dépôt vente</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Sector (optional)
                                </label>
                                <input
                                    type="text"
                                    name="sector"
                                    value={form.sector}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                    placeholder="Santé, Éducation, Administration"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Partner (optional)
                                </label>
                                <input
                                    type="text"
                                    name="partner"
                                    value={form.partner}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                    placeholder="Ministère de la Santé"
                                />
                            </div>
                        </motion.div>

                        {/* Language + validity */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="grid md:grid-cols-3 gap-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Language (optional)
                                </label>
                                <select
                                    name="language"
                                    value={form.language}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                >
                                    <option value="fr">Français</option>
                                    <option value="ar">العربية</option>
                                    <option value="other">Other / Mixed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Valid from (optional)
                                </label>
                                <input
                                    type="date"
                                    name="validFrom"
                                    value={form.validFrom}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Valid to (optional)
                                </label>
                                <input
                                    type="date"
                                    name="validTo"
                                    value={form.validTo}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Description / Key conditions (optional)
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] min-h-[96px] transition-all"
                                placeholder="Short description, key conditions, eligibility, etc."
                            />
                        </motion.div>
                    </div>

                    {/* Right: PDF + actions / preview */}
                    <div className="space-y-5">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            className="border border-slate-200 rounded-2xl p-4 bg-slate-50"
                        >
                            <h2 className="text-sm font-semibold text-[#1F235A] mb-3">
                                Source document
                            </h2>

                            <div className="mb-3">
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    PDF URL *
                                </label>
                                <input
                                    type="text"
                                    name="pdfUrl"
                                    value={form.pdfUrl}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                    placeholder="/pdfs/offres/idoom_fibre_entreprise.pdf"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Internal file name (optional)
                                </label>
                                <input
                                    type="text"
                                    name="sourceFile"
                                    value={form.sourceFile}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/40 focus:border-[#1F235A] transition-all"
                                    placeholder="offres_business_2025.pdf"
                                />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            className="border border-slate-200 rounded-2xl p-4 bg-white"
                        >
                            <h2 className="text-sm font-semibold text-[#1F235A] mb-2">
                                Preview
                            </h2>
                            <p className="text-xs text-slate-500 mb-3">
                                This is how this entry will appear to the search engine and
                                chatbot.
                            </p>

                            <motion.div 
                                key={form.name + form.category + form.type}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 space-y-1"
                            >
                                <div className="text-sm font-semibold text-slate-800 truncate">
                                    {form.name || "Offer name preview"}
                                </div>
                                <div className="flex flex-wrap gap-2 text-[11px]">
                                    <AnimatePresence>
                                        {form.category && (
                                            <motion.span 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                                className="inline-flex rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5"
                                            >
                                                {form.category}
                                            </motion.span>
                                        )}
                                        {form.type && (
                                            <motion.span 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                                className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5"
                                            >
                                                {form.type}
                                            </motion.span>
                                        )}
                                        {form.sector && (
                                            <motion.span 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                                className="inline-flex rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5"
                                            >
                                                {form.sector}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <motion.div 
                                    key={form.description}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-xs text-slate-500 mt-1 line-clamp-2"
                                >
                                    {form.description ||
                                        "Key conditions and short description will appear here."}
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex justify-end"
                        >
                            <motion.button
                                onClick={handleSubmit}
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.05 }}
                                whileTap={{ scale: loading ? 1 : 0.95 }}
                                className="inline-flex items-center justify-center rounded-full bg-[#088141] px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    "Save entry"
                                )}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DataIntegration;