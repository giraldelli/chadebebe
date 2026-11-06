using MediatR;

namespace ChaDeBebe.Api.Aplicacao.Comandos.ExcluirConvidado;

public record ExcluirConvidadoComando(
    Guid Id,
    string? ChaveAcessoAdministrador
) : IRequest<bool>;

