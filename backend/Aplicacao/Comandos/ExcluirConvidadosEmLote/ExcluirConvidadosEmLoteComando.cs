using MediatR;

namespace ChaDeBebe.Api.Aplicacao.Comandos.ExcluirConvidadosEmLote;

public record ExcluirConvidadosEmLoteComando(
    List<Guid> Identificadores,
    string? ChaveAcessoAdministrador
) : IRequest<int>;

