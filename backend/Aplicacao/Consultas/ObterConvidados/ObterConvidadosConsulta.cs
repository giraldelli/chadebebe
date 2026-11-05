using ChaDeBebe.Api.Aplicacao.Dtos;
using MediatR;

namespace ChaDeBebe.Api.Aplicacao.Consultas.ObterConvidados;

public record ObterConvidadosConsulta(string? ChaveAcessoAdministrador) : IRequest<ResumoConvidadosOutDto>;

