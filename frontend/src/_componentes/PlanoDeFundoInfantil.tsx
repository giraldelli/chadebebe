export function PlanoDeFundoInfantil() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#f8fbfe]">
      {/* Textura de linho artesanal */}
      <div className="absolute inset-0 textura-papel opacity-60" />

      {/* Brilhos suaves etéreos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-indigo-200/25 blur-3xl" />

      {/* BALÕES */}
      {/* Balão de Ar Quente - Superior Direito com Flutuação */}
      <div className="absolute top-8 right-[7%] opacity-80 hidden sm:block animate-bounce [animation-duration:8s]">
        <svg width="90" height="120" viewBox="0 0 90 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="45" cy="45" rx="38" ry="42" fill="#38BDF8" />
          <path d="M25 15 C32 15 35 75 35 85 C22 75 15 50 25 15 Z" fill="#60A5FA" opacity="0.8" />
          <path d="M65 15 C58 15 55 75 55 85 C68 75 75 50 65 15 Z" fill="#60A5FA" opacity="0.8" />
          <ellipse cx="45" cy="45" rx="14" ry="42" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="45" cy="45" rx="4" ry="42" fill="#38BDF8" opacity="0.3" />
          
          <path d="M34 85 L56 85 L52 92 L38 92 Z" fill="#0284C7" />
          <line x1="38" y1="92" x2="36" y2="102" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="43" y1="92" x2="42" y2="102" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="47" y1="92" x2="48" y2="102" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="52" y1="92" x2="54" y2="102" stroke="#0369A1" strokeWidth="1.5" />

          <rect x="34" y="102" width="22" height="15" rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <line x1="34" y1="107" x2="56" y2="107" stroke="#D97706" strokeWidth="1" />
          <line x1="34" y1="112" x2="56" y2="112" stroke="#D97706" strokeWidth="1" />
        </svg>
      </div>

      {/* Balões de Festa - Superior Esquerdo com Flutuação */}
      <div className="absolute top-10 left-[6%] animate-bounce [animation-duration:6s] opacity-80">
        <svg width="70" height="105" viewBox="0 0 70 105" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="28" cy="38" rx="24" ry="30" fill="#60A5FA" fillOpacity="0.75" />
          <ellipse cx="20" cy="28" rx="6" ry="10" fill="white" fillOpacity="0.5" />
          <polygon points="25,67 31,67 28,71" fill="#2563EB" />
          <path d="M28 71 Q35 78 26 86 T28 95" stroke="#2563EB" strokeWidth="1.5" fill="none" />

          <ellipse cx="44" cy="46" rx="20" ry="26" fill="#38BDF8" fillOpacity="0.8" />
          <ellipse cx="38" cy="38" rx="5" ry="8" fill="white" fillOpacity="0.6" />
          <polygon points="41,71 47,71 44,75" fill="#0284C7" />
          <path d="M44 75 Q38 82 46 90 T43 100" stroke="#0284C7" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* NUVENS COM MOVIMENTO FLOAT */}
      <div className="absolute top-20 left-[18%] opacity-55 animacao-nuvem-1">
        <svg width="110" height="55" viewBox="0 0 100 50" fill="#BAE6FD">
          <path d="M20 40 A15 15 0 0 1 30 18 A25 25 0 0 1 70 18 A20 20 0 0 1 85 40 Z" />
        </svg>
      </div>

      <div className="absolute top-[40%] right-[14%] opacity-50 hidden sm:block animacao-nuvem-2">
        <svg width="130" height="65" viewBox="0 0 100 50" fill="#93C5FD">
          <path d="M20 40 A15 15 0 0 1 30 18 A25 25 0 0 1 70 18 A20 20 0 0 1 85 40 Z" />
        </svg>
      </div>

      <div className="absolute bottom-28 left-[10%] opacity-50 hidden md:block animacao-nuvem-3">
        <svg width="125" height="60" viewBox="0 0 100 50" fill="#BAE6FD">
          <path d="M20 40 A15 15 0 0 1 30 18 A25 25 0 0 1 70 18 A20 20 0 0 1 85 40 Z" />
        </svg>
      </div>

      <div className="absolute top-44 right-[28%] opacity-45 animacao-nuvem-1">
        <svg width="90" height="45" viewBox="0 0 100 50" fill="#BFDBFE">
          <path d="M20 40 A15 15 0 0 1 30 18 A25 25 0 0 1 70 18 A20 20 0 0 1 85 40 Z" />
        </svg>
      </div>

      {/* PIPA COM BALANÇO SUAVE NO VENTO */}
      <div className="absolute top-32 left-[36%] opacity-65 hidden md:block animacao-pipa">
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="30,5 50,30 30,50 10,30" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.8" />
          <line x1="30" y1="5" x2="30" y2="50" stroke="#0284C7" strokeWidth="1.2" />
          <line x1="10" y1="30" x2="50" y2="30" stroke="#0284C7" strokeWidth="1.2" />
          <path d="M30 50 Q36 60 26 70 T34 85" stroke="#0284C7" strokeWidth="1.2" fill="none" />
          <polygon points="26,63 32,60 32,66" fill="#60A5FA" />
          <polygon points="28,75 34,72 34,78" fill="#FACC15" />
        </svg>
      </div>

      {/* CARROS CORRENDO NA HORIZONTAL ATÉ SAIR DA TELA (INVERTIDOS PARA NÃO DAR RÉ) */}

      {/* Carro 1: Fusquinha Celeste correndo da esquerda para a direita (Faixa Superior/Média) */}
      <div className="fixed top-[24%] animacao-carro-horizontal-direita-1">
        <svg className="-scale-x-100" width="120" height="80" viewBox="0 0 130 85" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="65" cy="74" rx="55" ry="7" fill="#93C5FD" fillOpacity="0.4" />
          <path
            d="M12 50 C12 43 18 38 28 38 L38 38 C45 22 58 12 76 12 C92 12 102 22 108 38 L114 42 C120 45 122 49 122 54 L122 58 C122 61 119 63 115 63 L104 63 C104 56 98 51 91 51 C84 51 79 56 79 63 L45 63 C45 56 40 51 33 51 C26 51 21 56 21 63 L9 63 C5 63 3 60 3 57 L3 53 C3 49 7 46 12 50 Z"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="2.5"
          />
          <path d="M43 36 L72 36 L72 20 C58 20 48 26 43 36 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          <path d="M77 36 L100 36 C96 27 88 20 77 20 L77 36 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          <ellipse cx="118" cy="48" rx="4" ry="5" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
          <path d="M123 44 L132 40 L132 56 L123 52 Z" fill="#FEF08A" opacity="0.4" />
          <rect x="4" y="46" width="4" height="6" rx="2" fill="#F43F5E" />
          <rect x="1" y="57" width="9" height="5" rx="2.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
          <rect x="114" y="57" width="10" height="5" rx="2.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
          <circle cx="33" cy="63" r="12" fill="#334155" stroke="#1E293B" strokeWidth="2" />
          <circle cx="33" cy="63" r="6" fill="#E2E8F0" />
          <circle cx="33" cy="63" r="2.5" fill="#0284C7" />
          <circle cx="91" cy="63" r="12" fill="#334155" stroke="#1E293B" strokeWidth="2" />
          <circle cx="91" cy="63" r="6" fill="#E2E8F0" />
          <circle cx="91" cy="63" r="2.5" fill="#0284C7" />
          <circle cx="-2" cy="54" r="3.5" fill="#93C5FD" opacity="0.6" />
          <circle cx="-10" cy="50" r="4.5" fill="#BAE6FD" opacity="0.45" />
          <circle cx="-19" cy="45" r="5.5" fill="#E0F2FE" opacity="0.3" />
        </svg>
      </div>

      {/* Carro 2: Jipinho Azul Royal correndo da direita para a esquerda (Faixa Inferior) */}
      <div className="fixed bottom-10 animacao-carro-horizontal-esquerda">
        <svg className="-scale-x-100" width="125" height="85" viewBox="0 0 135 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="68" cy="78" rx="58" ry="7" fill="#93C5FD" fillOpacity="0.4" />
          <path
            d="M10 65 L22 65 C22 57 28 52 35 52 C42 52 48 57 48 65 L82 65 C82 57 88 52 95 52 C102 52 108 57 108 65 L124 65 C128 65 130 62 130 58 L130 46 C130 42 126 38 120 38 L98 38 L84 20 C81 16 77 14 71 14 L24 14 C18 14 14 18 14 24 L14 42 L8 44 C5 45 4 48 4 52 L4 60 C4 63 6 65 10 65 Z"
            fill="#2563EB"
            stroke="#1D4ED8"
            strokeWidth="2.5"
          />
          <path d="M26 22 L52 22 L52 36 L22 36 L22 26 C22 24 24 22 26 22 Z" fill="#E0F2FE" stroke="#1D4ED8" strokeWidth="1.8" />
          <path d="M58 22 L72 22 L82 36 L58 36 Z" fill="#E0F2FE" stroke="#1D4ED8" strokeWidth="1.8" />
          <path d="M30 14 L30 10 L70 10 L70 14" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="6" cy="50" rx="3.5" ry="4.5" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
          <path d="M3 46 L-6 42 L-6 58 L3 54 Z" fill="#FEF08A" opacity="0.4" />
          <circle cx="35" cy="65" r="14" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="35" cy="65" r="7" fill="#60A5FA" />
          <circle cx="35" cy="65" r="3" fill="#FFFFFF" />
          <circle cx="95" cy="65" r="14" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="95" cy="65" r="7" fill="#60A5FA" />
          <circle cx="95" cy="65" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Carro 3: Esportivinho correndo da esquerda para a direita (Faixa Intermediária) */}
      <div className="fixed top-[64%] hidden md:block animacao-carro-horizontal-direita-2">
        <svg className="-scale-x-100" width="105" height="65" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="53" rx="42" ry="5" fill="#93C5FD" fillOpacity="0.3" />
          <path
            d="M8 44 C8 39 12 35 18 35 L30 35 C38 20 50 14 65 14 C75 14 84 20 88 35 L93 37 C96 39 98 42 98 45 L98 48 C98 50 96 52 93 52 L85 52 C85 46 80 42 75 42 C69 42 65 46 65 52 L36 52 C36 46 31 42 26 42 C20 42 16 46 16 52 L6 52 C4 52 2 50 2 48 L2 45 C2 42 5 40 8 44 Z"
            fill="#60A5FA"
            stroke="#2563EB"
            strokeWidth="2"
          />
          <path d="M35 33 L60 33 L60 20 C48 20 40 24 35 33 Z" fill="#FFFFFF" opacity="0.85" />
          <path d="M64 33 L82 33 C78 26 72 20 64 20 L64 33 Z" fill="#FFFFFF" opacity="0.85" />
          <circle cx="26" cy="51" r="9" fill="#334155" />
          <circle cx="26" cy="51" r="4" fill="#E2E8F0" />
          <circle cx="75" cy="51" r="9" fill="#334155" />
          <circle cx="75" cy="51" r="4" fill="#E2E8F0" />
        </svg>
      </div>

      {/* Estrelinhas cintilantes */}
      <div className="absolute top-36 right-[28%] opacity-65">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FACC15">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.5-6.2 4.5 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
      </div>
      <div className="absolute top-[48%] left-[16%] opacity-55">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#60A5FA">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.5-6.2 4.5 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
      </div>
      <div className="absolute bottom-24 right-[32%] opacity-60">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.5-6.2 4.5 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
      </div>
    </div>
  );
}
