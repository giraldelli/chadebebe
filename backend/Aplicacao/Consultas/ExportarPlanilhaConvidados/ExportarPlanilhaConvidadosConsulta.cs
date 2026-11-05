using MediatR;

namespace ChaDeBebe.Api.Aplicacao.Consultas.ExportarPlanilhaConvidados;

public record ExportarPlanilhaConvidadosConsulta(string? ChaveAcessoAdministrador) : IRequest<byte[]>;

