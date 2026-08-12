type ArrowIconProps = {
  className?: string;
  direction?: "down" | "up-right" | "right";
};

export function ArrowIcon({
  className,
  direction = "up-right",
}: ArrowIconProps) {
  const path =
    direction === "down"
      ? "M12 4v16m0 0 6-6m-6 6-6-6"
      : direction === "right"
        ? "M4 12h16m0 0-6-6m6 6-6 6"
        : "M7 17 17 7M9 7h8v8";

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}
