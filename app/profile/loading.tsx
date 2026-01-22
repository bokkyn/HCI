// app/profile/loading.tsx
export default function ProfileLoading() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-[#2b946f] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Učitavanje profila...</p>
      </div>
    </div>
  );
}
