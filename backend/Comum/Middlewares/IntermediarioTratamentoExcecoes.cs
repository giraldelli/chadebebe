using ChaDeBebe.Api.Comum.Excecoes;
using System.Net;
using System.Text.Json;

namespace ChaDeBebe.Api.Comum.Middlewares;

public class IntermediarioTratamentoExcecoes(RequestDelegate proximo)
{
    public async Task InvokeAsync(HttpContext contextoHttp)
    {
        try
        {
            await proximo(contextoHttp);
        }
        catch (Exception excecao)
        {
            await TratarExcecaoAsync(contextoHttp, excecao);
        }
    }

    private static Task TratarExcecaoAsync(HttpContext contextoHttp, Exception excecao)
    {
        var codigoStatus = HttpStatusCode.InternalServerError;
        var mensagem = "Ocorreu um erro interno no servidor.";

        switch (excecao)
        {
            case ValidacaoExcecao validacaoExcecao:
                codigoStatus = HttpStatusCode.BadRequest;
                mensagem = validacaoExcecao.Message;
                break;
            case RegraNegocioExcecao regraNegocioExcecao:
                codigoStatus = HttpStatusCode.BadRequest;
                mensagem = regraNegocioExcecao.Message;
                break;
            case NaoAutorizadoExcecao naoAutorizadoExcecao:
                codigoStatus = HttpStatusCode.Unauthorized;
                mensagem = naoAutorizadoExcecao.Message;
                break;
        }

        contextoHttp.Response.ContentType = "application/json";
        contextoHttp.Response.StatusCode = (int)codigoStatus;

        var resposta = JsonSerializer.Serialize(new
        {
            sucesso = false,
            mensagem,
            codigoStatus = (int)codigoStatus
        });

        return contextoHttp.Response.WriteAsync(resposta);
    }
}

