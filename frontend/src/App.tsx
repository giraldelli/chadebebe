import { useState } from 'react';
import { Lock } from 'lucide-react';
import { PlanoDeFundoInfantil } from './_componentes/PlanoDeFundoInfantil';
import { CabecalhoEvento } from './_componentes/CabecalhoEvento';
import { FormularioConfirmacao } from './_componentes/FormularioConfirmacao';
import { PainelAdministrador } from './_componentes/PainelAdministrador';
import { Botao } from './components/ui/button';

export function App() {
  const [painelAdminAberto, setPainelAdminAberto] = useState(false);
  const urlApiBase = import.meta.env.VITE_API_URL || 'http://localhost:5221';

  const executarAbrirPainelAdmin = () => {
    setPainelAdminAberto(true);
  };

  const executarFecharPainelAdmin = () => {
    setPainelAdminAberto(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Background Texturizado e Fino */}
      <PlanoDeFundoInfantil />

      {/* Botão Superior para Área Administrativa */}
      <div className="max-w-3xl mx-auto w-full flex justify-end">
        <Botao
          variante="fantasma"
          tamanho="pequeno"
          onClick={executarAbrirPainelAdmin}
          className="text-[11px] text-slate-400 hover:text-slate-700 tracking-wider uppercase font-semibold gap-1.5"
        >
          <Lock className="w-3 h-3" />
          <span>Administração</span>
        </Botao>
      </div>

      {/* Conteúdo Central */}
      <main className="max-w-3xl mx-auto w-full space-y-8 my-auto">
        <CabecalhoEvento />
        <FormularioConfirmacao urlApiBase={urlApiBase} />
      </main>

      {/* Rodapé Editorial */}
      <footer className="text-center pt-8 pb-3 text-xs text-slate-400 font-normal tracking-wide">
        <span>Celebrando a chegada do Francisco com muito amor e carinho</span>
      </footer>

      {/* Painel do Administrador (Modal) */}
      {painelAdminAberto && (
        <PainelAdministrador
          urlApiBase={urlApiBase}
          aoFechar={executarFecharPainelAdmin}
        />
      )}
    </div>
  );
}

export default App;
