import { Clock, MapPin, Sparkles, ExternalLink } from 'lucide-react';

export function CabecalhoEvento() {
  return (
    <header className="text-center space-y-7 max-w-2xl mx-auto pt-4 pb-2 px-4">
      {/* Brasão / Monograma Clássico */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 rounded-full border border-amber-300/80 bg-amber-50/50 flex items-center justify-center text-amber-700 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-600" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          Celebração Especial
        </span>
      </div>

      {/* Tipografia de Convite de Luxo */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-slate-900 tracking-tight leading-[1.1]">
          Chá de Bebê do Francisco
        </h1>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
        <p className="text-base sm:text-lg text-slate-600 font-normal max-w-lg mx-auto leading-relaxed">
          Com amor e alegria, convidamos você para celebrar a doce espera do nosso querido Francisco. Sua presença tornará este momento inesquecível em nossas vidas.
        </p>
      </div>

      {/* Informações de Data, Hora e Local estilo Convite Editorial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Horário */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 transition-colors text-left flex flex-col justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Horário</span>
              <p className="text-base font-semibold text-slate-900">16:00 horas</p>
              <p className="text-xs text-slate-500 font-normal">Aguardamos sua chegada</p>
            </div>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              Esperamos você com carinho ✨
            </span>
          </div>
        </div>

        {/* Localização com Botão do Google Maps */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 transition-colors text-left flex flex-col justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Localização</span>
              <p className="text-base font-semibold text-slate-900">Condomínio Rio Jangada</p>
              <p className="text-xs text-slate-500 font-normal">Cuiabá • Rio Coxipó</p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/TxGrdmjGtfSXmpA67"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold tracking-wide transition-all shadow-sm group"
          >
            <span>Como Chegar (Google Maps)</span>
            <ExternalLink className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
}
