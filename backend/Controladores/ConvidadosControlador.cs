using ChaDeBebe.Api.Aplicacao.Comandos.ConfirmarPresenca;
using ChaDeBebe.Api.Aplicacao.Comandos.EditarConvidado;
using ChaDeBebe.Api.Aplicacao.Comandos.ExcluirConvidado;
using ChaDeBebe.Api.Aplicacao.Comandos.ExcluirConvidadosEmLote;
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

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EditarConvidado(
        [FromRoute] Guid id,
        [FromBody] EditarConvidadoInDto dadosEntrada,
        [FromHeader(Name = "X-Chave-Admin")] string? chaveAdministrador
    )
    {
        var comando = new EditarConvidadoComando(
            id,
            dadosEntrada.NomeCompleto,
            dadosEntrada.NomeAcompanhante,
            dadosEntrada.Email,
            chaveAdministrador
        );

        var resposta = await mediador.Send(comando);
        return Ok(resposta);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExcluirConvidado(
        [FromRoute] Guid id,
        [FromHeader(Name = "X-Chave-Admin")] string? chaveAdministrador
    )
    {
        var comando = new ExcluirConvidadoComando(id, chaveAdministrador);
        var sucesso = await mediador.Send(comando);
        return Ok(new { sucesso, mensagem = "Convidado excluído com sucesso." });
    }

    [HttpPost("excluir-lote")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExcluirConvidadosEmLote(
        [FromBody] ExcluirConvidadosEmLoteInDto dadosEntrada,
        [FromHeader(Name = "X-Chave-Admin")] string? chaveAdministrador
    )
    {
        var comando = new ExcluirConvidadosEmLoteComando(dadosEntrada.Identificadores, chaveAdministrador);
        var totalExcluidos = await mediador.Send(comando);
        return Ok(new { sucesso = true, totalExcluidos, mensagem = $"{totalExcluidos} convidados excluídos com sucesso." });
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
