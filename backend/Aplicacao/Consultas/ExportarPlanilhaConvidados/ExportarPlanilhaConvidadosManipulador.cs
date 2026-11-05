using ChaDeBebe.Api.Comum.Excecoes;
using ChaDeBebe.Api.Infraestrutura.BancoDados;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace ChaDeBebe.Api.Aplicacao.Consultas.ExportarPlanilhaConvidados;

public class ExportarPlanilhaConvidadosManipulador(
    ContextoAplicacao contexto,
    IConfiguration configuracao
) : IRequestHandler<ExportarPlanilhaConvidadosConsulta, byte[]>
{
    public async Task<byte[]> Handle(
        ExportarPlanilhaConvidadosConsulta consulta,
        CancellationToken tokenCancelamento
    )
    {
        var chaveConfigurada = configuracao["Administrador:ChaveAcesso"] ?? "chadebebe2026";
        if (consulta.ChaveAcessoAdministrador != chaveConfigurada)
        {
            throw new NaoAutorizadoExcecao("Chave de acesso de administrador inválida.");
        }

        var convidados = await contexto.Convidados
            .OrderBy(convidado => convidado.NomeCompleto)
            .ToListAsync(tokenCancelamento);

        var construtorTexto = new StringBuilder();
        
        // Cabeçalho CSV
        construtorTexto.AppendLine("ID;Nome Completo;Acompanhante;Possui Acompanhante;E-mail;Data de Confirmação (UTC)");

        foreach (var convidado in convidados)
        {
            var temAcompanhante = !string.IsNullOrWhiteSpace(convidado.NomeAcompanhante) ? "Sim" : "Não";
            var acompanhanteFormatado = convidado.NomeAcompanhante?.Replace(";", ",") ?? "";
            var nomeFormatado = convidado.NomeCompleto.Replace(";", ",");
            var emailFormatado = convidado.Email?.Replace(";", ",") ?? "";
            var dataFormatada = convidado.DataConfirmacao.ToString("dd/MM/yyyy HH:mm:ss");

            construtorTexto.AppendLine($"{convidado.Id};{nomeFormatado};{acompanhanteFormatado};{temAcompanhante};{emailFormatado};{dataFormatada}");
        }

        // UTF-8 com BOM para garantir que o Excel no Windows leia acentos perfeitamente
        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(construtorTexto.ToString())).ToArray();
    }
}

