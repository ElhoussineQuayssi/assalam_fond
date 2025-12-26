export default function SoftInfoBlock({ title, description, color = "blue" }) {
  const accents = {
    blue: "bg-[#6495ED]",
    green: "bg-emerald-500",
    red: "bg-rose-500"
  };

  return (
    <div className="group space-y-4 p-6 hover:bg-white rounded-3xl transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-4 rounded-full ${accents[color]}`} />
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-sm text-slate-500 font-light leading-relaxed">
        {description}
      </p>
    </div>
  );
}