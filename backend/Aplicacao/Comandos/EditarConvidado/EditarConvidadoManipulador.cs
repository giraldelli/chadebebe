using ChaDeBebe.Api.Aplicacao.Dtos;
using ChaDeBebe.Api.Comum.Excecoes;
using ChaDeBebe.Api.Infraestrutura.BancoDados;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ChaDeBebe.Api.Aplicacao.Comandos.EditarConvidado;

public class EditarConvidadoManipulador(
    ContextoAplicacao contexto,
    IConfiguration configuracao,
    IValidator<EditarConvidadoComando> validador
) : IRequestHandler<EditarConvidadoComando, ConvidadoOutDto>
{
    public async Task<ConvidadoOutDto> Handle(
        EditarConvidadoComando comando,
        CancellationToken tokenCancelamento
    )
    {
        var chaveConfigurada = configuracao["Administrador:ChaveAcesso"] ?? "chadebebe2026";
        if (comando.ChaveAcessoAdministrador != chaveConfigurada)
        {
            throw new NaoAutorizadoExcecao("Chave de acesso de administrador inválida.");
        }

        var resultadoValidacao = await validador.ValidateAsync(comando, tokenCancelamento);
        if (!resultadoValidacao.IsValid)
        {
            var primeiraMensagemErro = resultadoValidacao.Errors.First().ErrorMessage;
            throw new ValidacaoExcecao(primeiraMensagemErro);
        }

        var convidado = await contexto.Convidados
            .FirstOrDefaultAsync(c => c.Id == comando.Id, tokenCancelamento);

        if (convidado == null)
        {
            throw new RegraNegocioExcecao("Convidado não encontrado.");
        }

        convidado.NomeCompleto = comando.NomeCompleto.Trim();
        convidado.NomeAcompanhante = string.IsNullOrWhiteSpace(comando.NomeAcompanhante) ? null : comando.NomeAcompanhante.Trim();
        convidado.Email = string.IsNullOrWhiteSpace(comando.Email) ? null : comando.Email.Trim().ToLower();

        await contexto.SaveChangesAsync(tokenCancelamento);

        return new ConvidadoOutDto(
            convidado.Id,
            convidado.NomeCompleto,
            convidado.NomeAcompanhante,
            convidado.Email,
            convidado.DataConfirmacao,
            convidado.DataCriacao
        );
    }
}

