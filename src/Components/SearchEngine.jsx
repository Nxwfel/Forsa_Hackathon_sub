import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Config ----------
const API_BASE = "https://forsahackathonbackendek.onrender.com";

// IMPORTANT: your document server
const DOCUMENTS_BASE = "http://10.34.132.94:8000/documents/";

const ENDPOINTS = {
  offre: "/offres/all",
  convention: "/conventions/all",
  guide: "/guides_ngbss/all",
  equipment: "/equipments/all",
};

const TYPE_LABELS = {
  all: "Tout",
  offre: "Offres",
  convention: "Conventions",
  guide: "Guides",
  equipment: "Équipements",
};

// ---------- Helpers ----------
async function postJSON(url, body, { signal } = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    signal,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const message =
        (data && data.detail && JSON.stringify(data.detail)) ||
        (typeof data === "string" ? data : "") ||
        `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

function normalizeResponse(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.items)) return payload.items;

  if (typeof payload === "object") {
    const values = Object.values(payload);
    if (values.every((v) => v && typeof v === "object" && !Array.isArray(v))) return values;
    if (values.some(Array.isArray)) {
      const arrays = values.filter(Array.isArray);
      arrays.sort((a, b) => b.length - a.length);
      return arrays[0] || [];
    }
  }
  return [];
}

function isEmptyValue(v) {
  return v === null || v === undefined || v === "";
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

// --- build a doc object even if fields are top-level (your example JSON) ---
function extractDoc(raw, possibleDoc) {
  // If API already gives nested doc object
  if (possibleDoc && typeof possibleDoc === "object") {
    const sp = possibleDoc.source_path ?? possibleDoc.path ?? null;
    if (sp) {
      return {
        document_type: possibleDoc.document_type ?? null,
        document_name: possibleDoc.document_name ?? null,
        source_path: sp,
      };
    }
  }

  // If API gives doc fields at top-level (your example)
  const sp2 = raw?.source_path ?? raw?.path ?? null;
  if (sp2) {
    return {
      document_type: raw?.document_type ?? null,
      document_name: raw?.document_name ?? null,
      source_path: sp2,
    };
  }

  return null;
}

// --- convert "..\\data\\Guide NGBSS\\file.pdf" => "Guide NGBSS/file.pdf" ---
function stripToRelativeDocPath(sourcePath) {
  if (!sourcePath) return "";
  let s = String(sourcePath).trim();

  // normalize slashes
  s = s.replace(/\\/g, "/");

  // remove Windows drive if exists: "C:/..."
  s = s.replace(/^[a-zA-Z]:\//, "");

  // remove leading ./ or ../
  s = s.replace(/^(\.\/)+/, "");
  s = s.replace(/^(\.\.\/)+/, "");

  // if contains "/data/", keep only after it
  const idx = s.toLowerCase().indexOf("/data/");
  if (idx >= 0) s = s.slice(idx + "/data/".length);

  // also handle if it starts with "data/"
  s = s.replace(/^data\//i, "");

  // remove leading slashes
  s = s.replace(/^\/+/, "");

  return s;
}

// --- encode each segment but keep "/" separators ---
function encodePathPreservingSlashes(path) {
  return path
      .split("/")
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join("/");
}

function buildDocumentUrl(sourcePath) {
  const rel = stripToRelativeDocPath(sourcePath);
  if (!rel) return null;
  const encoded = encodePathPreservingSlashes(rel);
  return `${DOCUMENTS_BASE}${encoded}`;
}

// ---------- Mapping (API -> UI unified item) ----------
function mapToUnifiedItem(type, raw) {
  if (type === "offre") {
    const possibleDoc = raw.offer_doc || raw.doc || raw.document || null;
    const doc = extractDoc(raw, possibleDoc);
    const title = raw.offer_name || raw.name || raw.title || "Sans titre";
    return {
      type,
      title,
      summary: raw.summary ?? "",
      keywords: safeArray(raw.keywords),
      meta: {
        customer_segment: raw.customer_segment ?? null,
        geography: raw.geography ?? null,
        start_date: raw.start_date ?? null,
        end_date: raw.end_date ?? null,
        price_info: raw.price_info ?? null,
        conditions: raw.conditions ?? null,
      },
      doc,
      raw,
    };
  }

  if (type === "convention") {
    const possibleDoc = raw.convention_doc || raw.doc || raw.document || null;
    const doc = extractDoc(raw, possibleDoc);
    const title = raw.convention_name || raw.name || raw.title || "Sans titre";
    return {
      type,
      title,
      summary: raw.summary ?? "",
      keywords: safeArray(raw.keywords),
      meta: {
        partner_name: raw.partner_name ?? null,
        sector: raw.sector ?? null,
        geography: raw.geography ?? null,
        start_date: raw.start_date ?? null,
        end_date: raw.end_date ?? null,
        main_benefits: raw.main_benefits ?? null,
        obligations_at: raw.obligations_at ?? null,
        obligations_partner: raw.obligations_partner ?? null,
        conditions: raw.conditions ?? null,
        applicable_offers: safeArray(raw.applicable_offers),
      },
      doc,
      raw,
    };
  }

  if (type === "guide") {
    const possibleDoc = raw.guide_doc || raw.doc || raw.document || null;
    const doc = extractDoc(raw, possibleDoc);
    const title = raw.guide_name || raw.name || raw.title || "Sans titre";
    return {
      type,
      title,
      summary: raw.summary ?? "",
      keywords: safeArray(raw.keywords),
      meta: {
        module: raw.module ?? null,
        operation_name: raw.operation_name ?? null,
        prerequisites: safeArray(raw.prerequisites),
        outputs: safeArray(raw.outputs),
        step_by_step: safeArray(raw.step_by_step),
      },
      doc,
      raw,
    };
  }

  if (type === "equipment") {
    const possibleDoc = raw.equipment_doc || raw.doc || raw.document || null;
    const doc = extractDoc(raw, possibleDoc);
    const title = raw.equipment_name || raw.name || raw.title || "Sans titre";
    return {
      type,
      title,
      summary: raw.summary ?? "",
      keywords: safeArray(raw.keywords),
      meta: {
        category: raw.category ?? null,
        brand: raw.brand ?? null,
        model: raw.model ?? null,
        technical_specs: raw.technical_specs ?? null,
        price_info: raw.price_info ?? null,
        conditions: raw.conditions ?? null,
        compatible_offers: safeArray(raw.compatible_offers),
      },
      doc,
      raw,
    };
  }

  return {
    type,
    title: raw?.name || raw?.title || "Sans titre",
    summary: raw?.summary ?? "",
    keywords: safeArray(raw?.keywords),
    meta: {},
    doc: extractDoc(raw, raw?.doc || raw?.document || null),
    raw,
  };
}

// ---------- Build filter bodies (OpenAPI schemas) ----------
function buildOfferBody({ query, offerFilters }) {
  return {
    name: isEmptyValue(query) ? null : query,
    summary: isEmptyValue(query) ? null : query,
    keywords: isEmptyValue(query) ? null : [query],
    customer_segment: offerFilters.customer_segment || null,
    geography: offerFilters.geography || null,
    start_date: offerFilters.start_date || null,
    end_date: offerFilters.end_date || null,
  };
}

function buildConventionBody({ query, conventionFilters }) {
  return {
    convention_name: isEmptyValue(query) ? null : query,
    partner_name: conventionFilters.partner_name || null,
    sector: conventionFilters.sector || null,
    geography: conventionFilters.geography || null,
    summary: isEmptyValue(query) ? null : query,
    applicable_offers: conventionFilters.applicable_offers
        ? conventionFilters.applicable_offers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
    start_date: conventionFilters.start_date || null,
    end_date: conventionFilters.end_date || null,
    keywords: isEmptyValue(query) ? null : [query],
  };
}

function buildGuideBody({ query, guideFilters }) {
  return {
    guide_name: isEmptyValue(query) ? null : query,
    module: guideFilters.module || null,
    operation_name: guideFilters.operation_name || null,
    summary: isEmptyValue(query) ? null : query,
  };
}

function buildEquipmentBody({ query, equipmentFilters }) {
  return {
    equipment_name: isEmptyValue(query) ? null : query,
    category: equipmentFilters.category || null,
    brand: equipmentFilters.brand || null,
    model: equipmentFilters.model || null,
    summary: isEmptyValue(query) ? null : query,
    compatible_offers: equipmentFilters.compatible_offers
        ? equipmentFilters.compatible_offers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
  };
}

// ---------- Client-side quick match (extra UX) ----------
function clientMatch(item, q) {
  const query = (q || "").trim().toLowerCase();
  if (!query) return true;

  const hay = [
    item.title,
    item.summary,
    ...(item.keywords || []),
    ...(Object.values(item.meta || {}).flatMap((v) => (Array.isArray(v) ? v : [v]))),
    item.doc?.document_name,
    item.doc?.document_type,
    item.doc?.source_path,
  ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  return hay.includes(query);
}

const Search = () => {
  // --------- UI state ---------
  const [toast, setToast] = useState({ visible: false, type: "info", message: "" });
  const showToast = (message, type = "info") => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
  };

  const [activeType, setActiveType] = useState("all");
  const [query, setQuery] = useState("");

  const [offerFilters, setOfferFilters] = useState({
    customer_segment: "",
    geography: "",
    start_date: "",
    end_date: "",
  });

  const [conventionFilters, setConventionFilters] = useState({
    partner_name: "",
    sector: "",
    geography: "",
    start_date: "",
    end_date: "",
    applicable_offers: "",
  });

  const [guideFilters, setGuideFilters] = useState({
    module: "",
    operation_name: "",
  });

  const [equipmentFilters, setEquipmentFilters] = useState({
    category: "",
    brand: "",
    model: "",
    compatible_offers: "",
  });

  const [raw, setRaw] = useState({ offre: [], convention: [], guide: [], equipment: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const targets = useMemo(() => {
    if (activeType === "all") return ["offre", "convention", "guide", "equipment"];
    return [activeType];
  }, [activeType]);

  const counts = useMemo(() => {
    const c = {
      offre: raw.offre.length,
      convention: raw.convention.length,
      guide: raw.guide.length,
      equipment: raw.equipment.length,
    };
    c.all = c.offre + c.convention + c.guide + c.equipment;
    return c;
  }, [raw]);

  const unified = useMemo(() => {
    const list = [];
    for (const t of targets) list.push(...raw[t].map((r) => mapToUnifiedItem(t, r)));
    return uniqBy(list, (x) => `${x.type}|${x.title}|${x.doc?.document_name || ""}|${x.doc?.source_path || ""}`);
  }, [raw, targets]);

  const filteredItems = useMemo(() => unified.filter((x) => clientMatch(x, query)), [unified, query]);

  const activeFilterCount = useMemo(() => {
    const base = [query, activeType !== "all" ? activeType : ""].filter(Boolean).length;

    const offerCount = [offerFilters.customer_segment, offerFilters.geography, offerFilters.start_date, offerFilters.end_date]
        .filter((v) => v && v.toString().trim() !== "")
        .length;

    const convCount = [
      conventionFilters.partner_name,
      conventionFilters.sector,
      conventionFilters.geography,
      conventionFilters.start_date,
      conventionFilters.end_date,
      conventionFilters.applicable_offers,
    ].filter((v) => v && v.toString().trim() !== "").length;

    const guideCount = [guideFilters.module, guideFilters.operation_name]
        .filter((v) => v && v.toString().trim() !== "")
        .length;

    const equipCount = [equipmentFilters.category, equipmentFilters.brand, equipmentFilters.model, equipmentFilters.compatible_offers]
        .filter((v) => v && v.toString().trim() !== "")
        .length;

    if (activeType === "offre") return base + offerCount;
    if (activeType === "convention") return base + convCount;
    if (activeType === "guide") return base + guideCount;
    if (activeType === "equipment") return base + equipCount;
    return base + offerCount + convCount + guideCount + equipCount;
  }, [query, activeType, offerFilters, conventionFilters, guideFilters, equipmentFilters]);

  async function fetchAll() {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const tasks = targets.map(async (t) => {
        const url = `${API_BASE}${ENDPOINTS[t]}`;

        let body = {};
        if (t === "offre") body = buildOfferBody({ query, offerFilters });
        if (t === "convention") body = buildConventionBody({ query, conventionFilters });
        if (t === "guide") body = buildGuideBody({ query, guideFilters });
        if (t === "equipment") body = buildEquipmentBody({ query, equipmentFilters });

        const payload = await postJSON(url, body, { signal: controller.signal });
        return [t, normalizeResponse(payload)];
      });

      const results = await Promise.all(tasks);
      setRaw((prev) => {
        const next = { ...prev };
        for (const [t, arr] of results) next[t] = arr;
        return next;
      });
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError("Impossible de récupérer les données depuis l'API (vérifie les endpoints).");
      showToast("Erreur API – impossible de charger les données", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchAll(), 350);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, query, offerFilters, conventionFilters, guideFilters, equipmentFilters]);

  // ---------- UI handlers ----------
  const handleQuickKeyword = (keyword) => setQuery(keyword);

  const handleSearchClick = () => {
    showToast("Recherche mise à jour", "info");
    fetchAll();
  };

  // ✅ "Voir" now opens the downloadable document URL
  const handleViewItem = (item) => {
    const url = buildDocumentUrl(item?.doc?.source_path);
    if (!url) {
      showToast("Aucun document disponible pour cet élément.", "error");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    showToast("Ouverture du document…", "success");
  };

  // Keep this button too (uses same logic)
  const handleOpenDoc = (item) => handleViewItem(item);

  const resetAll = () => {
    setQuery("");
    setActiveType("all");
    setOfferFilters({ customer_segment: "", geography: "", start_date: "", end_date: "" });
    setConventionFilters({
      partner_name: "",
      sector: "",
      geography: "",
      start_date: "",
      end_date: "",
      applicable_offers: "",
    });
    setGuideFilters({ module: "", operation_name: "" });
    setEquipmentFilters({ category: "", brand: "", model: "", compatible_offers: "" });
    showToast("Filtres réinitialisés", "info");
  };

  const toastColors = {
    info: "bg-[#1F235A] text-white",
    success: "bg-[#088141] text-white",
    error: "bg-red-600 text-white",
  };

  const FilterCard2 = () => {
    if (activeType === "offre") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Segment client</p>
            <input
                type="text"
                value={offerFilters.customer_segment}
                onChange={(e) => setOfferFilters((p) => ({ ...p, customer_segment: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: B2B / Particulier…"
            />
          </>
      );
    }

    if (activeType === "convention") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Partenaire</p>
            <input
                type="text"
                value={conventionFilters.partner_name}
                onChange={(e) => setConventionFilters((p) => ({ ...p, partner_name: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: SONATRACH…"
            />
          </>
      );
    }

    if (activeType === "guide") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Module</p>
            <input
                type="text"
                value={guideFilters.module}
                onChange={(e) => setGuideFilters((p) => ({ ...p, module: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: Billing…"
            />
          </>
      );
    }

    if (activeType === "equipment") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Catégorie</p>
            <input
                type="text"
                value={equipmentFilters.category}
                onChange={(e) => setEquipmentFilters((p) => ({ ...p, category: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: Router…"
            />
          </>
      );
    }

    return (
        <>
          <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Partenaire (Conventions)</p>
          <input
              type="text"
              value={conventionFilters.partner_name}
              onChange={(e) => setConventionFilters((p) => ({ ...p, partner_name: e.target.value }))}
              className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
              placeholder="ex: SONATRACH…"
          />
          <div className="h-2" />
          <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Segment (Offres)</p>
          <input
              type="text"
              value={offerFilters.customer_segment}
              onChange={(e) => setOfferFilters((p) => ({ ...p, customer_segment: e.target.value }))}
              className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
              placeholder="ex: B2B…"
          />
        </>
    );
  };

  const FilterCard3 = () => {
    if (activeType === "offre") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Géographie</p>
            <input
                type="text"
                value={offerFilters.geography}
                onChange={(e) => setOfferFilters((p) => ({ ...p, geography: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: Algeria…"
            />
          </>
      );
    }

    if (activeType === "convention") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Secteur</p>
            <input
                type="text"
                value={conventionFilters.sector}
                onChange={(e) => setConventionFilters((p) => ({ ...p, sector: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: Telecom…"
            />
            <div className="h-2" />
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Géographie</p>
            <input
                type="text"
                value={conventionFilters.geography}
                onChange={(e) => setConventionFilters((p) => ({ ...p, geography: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: Algeria…"
            />
          </>
      );
    }

    if (activeType === "guide") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Opération</p>
            <input
                type="text"
                value={guideFilters.operation_name}
                onChange={(e) => setGuideFilters((p) => ({ ...p, operation_name: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: Create invoice…"
            />
          </>
      );
    }

    if (activeType === "equipment") {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Marque</p>
            <input
                type="text"
                value={equipmentFilters.brand}
                onChange={(e) => setEquipmentFilters((p) => ({ ...p, brand: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: Cisco…"
            />
            <div className="h-2" />
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Modèle</p>
            <input
                type="text"
                value={equipmentFilters.model}
                onChange={(e) => setEquipmentFilters((p) => ({ ...p, model: e.target.value }))}
                className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                placeholder="ex: 2901…"
            />
          </>
      );
    }

    return (
        <>
          <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Géographie (Offres + Conventions)</p>
          <input
              type="text"
              value={offerFilters.geography}
              onChange={(e) => {
                const v = e.target.value;
                setOfferFilters((p) => ({ ...p, geography: v }));
                setConventionFilters((p) => ({ ...p, geography: v }));
              }}
              className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
              placeholder="ex: Algeria…"
          />
          <div className="h-2" />
          <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Secteur (Conventions)</p>
          <input
              type="text"
              value={conventionFilters.sector}
              onChange={(e) => setConventionFilters((p) => ({ ...p, sector: e.target.value }))}
              className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
              placeholder="ex: Telecom…"
          />
        </>
    );
  };

  const FilterCard4 = () => {
    const showDates = activeType === "offre" || activeType === "convention" || activeType === "all";
    if (!showDates) {
      return (
          <>
            <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Validité</p>
            <div className="text-xs text-[#666]">
              Non applicable pour <b>{TYPE_LABELS[activeType]}</b>.
            </div>
          </>
      );
    }

    const startVal = activeType === "convention" ? conventionFilters.start_date : offerFilters.start_date;
    const endVal = activeType === "convention" ? conventionFilters.end_date : offerFilters.end_date;

    const setStart = (v) => {
      if (activeType === "convention") setConventionFilters((p) => ({ ...p, start_date: v }));
      else if (activeType === "offre") setOfferFilters((p) => ({ ...p, start_date: v }));
      else {
        setOfferFilters((p) => ({ ...p, start_date: v }));
        setConventionFilters((p) => ({ ...p, start_date: v }));
      }
    };

    const setEnd = (v) => {
      if (activeType === "convention") setConventionFilters((p) => ({ ...p, end_date: v }));
      else if (activeType === "offre") setOfferFilters((p) => ({ ...p, end_date: v }));
      else {
        setOfferFilters((p) => ({ ...p, end_date: v }));
        setConventionFilters((p) => ({ ...p, end_date: v }));
      }
    };

    return (
        <>
          <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Validité</p>
          <div className="flex gap-2 flex-nowrap">
            <input
                type="date"
                value={startVal}
                onChange={(e) => setStart(e.target.value)}
                className="basis-1/2 min-w-0 bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-[#1F235A33]"
            />
            <input
                type="date"
                value={endVal}
                onChange={(e) => setEnd(e.target.value)}
                className="basis-1/2 min-w-0 bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-[#1F235A33]"
            />
          </div>
        </>
    );
  };

  return (
      <AnimatePresence mode="wait">
        <motion.section
            id="search"
            className="relative min-h-screen w-full text-[#1F235A] bg-gradient-to-br from-[#F3F5FC] via-white to-[#E7F3F0] py-6 px-4 md:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Toast */}
          <AnimatePresence>
            {toast.visible && (
                <motion.div
                    className="fixed top-4 right-4 z-50"
                    initial={{ opacity: 0, x: 40, y: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 40, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <div className={`min-w-[260px] max-w-xs px-4 py-3 rounded-xl shadow-lg flex items-start gap-3 ${toastColors[toast.type]}`}>
                <span className="mt-0.5">
                  {toast.type === "success" && "✅"}
                  {toast.type === "error" && "⚠️"}
                  {toast.type === "info" && "ℹ️"}
                </span>
                    <p className="text-sm">{toast.message}</p>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="mx-auto w-full max-w-6xl h-full flex flex-col gap-6">
            {/* Header */}
            <motion.header
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div>
                <div className="inline-flex items-center rounded-full border border-[#1F235A1A] bg-[#1F235A0A] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#1F235A] mb-3">
                  Moteur de recherche · Offres · Conventions · Guides · Équipements
                </div>
                <h2 className="text-4xl md:text-5xl poppins font-bold mb-2 leading-tight">Recherche unifiée</h2>
              </div>

              <motion.div
                  className="flex flex-col items-start md:items-end gap-1 text-xs text-[#666]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              >
                <span className="uppercase tracking-[0.18em] text-[#999]">Forsa · Assistant</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#0881414D] bg-[#E7F6EF] px-3 py-1 text-[11px] font-medium text-[#088141]">
                <span className="h-2 w-2 rounded-full bg-[#088141] animate-pulse" />
                Base: {API_BASE}
              </span>
              </motion.div>
            </motion.header>

            {/* Search Bar */}
            <motion.div
                className="bg-white/90 border border-[#1F235A1A] rounded-2xl p-4 md:p-5 shadow-sm w-full backdrop-blur-sm space-y-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            >
              <div className="flex flex-col md:flex-row gap-3 w-full">
                <div className="relative flex-1">
                  <motion.span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base"
                      animate={loading ? { rotate: 15 } : { rotate: 0 }}
                      transition={loading ? { repeat: Infinity, repeatType: "reverse", duration: 0.4, ease: "easeInOut" } : { duration: 0.2 }}
                  >
                    🔍
                  </motion.span>
                  <input
                      type="text"
                      placeholder="Nom, résumé, mots-clés, partenaire, module, marque…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-[#f9fafc] border border-[#1F235A33] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33] focus:border-[#1F235A]"
                  />
                </div>

                <motion.button
                    onClick={handleSearchClick}
                    className="bg-[#1F235A] hover:bg-[#088141] transition-colors text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm flex items-center justify-center"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                >
                  Rechercher
                </motion.button>

                <motion.button
                    onClick={resetAll}
                    className="border border-[#1F235A26] bg-white hover:bg-[#f4f4f4] transition-colors px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm flex items-center justify-center"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                >
                  Reset
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  {["fibre", "éducation", "administration", "cloud", "cisco", "billing"].map((k) => (
                      <motion.button
                          key={k}
                          onClick={() => handleQuickKeyword(k)}
                          className="px-3 py-1 rounded-full border border-[#1F235A26] bg-white hover:bg-[#F0F3FA] text-[#1F235A] transition-colors"
                          whileHover={{ y: -1, boxShadow: "0 4px 10px rgba(31,35,90,0.12)" }}
                          whileTap={{ scale: 0.96 }}
                      >
                        #{k}
                      </motion.button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#666]">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1F235A0D] text-[#1F235A] text-[10px] font-semibold">
                  i
                </span>
                  <span>{activeFilterCount > 0 ? `${activeFilterCount} filtre(s) actif(s)` : "Aucun filtre avancé appliqué"}</span>
                </div>
              </div>

              {/* Type pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {["all", "offre", "convention", "guide", "equipment"].map((t) => {
                  const active = activeType === t;
                  const count = t === "all" ? counts.all : counts[t];
                  return (
                      <motion.button
                          key={t}
                          onClick={() => setActiveType(t)}
                          className={[
                            "px-3 py-1 rounded-full border text-xs transition-colors",
                            active ? "border-[#08814166] bg-[#08814112] text-[#088141]" : "border-[#1F235A26] bg-white hover:bg-[#F0F3FA] text-[#1F235A]",
                          ].join(" ")}
                          title={`Voir: ${TYPE_LABELS[t]}`}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.96 }}
                      >
                        {TYPE_LABELS[t]} <span className="opacity-70 font-semibold">({count})</span>
                      </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                className="grid md:grid-cols-4 gap-4 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              <motion.div className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm" whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(31,35,90,0.07)" }}>
                <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">Type</p>
                <select
                    value={activeType}
                    onChange={(e) => setActiveType(e.target.value)}
                    className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                >
                  <option value="all">Tout</option>
                  <option value="offre">Offres</option>
                  <option value="convention">Conventions</option>
                  <option value="guide">Guides</option>
                  <option value="equipment">Équipements</option>
                </select>

                <div className="mt-3 text-[11px] text-[#666]">
                  Résultats actuels: <b>{filteredItems.length}</b> / <b>{unified.length}</b>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm" whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(31,35,90,0.07)" }}>
                <FilterCard2 />
              </motion.div>

              <motion.div className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm" whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(31,35,90,0.07)" }}>
                <FilterCard3 />
              </motion.div>

              <motion.div className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm" whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(31,35,90,0.07)" }}>
                <FilterCard4 />
              </motion.div>
            </motion.div>

            {/* Results */}
            <motion.div
                className="bg-white/90 rounded-2xl border border-[#1F235A1A] p-4 md:p-5 shadow-sm w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Résultats</h3>
                  {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>

                <span className="inline-flex items-center gap-2 text-sm text-[#666]">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1F235A0D] text-[#1F235A] text-xs font-semibold">
                  {filteredItems.length}
                </span>
                élément(s) correspondant(s)
              </span>
              </div>

              {loading && <p className="text-sm text-[#666]">Chargement…</p>}

              {!loading && filteredItems.length === 0 && (
                  <motion.p className="text-sm text-[#666]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    Aucun résultat. Essayez d&apos;élargir votre recherche ou de réinitialiser certains filtres.
                  </motion.p>
              )}

              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {!loading &&
                    filteredItems.map((item, idx) => {
                      const typeBadge = TYPE_LABELS[item.type] || item.type;
                      const smallLine =
                          item.type === "offre"
                              ? [item.meta?.customer_segment, item.meta?.geography].filter(Boolean).join(" · ")
                              : item.type === "convention"
                                  ? [item.meta?.partner_name, item.meta?.sector].filter(Boolean).join(" · ")
                                  : item.type === "guide"
                                      ? [item.meta?.module, item.meta?.operation_name].filter(Boolean).join(" · ")
                                      : item.type === "equipment"
                                          ? [item.meta?.brand, item.meta?.category, item.meta?.model].filter(Boolean).join(" · ")
                                          : "";

                      const dateLine =
                          item.meta?.start_date || item.meta?.end_date ? `${item.meta?.start_date || "—"} → ${item.meta?.end_date || "—"}` : null;

                      return (
                          <motion.div
                              key={`${item.type}-${item.title}-${idx}`}
                              className="rounded-2xl border border-[#1F235A14] bg-[#f9fafc] p-4 flex flex-col justify-between"
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.04 }}
                              whileHover={{
                                y: -3,
                                boxShadow: "0 14px 30px rgba(31,35,90,0.15)",
                                borderColor: "#1F235A66",
                              }}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <h4 className="font-semibold text-sm md:text-base">{item.title}</h4>
                                  <p className="text-xs text-[#666]">
                                    {smallLine || "—"}
                                    {item.doc?.document_type ? ` · ${item.doc.document_type}` : ""}
                                  </p>
                                </div>

                                <span className="text-[11px] px-3 py-1 rounded-full bg-[#08814112] border border-[#08814166] text-[#088141] whitespace-nowrap">
                            {typeBadge}
                          </span>
                              </div>

                              <div className="flex flex-wrap gap-2 text-[11px] text-[#555] my-3">
                                {item.meta?.geography && (
                                    <span className="px-2 py-1 bg-white border border-[#E0E3EE] rounded-full">Géographie : {item.meta.geography}</span>
                                )}
                                {item.meta?.sector && (
                                    <span className="px-2 py-1 bg-white border border-[#E0E3EE] rounded-full">Secteur : {item.meta.sector}</span>
                                )}
                                {item.meta?.partner_name && (
                                    <span className="px-2 py-1 bg-white border border-[#E0E3EE] rounded-full">Partenaire : {item.meta.partner_name}</span>
                                )}
                                {item.meta?.brand && (
                                    <span className="px-2 py-1 bg-white border border-[#E0E3EE] rounded-full">Marque : {item.meta.brand}</span>
                                )}
                                {item.meta?.module && (
                                    <span className="px-2 py-1 bg-white border border-[#E0E3EE] rounded-full">Module : {item.meta.module}</span>
                                )}
                                {dateLine && <span className="px-2 py-1 bg-white border border-[#E0E3EE] rounded-full">{dateLine}</span>}
                              </div>

                              {item.summary ? (
                                  <p className="text-sm text-[#444] line-clamp-3">{item.summary}</p>
                              ) : (
                                  <p className="text-sm text-[#666] italic">Aucun résumé.</p>
                              )}
                            </div>

                            <div className="flex gap-3 text-xs mt-4">
                              <motion.button
                                  onClick={() => handleViewItem(item)}
                                  className="px-3 py-1.5 rounded-xl bg-[#1F235A] text-white hover:bg-[#088141] transition-colors"
                                  whileHover={{ y: -1 }}
                                  whileTap={{ scale: 0.96 }}
                              >
                                Voir
                              </motion.button>

                              <motion.button
                                  onClick={() => handleOpenDoc(item)}
                                  className="px-3 py-1.5 rounded-xl border border-[#1F235A26] bg-white hover:bg-[#f4f4f4] transition-colors"
                                  whileHover={{ y: -1 }}
                                  whileTap={{ scale: 0.96 }}
                              >
                                Document
                              </motion.button>
                            </div>
                          </motion.div>
                      );
                    })}
              </div>

              {!loading && (
                  <div className="mt-5 text-[11px] text-[#666] flex flex-wrap gap-3">
                    <span>Offres: <b>{counts.offre}</b></span>
                    <span>Conventions: <b>{counts.convention}</b></span>
                    <span>Guides: <b>{counts.guide}</b></span>
                    <span>Équipements: <b>{counts.equipment}</b></span>
                  </div>
              )}
            </motion.div>
          </div>
        </motion.section>
      </AnimatePresence>
  );
};

export default Search;
