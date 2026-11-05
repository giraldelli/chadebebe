using ChaDeBebe.Api.Comum.Middlewares;
using ChaDeBebe.Api.Infraestrutura.BancoDados;
using FluentValidation;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var construtor = WebApplication.CreateBuilder(args);

// Conexão com o Banco de Dados PostgreSQL
var stringConexao = construtor.Configuration.GetConnectionString("Padrao");
construtor.Services.AddDbContext<ContextoAplicacao>(opcoes =>
    opcoes.UseNpgsql(stringConexao));

// MediatR (CQRS)
construtor.Services.AddMediatR(configuracao =>
    configuracao.RegisterServicesFromAssembly(typeof(Program).Assembly));

// FluentValidation
construtor.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// CORS para permitir comunicação com o Frontend
construtor.Services.AddCors(opcoes =>
{
    opcoes.AddPolicy("PermitirFrontend", politica =>
    {
        politica.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});

// Controladores (com suporte a classes terminadas em 'Controlador' em PT-BR)
construtor.Services.AddControllers()
    .ConfigureApplicationPartManager(gerenciador =>
        gerenciador.FeatureProviders.Add(new ProvedorRecursoControlador()));

construtor.Services.AddOpenApi();

var aplicacao = construtor.Build();

// Aplica migrações pendentes no banco PostgreSQL automaticamente
using (var escopo = aplicacao.Services.CreateScope())
{
    var contexto = escopo.ServiceProvider.GetRequiredService<ContextoAplicacao>();
    try
    {
        await contexto.Database.MigrateAsync();
    }
    catch (Exception erro)
    {
        var registrador = escopo.ServiceProvider.GetRequiredService<ILogger<Program>>();
        registrador.LogWarning(erro, "Não foi possível aplicar as migrações automaticamente no banco de dados.");
    }
}

// 1. CORS sempre antes de tudo para garantir os cabeçalhos mesmo em erros e preflights
aplicacao.UseCors("PermitirFrontend");

// 2. Middleware de tratamento global de exceções
aplicacao.UseMiddleware<IntermediarioTratamentoExcecoes>();

if (aplicacao.Environment.IsDevelopment())
{
    aplicacao.MapOpenApi();
}

aplicacao.UseAuthorization();
aplicacao.MapControllers();

aplicacao.Run();

public class ProvedorRecursoControlador : ControllerFeatureProvider
{
    protected override bool IsController(TypeInfo tipoInformacao)
    {
        if (!tipoInformacao.IsClass || tipoInformacao.IsAbstract || !tipoInformacao.IsPublic)
        {
            return false;
        }

        return tipoInformacao.Name.EndsWith("Controlador", StringComparison.OrdinalIgnoreCase) ||
               tipoInformacao.Name.EndsWith("Controller", StringComparison.OrdinalIgnoreCase);
    }
}
