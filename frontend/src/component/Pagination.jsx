export default function Pagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return null;

    const prev = () => onPage(Math.max(0, page - 1));
    const next = () => onPage(Math.min(totalPages - 1, page + 1));

    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
            <button className="btn" onClick={prev} disabled={page <= 0}>Prev</button>
            <div>Page <b>{page + 1}</b> / {totalPages}</div>
            <button className="btn" onClick={next} disabled={page >= totalPages - 1}>Next</button>
        </div>
    );
}