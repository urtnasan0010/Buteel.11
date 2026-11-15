export function Icon({
  kind = "arrow",
}: {
  kind?: "arrow" | "search" | "book" | "brand";
}) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "search" ? (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </>
      ) : kind === "book" ? (
        <>
          <path d="M4 4h6l2 2 2-2h6v15h-6l-2 2-2-2H4zM12 6v15" />
        </>
      ) : kind === "brand" ? (
        <>
          <path d="M4 19V9l8-5 8 5v10M8 19v-7h8v7M2 19h20" />
          <path d="M11 8h2" />
        </>
      ) : (
        <path d="M5 12h14m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}
