export default function ScrollArea({ children }) {
  return (
    <div className="scrollbar scrollbar-thin scrollbar-track-sky-400 scrollbar-thumb-sky-700">
      {children}
    </div>
  );
}
