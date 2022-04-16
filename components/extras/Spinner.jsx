export default function Spinner() {
  return (
    <div className="spinner-extra flex space-x-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-sky-500/[0.5]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-sky-500/[0.5]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-sky-500/[0.5]"></div>
    </div>
  );
}
