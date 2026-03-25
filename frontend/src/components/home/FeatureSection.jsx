import { LuArrowRight } from 'react-icons/lu';

export default function FeatureSection({ tag, title, icon: Icon, desc, benefit, imageSlot, reverse, onClick }) {
  return (
    <section className={`py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'lg:order-2' : ''}>
        <span className="text-blue-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">{tag}</span>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Icon className="text-blue-500" size={32} />
          </div>
          <h3 className="text-5xl font-black tracking-tight">{title}</h3>
        </div>
        <p className="text-xl text-gray-400 leading-relaxed mb-8">{desc}</p>
        <button 
          onClick={onClick}
          className="flex items-center gap-3 cursor-pointer text-white font-bold bg-[#161922] border border-gray-800 hover:border-blue-500 px-6 py-3 rounded-xl transition-all group"
        >
          <span>{benefit}</span>
          <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className={`${reverse ? 'lg:order-1' : ''}`}>
        {imageSlot}
      </div>
    </section>
  );
}