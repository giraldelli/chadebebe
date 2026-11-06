using ChaDeBebe.Api.Aplicacao.Dtos;
using MediatR;

namespace ChaDeBebe.Api.Aplicacao.Comandos.EditarConvidado;

public record EditarConvidadoComando(
    Guid Id,
    string NomeCompleto,
    string? NomeAcompanhante,
    string? Email,
    string? ChaveAcessoAdministrador
) : IRequest<ConvidadoOutDto>;

