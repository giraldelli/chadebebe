using ChaDeBebe.Api.Comum.Excecoes;
using ChaDeBebe.Api.Infraestrutura.BancoDados;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ChaDeBebe.Api.Aplicacao.Comandos.ExcluirConvidado;

public class ExcluirConvidadoManipulador(
    ContextoAplicacao contexto,
    IConfiguration configuracao
) : IRequestHandler<ExcluirConvidadoComando, bool>
{
    public async Task<bool> Handle(
        ExcluirConvidadoComando comando,
        CancellationToken tokenCancelamento
    )
    {
        var chaveConfigurada = configuracao["Administrador:ChaveAcesso"] ?? "chadebebe2026";
        if (comando.ChaveAcessoAdministrador != chaveConfigurada)
        {
            throw new NaoAutorizadoExcecao("Chave de acesso de administrador inválida.");
        }

        var convidado = await contexto.Convidados
            .FirstOrDefaultAsync(c => c.Id == comando.Id, tokenCancelamento);

        if (convidado == null)
        {
            throw new RegraNegocioExcecao("Convidado não encontrado.");
        }

        // Soft Delete conforme regra de negócio e auditoria
        convidado.DataExclusao = DateTime.UtcNow;

        await contexto.SaveChangesAsync(tokenCancelamento);
        return true;
    }
}

