namespace ChaDeBebe.Api.Dominio.Entidades;

public abstract class EntidadeBase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public Guid? UsuarioCriacaoId { get; set; }
    public DateTime? DataAlteracao { get; set; }
    public Guid? UsuarioAlteracaoId { get; set; }
    public DateTime? DataExclusao { get; set; }
    public Guid? UsuarioExclusaoId { get; set; }
}

