using ChaDeBebe.Api.Comum.Excecoes;
using ChaDeBebe.Api.Infraestrutura.BancoDados;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ChaDeBebe.Api.Aplicacao.Comandos.ExcluirConvidadosEmLote;

public class ExcluirConvidadosEmLoteManipulador(
    ContextoAplicacao contexto,
    IConfiguration configuracao
) : IRequestHandler<ExcluirConvidadosEmLoteComando, int>
{
    public async Task<int> Handle(
        ExcluirConvidadosEmLoteComando comando,
        CancellationToken tokenCancelamento
    )
    {
        var chaveConfigurada = configuracao["Administrador:ChaveAcesso"] ?? "chadebebe2026";
        if (comando.ChaveAcessoAdministrador != chaveConfigurada)
        {
            throw new NaoAutorizadoExcecao("Chave de acesso de administrador inválida.");
        }

        if (comando.Identificadores == null || comando.Identificadores.Count == 0)
        {
            return 0;
        }

        var convidados = await contexto.Convidados
            .Where(c => comando.Identificadores.Contains(c.Id))
            .ToListAsync(tokenCancelamento);

        var dataAtual = DateTime.UtcNow;
        foreach (var convidado in convidados)
        {
            convidado.DataExclusao = dataAtual;
        }

        await contexto.SaveChangesAsync(tokenCancelamento);
        return convidados.Count;
    }
}

