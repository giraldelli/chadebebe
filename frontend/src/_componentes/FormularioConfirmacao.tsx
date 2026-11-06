import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, HeartHandshake, Loader2, ArrowRight } from 'lucide-react';
import { esquemaConfirmacaoPresenca, type TipoConfirmacaoPresenca } from '../_schema/convidado.schema';
import { Botao } from '../components/ui/button';
import { Cartao, CartaoConteudo, CartaoDescricao, CartaoCabecalho, CartaoTitulo } from '../components/ui/card';
import { EntradaTexto } from '../components/ui/input';
import { clienteSupabase } from '../lib/clienteSupabase';

interface PropriedadesFormulario {
  urlApiBase: string;
}

export function FormularioConfirmacao({ urlApiBase }: PropriedadesFormulario) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeAcompanhante, setNomeAcompanhante] = useState('');
  const [email, setEmail] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [errosValidacao, setErrosValidacao] = useState<{
    nomeCompleto?: string;
    nomeAcompanhante?: string;
    email?: string;
  }>({});
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErroGeral, setMensagemErroGeral] = useState<string | null>(null);

  const executarConfirmarPresenca = async (evento: React.SyntheticEvent) => {
    evento.preventDefault();
    setErrosValidacao({});
    setMensagemErroGeral(null);

    const dadosFormulario: TipoConfirmacaoPresenca = {
      nomeCompleto: nomeCompleto.trim(),
      nomeAcompanhante: nomeAcompanhante.trim() || undefined,
      email: email.trim() || undefined,
    };

    const resultadoValidacao = esquemaConfirmacaoPresenca.safeParse(dadosFormulario);

    if (!resultadoValidacao.success) {
      const errosFormatados: { [chave: string]: string } = {};
      for (const erro of resultadoValidacao.error.issues) {
        const campo = String(erro.path[0]);
        errosFormatados[campo] = erro.message;
      }
      setErrosValidacao(errosFormatados);
      return;
    }

    setCarregando(true);

    try {
      // 1. Se o Supabase estiver configurado, salva diretamente na nuvem
      if (clienteSupabase) {
        const { data: existente } = await clienteSupabase
          .from('convidados')
          .select('id')
          .ilike('nome_completo', resultadoValidacao.data.nomeCompleto)
          .maybeSingle();

        if (existente) {
          throw new Error(`Olá! O convidado '${resultadoValidacao.data.nomeCompleto}' já confirmou presença anteriormente.`);
        }

        const { error: erroInsercao } = await clienteSupabase
          .from('convidados')
          .insert({
            nome_completo: resultadoValidacao.data.nomeCompleto,
            nome_acompanhante: resultadoValidacao.data.nomeAcompanhante || null,
            email: resultadoValidacao.data.email || null,
            confirmado: true,
          });

        if (erroInsercao) {
          throw new Error('Não foi possível salvar sua confirmação. Tente novamente.');
        }

        setMensagemSucesso('Presença confirmada com sucesso! Mal podemos esperar para celebrar com você!');
      } else {
        // 2. Fallback para a API local em .NET
        const resposta = await fetch(`${urlApiBase}/api/convidados/confirmar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resultadoValidacao.data),
        });

        const corpoResposta = await resposta.json();

        if (!resposta.ok) {
          throw new Error(corpoResposta.mensagem || 'Não foi possível confirmar a sua presença.');
        }

        setMensagemSucesso(corpoResposta.mensagem || 'Sua presença foi confirmada com sucesso!');
      }

      // Efeito festivo de confetes
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0f172a', '#38bdf8', '#fbbf24', '#f1f5f9', '#94a3b8'],
      });

      setNomeCompleto('');
      setNomeAcompanhante('');
      setEmail('');
    } catch (excecao) {
      let mensagem = 'Erro ao conectar ao servidor.';
      if (excecao instanceof TypeError && excecao.message.toLowerCase().includes('fetch')) {
        mensagem = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else if (excecao instanceof Error) {
        mensagem = excecao.message;
      }
      setMensagemErroGeral(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const executarNovaConfirmacao = () => {
    setMensagemSucesso(null);
    setMensagemErroGeral(null);
    setErrosValidacao({});
  };

  if (mensagemSucesso) {
    return (
      <Cartao className="max-w-lg mx-auto border border-emerald-200 bg-white moldura-convite">
        <CartaoConteudo className="pt-10 pb-10 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-serif text-slate-900">Presença Confirmada</h3>
            <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
              {mensagemSucesso}
            </p>
          </div>
          <div className="pt-2">
            <Botao
              variante="contorno"
              onClick={executarNovaConfirmacao}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs tracking-wider uppercase font-semibold"
            >
              Confirmar para outra pessoa
            </Botao>
          </div>
        </CartaoConteudo>
      </Cartao>
    );
  }

  return (
    <Cartao className="max-w-lg mx-auto border border-slate-200/90 bg-white/95 moldura-convite relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-sky-500 rounded-t-3xl" />

      <CartaoCabecalho className="text-center pb-4 pt-8">
        <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center mx-auto mb-2 border border-sky-100">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <CartaoTitulo className="text-2xl sm:text-3xl font-serif text-slate-900">
          Confirmação de Presença
        </CartaoTitulo>
        <CartaoDescricao className="text-slate-500 text-sm">
          Por gentileza, informe seus dados para prepararmos tudo especialmente para você.
        </CartaoDescricao>
      </CartaoCabecalho>

      <CartaoConteudo className="pb-8">
        {mensagemErroGeral && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-left">
            {mensagemErroGeral}
          </div>
        )}

        <form onSubmit={executarConfirmarPresenca} className="space-y-4">
          <EntradaTexto
            rotulo="Nome Completo *"
            placeholder="Digite seu nome e sobrenome"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            mensagemErro={errosValidacao.nomeCompleto}
            disabled={carregando}
          />

          <EntradaTexto
            rotulo="Nome do Acompanhante"
            placeholder="Caso vá acompanhado(a)"
            value={nomeAcompanhante}
            onChange={(e) => setNomeAcompanhante(e.target.value)}
            mensagemErro={errosValidacao.nomeAcompanhante}
            disabled={carregando}
          />

          <EntradaTexto
            type="email"
            rotulo="E-mail (opcional)"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mensagemErro={errosValidacao.email}
            disabled={carregando}
          />

          <div className="pt-3">
            <Botao
              type="submit"
              variante="destaque"
              tamanho="grande"
              disabled={carregando}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-medium tracking-wide gap-2 rounded-xl"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                  <span>Confirmando presença...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Presença</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </>
              )}
            </Botao>
          </div>
        </form>
      </CartaoConteudo>
    </Cartao>
  );
}
