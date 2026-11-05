using ChaDeBebe.Api.Aplicacao.Dtos;
using MediatR;

namespace ChaDeBebe.Api.Aplicacao.Comandos.ConfirmarPresenca;

public record ConfirmarPresencaComando(
    string NomeCompleto,
    string? NomeAcompanhante,
    string? Email
) : IRequest<ConfirmarPresencaOutDto>;

