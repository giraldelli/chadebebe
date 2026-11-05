import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  FileSpreadsheet,
  Lock,
  LogOut,
  Search,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';
import { Botao } from '../components/ui/button';
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from '../components/ui/card';
import { EntradaTexto } from '../components/ui/input';

interface ConvidadoItem {
  id: string;
  nomeCompleto: string;
  nomeAcompanhante: string | null;
  email: string | null;
  dataConfirmacao: string;
  dataCriacao: string;
}

interface ResumoConvidados {
  totalConvidados: number;
  totalAcompanhantes: number;
  totalPessoasConfirmadas: number;
  listaConvidados: ConvidadoItem[];
}

interface PropriedadesPainel {
  urlApiBase: string;
  aoFechar: () => void;
}

export function PainelAdministrador({ urlApiBase, aoFechar }: PropriedadesPainel) {
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [chaveSalva, setChaveSalva] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [baixandoPlanilha, setBaixandoPlanilha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const [resumo, setResumo] = useState<ResumoConvidados>({
    totalConvidados: 0,
    totalAcompanhantes: 0,
    totalPessoasConfirmadas: 0,
    listaConvidados: [],
  });

  const executarAutenticar = async (evento: React.SyntheticEvent) => {
    evento.preventDefault();
    setMensagemErro(null);

    if (!chaveAcesso.trim()) {
      setMensagemErro('Por favor, informe a chave de acesso.');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${urlApiBase}/api/convidados`, {
        method: 'GET',
        headers: {
          'X-Chave-Admin': chaveAcesso.trim(),
        },
      });

      if (!resposta.ok) {
        if (resposta.status === 401) {
          throw new Error('Chave de acesso incorreta.');
        }
        throw new Error('Falha ao autenticar.');
      }

      const dados: ResumoConvidados = await resposta.json();
      setResumo(dados);
      setEstaAutenticado(true);
      setChaveSalva(chaveAcesso.trim());
    } catch (excecao) {
      let mensagem = 'Erro na autenticação.';
      if (excecao instanceof TypeError && excecao.message.toLowerCase().includes('fetch')) {
        mensagem = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando no terminal (dotnet run).';
      } else if (excecao instanceof Error) {
        mensagem = excecao.message;
      }
      setMensagemErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const executarRecarregarDados = async () => {
    if (!chaveSalva) return;
    setCarregando(true);
    setMensagemErro(null);

    try {
      const resposta = await fetch(`${urlApiBase}/api/convidados`, {
        method: 'GET',
        headers: {
          'X-Chave-Admin': chaveSalva,
        },
      });

      if (!resposta.ok) {
        throw new Error('Não foi possível atualizar a lista de convidados.');
      }

      const dados: ResumoConvidados = await resposta.json();
      setResumo(dados);
    } catch (excecao) {
      const mensagem = excecao instanceof Error ? excecao.message : 'Erro ao atualizar dados.';
      setMensagemErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const executarExportarPlanilha = async () => {
    if (!chaveSalva) return;
    setBaixandoPlanilha(true);

    try {
      const resposta = await fetch(`${urlApiBase}/api/convidados/exportar-planilha?chave=${encodeURIComponent(chaveSalva)}`, {
        method: 'GET',
      });

      if (!resposta.ok) {
        throw new Error('Não foi possível exportar a planilha.');
      }

      const blobArquivo = await resposta.blob();
      const urlBlob = window.URL.createObjectURL(blobArquivo);
      const linkDownload = document.createElement('a');
      linkDownload.href = urlBlob;
      linkDownload.download = `convidados_chadebebe_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(linkDownload);
      linkDownload.click();
      linkDownload.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (excecao) {
      const mensagem = excecao instanceof Error ? excecao.message : 'Erro ao baixar arquivo.';
      alert(mensagem);
    } finally {
      setBaixandoPlanilha(false);
    }
  };

  const executarSair = () => {
    setEstaAutenticado(false);
    setChaveSalva('');
    setChaveAcesso('');
    setResumo({
      totalConvidados: 0,
      totalAcompanhantes: 0,
      totalPessoasConfirmadas: 0,
      listaConvidados: [],
    });
  };

  if (!estaAutenticado) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <Cartao className="w-full max-w-sm border border-slate-200 shadow-xl bg-white">
          <CartaoCabecalho className="text-center pt-8 pb-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-4 h-4" />
            </div>
            <CartaoTitulo className="text-xl font-serif text-slate-900">Acesso Restrito</CartaoTitulo>
            <CartaoDescricao className="text-xs text-slate-500">
              Digite a chave de administrador para visualizar os convidados.
            </CartaoDescricao>
          </CartaoCabecalho>

          <CartaoConteudo className="pb-8">
            {mensagemErro && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{mensagemErro}</span>
              </div>
            )}

            <form onSubmit={executarAutenticar} className="space-y-4">
              <EntradaTexto
                type="password"
                rotulo="Chave de Acesso"
                placeholder="••••••••••••"
                value={chaveAcesso}
                onChange={(e) => setChaveAcesso(e.target.value)}
                autoFocus
              />

              <div className="flex gap-2 pt-2">
                <Botao
                  type="button"
                  variante="contorno"
                  onClick={aoFechar}
                  className="flex-1"
                >
                  Cancelar
                </Botao>
                <Botao
                  type="submit"
                  variante="destaque"
                  disabled={carregando}
                  className="flex-1"
                >
                  {carregando ? 'Entrando...' : 'Acessar'}
                </Botao>
              </div>
            </form>
          </CartaoConteudo>
        </Cartao>
      </div>
    );
  }

  const convidadosFiltrados = resumo.listaConvidados.filter((convidado) => {
    const termo = termoBusca.toLowerCase();
    const nomeValido = convidado.nomeCompleto.toLowerCase().includes(termo);
    const acompanhanteValido = convidado.nomeAcompanhante?.toLowerCase().includes(termo) ?? false;
    return nomeValido || acompanhanteValido;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-serif text-slate-900">Painel de Presenças</h2>
            <p className="text-xs text-slate-500">Visualização em tempo real dos convidados confirmados</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Botao
              variante="padrao"
              onClick={executarExportarPlanilha}
              disabled={baixandoPlanilha}
              className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{baixandoPlanilha ? 'Baixando...' : 'Exportar Planilha (CSV)'}</span>
            </Botao>
            <Botao
              variante="contorno"
              onClick={executarRecarregarDados}
              disabled={carregando}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${carregando ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Botao>
            <Botao
              variante="suave"
              onClick={executarSair}
              className="gap-1.5 text-xs text-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </Botao>
            <Botao
              variante="fantasma"
              onClick={aoFechar}
              className="p-2"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </Botao>
          </div>
        </div>

        {/* Métricas / Cards Minimalistas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <UserCheck className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Titulares
              </span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{resumo.totalConvidados}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <UserPlus className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Acompanhantes
              </span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{resumo.totalAcompanhantes}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                Total Confirmado
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">{resumo.totalPessoasConfirmadas}</p>
          </div>
        </div>

        {/* Tabela de Convidados */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900">
              Convidados ({convidadosFiltrados.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Nome Completo</th>
                  <th className="py-2.5 px-3">Acompanhante</th>
                  <th className="py-2.5 px-3">E-mail</th>
                  <th className="py-2.5 px-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {convidadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Nenhum convidado encontrado.
                    </td>
                  </tr>
                ) : (
                  convidadosFiltrados.map((convidado) => (
                    <tr key={convidado.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {convidado.nomeCompleto}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {convidado.nomeAcompanhante || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {convidado.email || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {new Date(convidado.dataConfirmacao).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
