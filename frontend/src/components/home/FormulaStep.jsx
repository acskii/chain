export default function FormulaStep({ step, title, desc }) {
  return (
    <div className="relative flex items-start gap-10 group">
      <div className="w-20 h-20 rounded-[2rem] bg-[#161922] border-2 border-blue-500 flex items-center justify-center shrink-0 z-10 font-black text-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
        {step}
      </div>
      <div className="pt-4">
        <h4 className="text-3xl font-black mb-2 uppercase tracking-tight">{title}</h4>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">{desc}</p>
      </div>
    </div>
  );
}