using ChaDeBebe.Api.Aplicacao.Dtos;
using ChaDeBebe.Api.Comum.Excecoes;
using ChaDeBebe.Api.Dominio.Entidades;
using ChaDeBebe.Api.Infraestrutura.BancoDados;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChaDeBebe.Api.Aplicacao.Comandos.ConfirmarPresenca;

public class ConfirmarPresencaManipulador(
    ContextoAplicacao contexto,
    IValidator<ConfirmarPresencaComando> validador
) : IRequestHandler<ConfirmarPresencaComando, ConfirmarPresencaOutDto>
{
    public async Task<ConfirmarPresencaOutDto> Handle(
        ConfirmarPresencaComando comando,
        CancellationToken tokenCancelamento
    )
    {
        var resultadoValidacao = await validador.ValidateAsync(comando, tokenCancelamento);
        if (!resultadoValidacao.IsValid)
        {
            var primeiraMensagemErro = resultadoValidacao.Errors.First().ErrorMessage;
            throw new ValidacaoExcecao(primeiraMensagemErro);
        }

        var nomeNormalizado = comando.NomeCompleto.Trim();

        var jaConfirmou = await contexto.Convidados
            .AnyAsync(convidado => convidado.NomeCompleto.ToLower() == nomeNormalizado.ToLower(), tokenCancelamento);

        if (jaConfirmou)
        {
            throw new RegraNegocioExcecao($"Olá! O convidado '{nomeNormalizado}' já confirmou presença anteriormente.");
        }

        var novoConvidado = new Convidado
        {
            NomeCompleto = nomeNormalizado,
            NomeAcompanhante = string.IsNullOrWhiteSpace(comando.NomeAcompanhante) ? null : comando.NomeAcompanhante.Trim(),
            Email = string.IsNullOrWhiteSpace(comando.Email) ? null : comando.Email.Trim().ToLower(),
            Confirmado = true,
            DataConfirmacao = DateTime.UtcNow
        };

        contexto.Convidados.Add(novoConvidado);
        await contexto.SaveChangesAsync(tokenCancelamento);

        return new ConfirmarPresencaOutDto(
            novoConvidado.Id,
            "Presença confirmada com sucesso! Mal podemos esperar para celebrar com você!",
            novoConvidado.NomeCompleto,
            novoConvidado.NomeAcompanhante,
            novoConvidado.DataConfirmacao
        );
    }
}

