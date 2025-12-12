import React, { useMemo, useState } from "react";
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
    sourceFile: "",
};

const ease = [0.16, 1, 0.3, 1];

const DataIntegration = () => {
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const previewTitle = useMemo(() => form.name || "Offer name preview", [form.name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // ✅ fixed: {...prev} (your file had a typo) :contentReference[oaicite:1]{index=1}
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Required: name, category, pdfUrl
    const validate = () => {
        if (!form.name.trim()) return false;
        if (!form.category) return false;
        if (!form.pdfUrl.trim()) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!validate()) {
            setError("Merci de remplir tous les champs obligatoires (*) avant de valider.");
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
                    source_file: form.sourceFile || null,
                }),
            });

            if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

            setMessage("Enregistrement effectué avec succès ✅");
            setForm(initialFormState);
        } catch (err) {
            setError(err.message || "Erreur lors de l’enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="h-full min-h-screen bg-gradient-to-br from-[#F3F5FC] via-white to-[#E7F3F0] flex items-start justify-center px-4 py-8 md:py-10"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/70 p-6 md:p-8 space-y-6"
            >
                {/* Top header */}
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
                            Ajoutez ou mettez à jour les offres, conventions et guides dans la base de
                            connaissances utilisée par le moteur de recherche et l’assistant.
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

                {/* Main content */}
                <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
                    {/* Main form */}
                    <motion.form
                        id="data-integration-form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08, ease }}
                        className="space-y-6 rounded-3xl border border-slate-200/70 bg-[#F8FAFF] p-4 md:p-6"
                    >
                        {/* Section header */}
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-500">
                                Métadonnées de l&apos;offre
                            </h2>
                            <span className="text-[11px] text-slate-400">
                <span className="text-red-500">*</span> Champs obligatoires
              </span>
                        </div>

                        {/* Name + Category */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Name / Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                    placeholder="Offre Idoom Fibre Entreprise"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                >
                                    <option value="">Select category</option>
                                    <option value="offres">Offres</option>
                                    <option value="offres_arabe">Offres en arabe</option>
                                    <option value="guide_ngbss">Guide NGBSS</option>
                                    <option value="depot_vente">Dépôt vente</option>
                                    <option value="conventions">Conventions</option>
                                </select>
                            </div>
                        </div>

                        {/* Type / Sector / Partner */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Type (optional)
                                </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                >
                                    <option value="">Select type</option>
                                    <option value="offre">Offre</option>
                                    <option value="convention">Convention</option>
                                    <option value="guide">Guide</option>
                                    <option value="depot_vente">Dépôt vente</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Sector (optional)
                                </label>
                                <input
                                    type="text"
                                    name="sector"
                                    value={form.sector}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                    placeholder="Santé, Éducation, Administration"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Partner (optional)
                                </label>
                                <input
                                    type="text"
                                    name="partner"
                                    value={form.partner}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                    placeholder="Ministère de la Santé"
                                />
                            </div>
                        </div>

                        {/* Language + validity */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Language (optional)
                                </label>
                                <select
                                    name="language"
                                    value={form.language}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                >
                                    <option value="fr">Français</option>
                                    <option value="ar">العربية</option>
                                    <option value="other">Other / Mixed</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Valid from (optional)
                                </label>
                                <input
                                    type="date"
                                    name="validFrom"
                                    value={form.validFrom}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Valid to (optional)
                                </label>
                                <input
                                    type="date"
                                    name="validTo"
                                    value={form.validTo}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700">
                                Description / Key conditions (optional)
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A] min-h-[96px]"
                                placeholder="Short description, key conditions, eligibility, etc."
                            />
                        </div>

                        {/* Submit (mobile-first) */}
                        <div className="flex justify-end pt-2 md:hidden">
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2, ease }}
                                className="inline-flex items-center justify-center rounded-full bg-[#088141] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : "Save entry"}
                            </motion.button>
                        </div>
                    </motion.form>

                    {/* Right column: source + preview + actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.12, ease }}
                        className="space-y-5"
                    >
                        {/* Source document */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.25, ease }}
                            className="border border-slate-200 rounded-3xl bg-white p-4 md:p-5 shadow-sm"
                        >
                            <h2 className="text-sm font-semibold text-[#1F235A] mb-1.5">
                                Source document
                            </h2>
                            <p className="text-xs text-slate-500 mb-4">
                                Lien vers le PDF utilisé comme référence dans la base de connaissances.
                            </p>

                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        PDF URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pdfUrl"
                                        value={form.pdfUrl}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-[#F8FAFF] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                        placeholder="/pdfs/offres/idoom_fibre_entreprise.pdf"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Internal file name (optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="sourceFile"
                                        value={form.sourceFile}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F235A]/30 focus:border-[#1F235A]"
                                        placeholder="offres_business_2025.pdf"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Preview */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.25, ease }}
                            className="border border-slate-200 rounded-3xl bg-[#F8FAFF] p-4 md:p-5"
                        >
                            <h2 className="text-sm font-semibold text-[#1F235A] mb-1.5">
                                Preview
                            </h2>
                            <p className="text-xs text-slate-500 mb-3">
                                Aperçu de la façon dont cette entrée apparaîtra dans l’interface de recherche
                                et pour le chatbot.
                            </p>

                            <motion.div
                                layout
                                transition={{ duration: 0.25, ease }}
                                className="rounded-2xl border border-slate-200 bg-white px-3 py-3 space-y-1"
                            >
                                <div className="text-sm font-semibold text-slate-800 truncate">
                                    {previewTitle}
                                </div>

                                <div className="flex flex-wrap gap-2 text-[11px]">
                                    {form.category && (
                                        <span className="inline-flex rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5">
                      {form.category}
                    </span>
                                    )}
                                    {form.type && (
                                        <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
                      {form.type}
                    </span>
                                    )}
                                    {form.sector && (
                                        <span className="inline-flex rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5">
                      {form.sector}
                    </span>
                                    )}
                                </div>

                                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {form.description || "Key conditions and short description will appear here."}
                                </div>

                                {form.pdfUrl && (
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1F235A]" />
                                        {form.pdfUrl}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Submit (desktop) — ✅ no onClick; submits the form */}
                        <div className="hidden md:flex justify-end">
                            <motion.button
                                type="submit"
                                form="data-integration-form"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2, ease }}
                                className="inline-flex items-center justify-center rounded-full bg-[#088141] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : "Save entry"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DataIntegration;
