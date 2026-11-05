using ChaDeBebe.Api.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ChaDeBebe.Api.Infraestrutura.BancoDados;

public class ContextoAplicacao(DbContextOptions<ContextoAplicacao> opcoes) : DbContext(opcoes)
{
    public DbSet<Convidado> Convidados { get; set; }

    protected override void OnModelCreating(ModelBuilder construtorModelo)
    {
        base.OnModelCreating(construtorModelo);

        construtorModelo.Entity<Convidado>(entidade =>
        {
            entidade.ToTable("Convidados");
            entidade.HasKey(c => c.Id);
            entidade.Property(c => c.NomeCompleto).IsRequired().HasMaxLength(200);
            entidade.Property(c => c.NomeAcompanhante).HasMaxLength(200);
            entidade.Property(c => c.Email).HasMaxLength(250);
            entidade.Property(c => c.Confirmado).IsRequired();
            entidade.Property(c => c.DataConfirmacao).IsRequired();
        });

        foreach (var tipoEntidade in construtorModelo.Model.GetEntityTypes())
        {
            if (typeof(EntidadeBase).IsAssignableFrom(tipoEntidade.ClrType))
            {
                var parametro = Expression.Parameter(tipoEntidade.ClrType, "entidade");
                var propriedade = Expression.Property(parametro, nameof(EntidadeBase.DataExclusao));
                var nulo = Expression.Constant(null, typeof(DateTime?));
                var comparacao = Expression.Equal(propriedade, nulo);
                var lambda = Expression.Lambda(comparacao, parametro);

                construtorModelo.Entity(tipoEntidade.ClrType).HasQueryFilter(lambda);
            }
        }
    }

    public override Task<int> SaveChangesAsync(CancellationToken tokenCancelamento = default)
    {
        var entradas = ChangeTracker.Entries<EntidadeBase>();

        foreach (var entrada in entradas)
        {
            if (entrada.State == EntityState.Added)
            {
                entrada.Entity.DataCriacao = DateTime.UtcNow;
            }
            else if (entrada.State == EntityState.Modified)
            {
                entrada.Entity.DataAlteracao = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(tokenCancelamento);
    }
}
