export default function Spinner({ color }) {
  return (
    <div className="spinner-extra flex space-x-1">
      <div className={`${color} h-2 w-2 animate-bounce rounded-full`}></div>
      <div className={`${color} h-2 w-2 animate-bounce rounded-full`}></div>
      <div className={`${color} h-2 w-2 animate-bounce rounded-full`}></div>
    </div>
  );
}
