using ChaDeBebe.Api.Infraestrutura.BancoDados;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChaDeBebe.Api.Controladores;

[ApiController]
[Route("api/status")]
public class StatusControlador(ContextoAplicacao contexto) : ControllerBase
{
    [HttpGet("banco-dados")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> VerificarConexaoBancoDados()
    {
        try
        {
            await contexto.Database.OpenConnectionAsync();
            await contexto.Database.CloseConnectionAsync();

            return Ok(new { mensagem = "Conexão com o banco de dados PostgreSQL realizada com sucesso!" });
        }
        catch (Exception excecao)
        {
            return BadRequest(new
            {
                mensagem = "Não foi possível conectar ao banco de dados PostgreSQL.",
                detalhe = excecao.Message
            });
        }
    }
}
