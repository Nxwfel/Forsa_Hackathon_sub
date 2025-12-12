


const clearFilter = (field) => {
    setFilters((prev) => ({ ...prev, [field]: "" }));
};

const activeChips = useMemo(() => {
    const chips = [];

    if (filters.query?.trim()) chips.push({ key: "query", label: `Mot-clé: ${filters.query}`, field: "query" });
    if (filters.sector) chips.push({ key: "sector", label: `Secteur: ${filters.sector}`, field: "sector" });
    if (filters.partner?.trim()) chips.push({ key: "partner", label: `Partenaire: ${filters.partner}`, field: "partner" });
    if (filters.offerType) chips.push({ key: "offerType", label: `Type: ${filters.offerType}`, field: "offerType" });
    if (filters.validFrom) chips.push({ key: "validFrom", label: `Du: ${filters.validFrom}`, field: "validFrom" });
    if (filters.validTo) chips.push({ key: "validTo", label: `Au: ${filters.validTo}`, field: "validTo" });

    return chips;
}, [filters]);
