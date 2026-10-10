export function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block size-5">
      <span
        className="absolute left-0 h-px w-5 rounded-full bg-current transition-all duration-200 top-1"
      />
      <span
        className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 rounded-full bg-current transition-all duration-200 opacity-100"
      />
      <span
        className="absolute left-0 h-px w-5 rounded-full bg-current transition-all duration-200 bottom-1"
      />
    </span>
  );
}
