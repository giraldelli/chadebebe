using ChaDeBebe.Api.Aplicacao.Dtos;
using ChaDeBebe.Api.Comum.Excecoes;
using ChaDeBebe.Api.Infraestrutura.BancoDados;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ChaDeBebe.Api.Aplicacao.Consultas.ObterConvidados;

public class ObterConvidadosManipulador(
    ContextoAplicacao contexto,
    IConfiguration configuracao
) : IRequestHandler<ObterConvidadosConsulta, ResumoConvidadosOutDto>
{
    public async Task<ResumoConvidadosOutDto> Handle(
        ObterConvidadosConsulta consulta,
        CancellationToken tokenCancelamento
    )
    {
        var chaveConfigurada = configuracao["Administrador:ChaveAcesso"] ?? "chadebebe2026";
        if (consulta.ChaveAcessoAdministrador != chaveConfigurada)
        {
            throw new NaoAutorizadoExcecao("Chave de acesso de administrador inválida.");
        }

        var convidados = await contexto.Convidados
            .OrderByDescending(convidado => convidado.DataConfirmacao)
            .Select(convidado => new ConvidadoOutDto(
                convidado.Id,
                convidado.NomeCompleto,
                convidado.NomeAcompanhante,
                convidado.Email,
                convidado.DataConfirmacao,
                convidado.DataCriacao
            ))
            .ToListAsync(tokenCancelamento);

        var totalConvidados = convidados.Count;
        var totalAcompanhantes = convidados.Count(convidado => !string.IsNullOrWhiteSpace(convidado.NomeAcompanhante));
        var totalPessoas = totalConvidados + totalAcompanhantes;

        return new ResumoConvidadosOutDto(
            totalConvidados,
            totalAcompanhantes,
            totalPessoas,
            convidados
        );
    }
}

