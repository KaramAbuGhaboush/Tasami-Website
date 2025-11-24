/**
 * LoadingSpinner Component
 * 
 * @deprecated For user-facing pages, use skeleton loaders from @/components/ui/skeleton instead.
 * This component is kept for admin pages or fallback scenarios where skeleton loaders are not applicable.
 */
export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7] mx-auto"></div>
    </div>
  );
};
