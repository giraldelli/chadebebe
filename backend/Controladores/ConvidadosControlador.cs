using ChaDeBebe.Api.Aplicacao.Comandos.ConfirmarPresenca;
using ChaDeBebe.Api.Aplicacao.Consultas.ExportarPlanilhaConvidados;
using ChaDeBebe.Api.Aplicacao.Consultas.ObterConvidados;
using ChaDeBebe.Api.Aplicacao.Dtos;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChaDeBebe.Api.Controladores;

[ApiController]
[Route("api/convidados")]
public class ConvidadosControlador(ISender mediador) : ControllerBase
{
    [HttpPost("confirmar")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ConfirmarPresenca([FromBody] ConfirmarPresencaInDto dadosEntrada)
    {
        var comando = new ConfirmarPresencaComando(
            dadosEntrada.NomeCompleto,
            dadosEntrada.NomeAcompanhante,
            dadosEntrada.Email
        );

        var resposta = await mediador.Send(comando);
        return Ok(resposta);
    }

    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterConvidados([FromHeader(Name = "X-Chave-Admin")] string? chaveAdministrador)
    {
        var consulta = new ObterConvidadosConsulta(chaveAdministrador);
        var resumo = await mediador.Send(consulta);
        return Ok(resumo);
    }

    [HttpGet("exportar-planilha")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportarPlanilha([FromQuery] string? chave)
    {
        var consulta = new ExportarPlanilhaConvidadosConsulta(chave);
        var bytesArquivo = await mediador.Send(consulta);

        var nomeArquivo = $"convidados_chadebebe_{DateTime.UtcNow:yyyyMMdd_HHmm}.csv";
        return File(bytesArquivo, "text/csv; charset=utf-8", nomeArquivo);
    }
}

