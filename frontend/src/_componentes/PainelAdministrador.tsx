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
  X,
  Pencil,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Save,
  Check
} from 'lucide-react';
import { Botao } from '../components/ui/button';
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from '../components/ui/card';
import { EntradaTexto } from '../components/ui/input';
import { clienteSupabase } from '../lib/clienteSupabase';

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
  const [mensagemSucessoAcao, setMensagemSucessoAcao] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const [resumo, setResumo] = useState<ResumoConvidados>({
    totalConvidados: 0,
    totalAcompanhantes: 0,
    totalPessoasConfirmadas: 0,
    listaConvidados: [],
  });

  // Estado de seleção de convidados
  const [convidadosSelecionadosIds, setConvidadosSelecionadosIds] = useState<string[]>([]);

  // Estado para Edição
  const [convidadoEmEdicao, setConvidadoEmEdicao] = useState<ConvidadoItem | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [acompanhanteEdicao, setAcompanhanteEdicao] = useState('');
  const [emailEdicao, setEmailEdicao] = useState('');
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);

  // Estado para Confirmação de Exclusão (individual ou em lote)
  const [convidadoParaExcluir, setConvidadoParaExcluir] = useState<ConvidadoItem | null>(null);
  const [excluindoLote, setExcluindoLote] = useState(false);
  const [processandoExclusao, setProcessandoExclusao] = useState(false);

  const chaveAdminEsperada = import.meta.env.VITE_CHAVE_ADMIN || 'chadebebe2026';

  const buscarDadosSupabase = async (): Promise<ResumoConvidados> => {
    if (!clienteSupabase) {
      throw new Error('Cliente Supabase não configurado.');
    }

    const { data, error } = await clienteSupabase
      .from('convidados')
      .select('*')
      .order('data_confirmacao', { ascending: false });

    if (error) {
      throw new Error('Não foi possível carregar os convidados do Supabase.');
    }

    const listaConvidados: ConvidadoItem[] = (data || []).map((item: {
      id: string;
      nome_completo: string;
      nome_acompanhante: string | null;
      email: string | null;
      data_confirmacao: string;
      data_criacao: string;
    }) => ({
      id: item.id,
      nomeCompleto: item.nome_completo,
      nomeAcompanhante: item.nome_acompanhante,
      email: item.email,
      dataConfirmacao: item.data_confirmacao,
      dataCriacao: item.data_criacao,
    }));

    const totalConvidados = listaConvidados.length;
    const totalAcompanhantes = listaConvidados.filter(c => Boolean(c.nomeAcompanhante)).length;
    const totalPessoasConfirmadas = totalConvidados + totalAcompanhantes;

    return {
      totalConvidados,
      totalAcompanhantes,
      totalPessoasConfirmadas,
      listaConvidados,
    };
  };

  const executarAutenticar = async (evento: React.SyntheticEvent) => {
    evento.preventDefault();
    setMensagemErro(null);

    if (!chaveAcesso.trim()) {
      setMensagemErro('Por favor, informe a chave de acesso.');
      return;
    }

    setCarregando(true);

    try {
      if (clienteSupabase) {
        if (chaveAcesso.trim() !== chaveAdminEsperada) {
          throw new Error('Chave de acesso incorreta.');
        }
        const dados = await buscarDadosSupabase();
        setResumo(dados);
        setEstaAutenticado(true);
        setChaveSalva(chaveAcesso.trim());
      } else {
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
      }
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
      if (clienteSupabase) {
        const dados = await buscarDadosSupabase();
        setResumo(dados);
      } else {
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
      }
      // Limpa seleções que possam ter sido excluídas
      setConvidadosSelecionadosIds([]);
    } catch (excecao) {
      const mensagem = excecao instanceof Error ? excecao.message : 'Erro ao atualizar dados.';
      setMensagemErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  // Gerenciamento de Seleção
  const convidadosFiltrados = resumo.listaConvidados.filter((convidado) => {
    const termo = termoBusca.toLowerCase();
    const nomeValido = convidado.nomeCompleto.toLowerCase().includes(termo);
    const acompanhanteValido = convidado.nomeAcompanhante?.toLowerCase().includes(termo) ?? false;
    return nomeValido || acompanhanteValido;
  });

  const todosFiltradosEstaoSelecionados =
    convidadosFiltrados.length > 0 &&
    convidadosFiltrados.every(c => convidadosSelecionadosIds.includes(c.id));

  const executarAlternarSelecaoTodos = () => {
    if (todosFiltradosEstaoSelecionados) {
      // Remove da seleção os filtrados
      const idsFiltrados = new Set(convidadosFiltrados.map(c => c.id));
      setConvidadosSelecionadosIds(prev => prev.filter(id => !idsFiltrados.has(id)));
    } else {
      // Adiciona todos os filtrados
      const novosIds = new Set([...convidadosSelecionadosIds, ...convidadosFiltrados.map(c => c.id)]);
      setConvidadosSelecionadosIds(Array.from(novosIds));
    }
  };

  const executarAlternarSelecaoIndividual = (id: string) => {
    setConvidadosSelecionadosIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const executarLimparSelecao = () => {
    setConvidadosSelecionadosIds([]);
  };

  // Edição
  const executarAbrirEdicao = (convidado: ConvidadoItem) => {
    setConvidadoEmEdicao(convidado);
    setNomeEdicao(convidado.nomeCompleto);
    setAcompanhanteEdicao(convidado.nomeAcompanhante || '');
    setEmailEdicao(convidado.email || '');
    setErroEdicao(null);
  };

  const executarFecharEdicao = () => {
    setConvidadoEmEdicao(null);
    setErroEdicao(null);
  };

  const executarSalvarEdicao = async (evento: React.SyntheticEvent) => {
    evento.preventDefault();
    if (!convidadoEmEdicao) return;

    if (!nomeEdicao.trim() || nomeEdicao.trim().length < 3) {
      setErroEdicao('O nome completo deve conter pelo menos 3 caracteres.');
      return;
    }

    setSalvandoEdicao(true);
    setErroEdicao(null);

    try {
      const dadosAtualizados = {
        nomeCompleto: nomeEdicao.trim(),
        nomeAcompanhante: acompanhanteEdicao.trim() || null,
        email: emailEdicao.trim() || null,
      };

      if (clienteSupabase) {
        const { error } = await clienteSupabase
          .from('convidados')
          .update({
            nome_completo: dadosAtualizados.nomeCompleto,
            nome_acompanhante: dadosAtualizados.nomeAcompanhante,
            email: dadosAtualizados.email,
          })
          .eq('id', convidadoEmEdicao.id);

        if (error) {
          throw new Error('Não foi possível salvar as alterações no Supabase.');
        }
      } else {
        const resposta = await fetch(`${urlApiBase}/api/convidados/${convidadoEmEdicao.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Chave-Admin': chaveSalva,
          },
          body: JSON.stringify(dadosAtualizados),
        });

        if (!resposta.ok) {
          const corpo = await resposta.json().catch(() => ({}));
          throw new Error(corpo.mensagem || 'Falha ao atualizar convidado.');
        }
      }

      await executarRecarregarDados();
      executarFecharEdicao();
      setMensagemSucessoAcao('Convidado atualizado com sucesso!');
      setTimeout(() => setMensagemSucessoAcao(null), 4000);
    } catch (excecao) {
      const mensagem = excecao instanceof Error ? excecao.message : 'Erro ao salvar alterações.';
      setErroEdicao(mensagem);
    } finally {
      setSalvandoEdicao(false);
    }
  };

  // Exclusão Individual
  const executarAbrirConfirmacaoExclusao = (convidado: ConvidadoItem) => {
    setConvidadoParaExcluir(convidado);
    setExcluindoLote(false);
  };

  const executarAbrirConfirmacaoExclusaoLote = () => {
    if (convidadosSelecionadosIds.length === 0) return;
    setExcluindoLote(true);
    setConvidadoParaExcluir(null);
  };

  const executarFecharConfirmacaoExclusao = () => {
    setConvidadoParaExcluir(null);
    setExcluindoLote(false);
  };

  const executarConfirmarExclusao = async () => {
    setProcessandoExclusao(true);

    try {
      if (excluindoLote) {
        // Exclusão em Lote
        if (clienteSupabase) {
          const { error } = await clienteSupabase
            .from('convidados')
            .delete()
            .in('id', convidadosSelecionadosIds);

          if (error) {
            throw new Error('Falha ao excluir convidados selecionados no Supabase.');
          }
        } else {
          const resposta = await fetch(`${urlApiBase}/api/convidados/excluir-lote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Chave-Admin': chaveSalva,
            },
            body: JSON.stringify({ identificadores: convidadosSelecionadosIds }),
          });

          if (!resposta.ok) {
            throw new Error('Falha ao excluir convidados em lote na API.');
          }
        }

        setMensagemSucessoAcao(`${convidadosSelecionadosIds.length} convidados excluídos com sucesso!`);
        setConvidadosSelecionadosIds([]);
      } else if (convidadoParaExcluir) {
        // Exclusão Individual
        if (clienteSupabase) {
          const { error } = await clienteSupabase
            .from('convidados')
            .delete()
            .eq('id', convidadoParaExcluir.id);

          if (error) {
            throw new Error('Falha ao excluir convidado no Supabase.');
          }
        } else {
          const resposta = await fetch(`${urlApiBase}/api/convidados/${convidadoParaExcluir.id}`, {
            method: 'DELETE',
            headers: {
              'X-Chave-Admin': chaveSalva,
            },
          });

          if (!resposta.ok) {
            throw new Error('Falha ao excluir convidado na API.');
          }
        }

        setMensagemSucessoAcao(`Convidado '${convidadoParaExcluir.nomeCompleto}' excluído com sucesso!`);
        setConvidadosSelecionadosIds(prev => prev.filter(id => id !== convidadoParaExcluir.id));
      }

      await executarRecarregarDados();
      executarFecharConfirmacaoExclusao();
      setTimeout(() => setMensagemSucessoAcao(null), 4000);
    } catch (excecao) {
      const mensagem = excecao instanceof Error ? excecao.message : 'Erro ao excluir.';
      alert(mensagem);
    } finally {
      setProcessandoExclusao(false);
    }
  };

  // Exportação da Planilha
  const executarExportarPlanilha = async (apenasSelecionados = false) => {
    if (!chaveSalva) return;
    setBaixandoPlanilha(true);

    try {
      const listaParaExportar = apenasSelecionados
        ? resumo.listaConvidados.filter(c => convidadosSelecionadosIds.includes(c.id))
        : resumo.listaConvidados;

      if (listaParaExportar.length === 0) {
        alert('Nenhum convidado para exportar.');
        return;
      }

      let conteudoCsv = '\uFEFF';
      conteudoCsv += 'ID;Nome Completo;Acompanhante;Possui Acompanhante;E-mail;Data de Confirmação\n';

      for (const c of listaParaExportar) {
        const id = c.id;
        const nome = (c.nomeCompleto || '').replace(/;/g, ',');
        const acompanhante = (c.nomeAcompanhante || '').replace(/;/g, ',');
        const temAcompanhante = c.nomeAcompanhante ? 'Sim' : 'Não';
        const email = (c.email || '').replace(/;/g, ',');
        const data = new Date(c.dataConfirmacao).toLocaleString('pt-BR');

        conteudoCsv += `${id};${nome};${acompanhante};${temAcompanhante};${email};${data}\n`;
      }

      const blob = new Blob([conteudoCsv], { type: 'text/csv;charset=utf-8;' });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      const sufixo = apenasSelecionados ? 'selecionados' : 'todos';
      link.download = `convidados_francisco_${sufixo}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
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
    setConvidadosSelecionadosIds([]);
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm p-3 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Notificação de Sucesso */}
        {mensagemSucessoAcao && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{mensagemSucessoAcao}</span>
            </div>
            <button
              onClick={() => setMensagemSucessoAcao(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-serif text-slate-900">Painel de Presenças</h2>
            <p className="text-xs text-slate-500">Gestão e controle completo de convidados confirmados</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Botao
              variante="padrao"
              onClick={() => executarExportarPlanilha(false)}
              disabled={baixandoPlanilha}
              className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{baixandoPlanilha ? 'Baixando...' : 'Exportar Tudo (CSV)'}</span>
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

        {/* Tabela de Convidados com Ações em Lote */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">
                Convidados ({convidadosFiltrados.length})
              </h3>
              {convidadosSelecionadosIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                  {convidadosSelecionadosIds.length} selecionado(s)
                </span>
              )}
            </div>
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

          {/* Barra Flutuante de Ações em Lote */}
          {convidadosSelecionadosIds.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in">
              <div className="flex items-center gap-2 text-xs">
                <CheckSquare className="w-4 h-4 text-sky-400" />
                <span className="font-semibold">{convidadosSelecionadosIds.length} convidados selecionados</span>
              </div>
              <div className="flex items-center gap-2">
                <Botao
                  variante="suave"
                  tamanho="pequeno"
                  onClick={() => executarExportarPlanilha(true)}
                  className="bg-slate-800 text-sky-300 hover:bg-slate-700 text-xs border border-slate-700"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
                  <span>Exportar Selecionados</span>
                </Botao>
                <Botao
                  variante="padrao"
                  tamanho="pequeno"
                  onClick={executarAbrirConfirmacaoExclusaoLote}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Excluir Selecionados</span>
                </Botao>
                <button
                  onClick={executarLimparSelecao}
                  className="text-xs text-slate-400 hover:text-white underline ml-1"
                >
                  Desmarcar
                </button>
              </div>
            </div>
          )}

          {/* Tabela com Checkboxes e Ações de Edição/Exclusão */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={executarAlternarSelecaoTodos}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                      title={todosFiltradosEstaoSelecionados ? 'Desmarcar todos' : 'Selecionar todos'}
                    >
                      {todosFiltradosEstaoSelecionados ? (
                        <CheckSquare className="w-4 h-4 text-sky-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3">Nome Completo</th>
                  <th className="py-2.5 px-3">Acompanhante</th>
                  <th className="py-2.5 px-3">E-mail</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {convidadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      Nenhum convidado encontrado.
                    </td>
                  </tr>
                ) : (
                  convidadosFiltrados.map((convidado) => {
                    const estaSelecionado = convidadosSelecionadosIds.includes(convidado.id);
                    return (
                      <tr
                        key={convidado.id}
                        className={`transition-colors ${
                          estaSelecionado ? 'bg-sky-50/70' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => executarAlternarSelecaoIndividual(convidado.id)}
                            className="cursor-pointer text-slate-400 hover:text-slate-700"
                          >
                            {estaSelecionado ? (
                              <CheckSquare className="w-4 h-4 text-sky-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
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
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => executarAbrirEdicao(convidado)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-100/70 transition-colors"
                              title="Editar Convidado"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => executarAbrirConfirmacaoExclusao(convidado)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-100/70 transition-colors"
                              title="Excluir Convidado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {convidadoEmEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <Cartao className="w-full max-w-md border border-slate-200 shadow-2xl bg-white animate-in zoom-in-95">
            <CartaoCabecalho className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CartaoTitulo className="text-lg font-serif text-slate-900">Editar Convidado</CartaoTitulo>
                <CartaoDescricao className="text-xs text-slate-500">
                  Atualize as informações de confirmação
                </CartaoDescricao>
              </div>
              <button
                onClick={executarFecharEdicao}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </CartaoCabecalho>

            <CartaoConteudo className="pt-4 pb-6">
              {erroEdicao && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{erroEdicao}</span>
                </div>
              )}

              <form onSubmit={executarSalvarEdicao} className="space-y-4">
                <EntradaTexto
                  rotulo="Nome Completo *"
                  value={nomeEdicao}
                  onChange={(e) => setNomeEdicao(e.target.value)}
                  placeholder="Nome do convidado"
                  required
                />

                <EntradaTexto
                  rotulo="Acompanhante"
                  value={acompanhanteEdicao}
                  onChange={(e) => setAcompanhanteEdicao(e.target.value)}
                  placeholder="Nome do acompanhante (opcional)"
                />

                <EntradaTexto
                  type="email"
                  rotulo="E-mail"
                  value={emailEdicao}
                  onChange={(e) => setEmailEdicao(e.target.value)}
                  placeholder="email@exemplo.com (opcional)"
                />

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Botao
                    type="button"
                    variante="contorno"
                    onClick={executarFecharEdicao}
                    className="flex-1"
                    disabled={salvandoEdicao}
                  >
                    Cancelar
                  </Botao>
                  <Botao
                    type="submit"
                    variante="destaque"
                    disabled={salvandoEdicao}
                    className="flex-1 gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{salvandoEdicao ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </Botao>
                </div>
              </form>
            </CartaoConteudo>
          </Cartao>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão (Individual ou Lote) */}
      {(convidadoParaExcluir || excluindoLote) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <Cartao className="w-full max-w-sm border border-rose-200 shadow-2xl bg-white animate-in zoom-in-95">
            <CartaoConteudo className="pt-6 pb-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-slate-900">
                  {excluindoLote ? 'Excluir Selecionados?' : 'Excluir Convidado?'}
                </h4>
                <p className="text-xs text-slate-500">
                  {excluindoLote ? (
                    <>
                      Tem certeza que deseja remover os <strong>{convidadosSelecionadosIds.length}</strong> convidados selecionados da lista?
                    </>
                  ) : (
                    <>
                      Tem certeza que deseja remover <strong>{convidadoParaExcluir?.nomeCompleto}</strong> da lista de presença?
                    </>
                  )}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Botao
                  type="button"
                  variante="contorno"
                  onClick={executarFecharConfirmacaoExclusao}
                  disabled={processandoExclusao}
                  className="flex-1"
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  onClick={executarConfirmarExclusao}
                  disabled={processandoExclusao}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {processandoExclusao ? 'Excluindo...' : 'Sim, Excluir'}
                </Botao>
              </div>
            </CartaoConteudo>
          </Cartao>
        </div>
      )}
    </div>
  );
}
