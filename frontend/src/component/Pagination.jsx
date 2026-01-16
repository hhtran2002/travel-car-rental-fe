export default function Pagination({ page = 0, totalPages = 0, onPage }) {
    if (totalPages <= 1) return null;

    const safe = (p) => {
        if (typeof onPage === "function") onPage(p);
    };

    const prev = () => safe(Math.max(0, page - 1));
    const next = () => safe(Math.min(totalPages - 1, page + 1));
    const first = () => safe(0);
    const last = () => safe(totalPages - 1);

    // 1 ... 8 9 10 11 12 ... 20 (hiển thị quanh page hiện tại)
    const pages = (() => {
        const lastIdx = totalPages - 1;
        const set = [];

        const add = (p) => set.push(p);
        const dots = () => set.push("...");

        add(0);

        const start = Math.max(1, page - 2);
        const end = Math.min(lastIdx - 1, page + 2);

        if (start > 1) dots();
        for (let p = start; p <= end; p++) add(p);
        if (end < lastIdx - 1) dots();

        if (lastIdx > 0) add(lastIdx);

        return set;
    })();

    const btn =
        "px-3 py-1.5 rounded-lg border font-semibold transition " +
        "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] " +
        "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 " +
        "disabled:opacity-50 disabled:cursor-not-allowed";

    const btnActive =
        "px-3 py-1.5 rounded-lg border font-black transition " +
        "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 " +
        "text-green-700 dark:text-green-200";

    return (
        <div className="flex flex-wrap items-center gap-2 mt-3">
            <button type="button" className={btn} onClick={first} disabled={page <= 0}>
                First
            </button>
            <button type="button" className={btn} onClick={prev} disabled={page <= 0}>
                Prev
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        className={p === page ? btnActive : btn}
                        onClick={() => safe(p)}
                    >
                        {p + 1}
                    </button>
                )
            )}

            <button
                type="button"
                className={btn}
                onClick={next}
                disabled={page >= totalPages - 1}
            >
                Next
            </button>
            <button
                type="button"
                className={btn}
                onClick={last}
                disabled={page >= totalPages - 1}
            >
                Last
            </button>

            <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Page <b className="text-gray-900 dark:text-white">{page + 1}</b> /{" "}
                {totalPages}
            </div>
        </div>
    );
}
