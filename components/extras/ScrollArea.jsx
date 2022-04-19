export default function ScrollArea({ children }) {
  return (
    <div className="h-full w-full scrollbar-thin scrollbar-track-sky-400 scrollbar-thumb-sky-700">
      {children}
    </div>
  );
}
