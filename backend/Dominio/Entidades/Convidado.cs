namespace ChaDeBebe.Api.Dominio.Entidades;

public class Convidado : EntidadeBase
{
    public string NomeCompleto { get; set; } = string.Empty;
    public string? NomeAcompanhante { get; set; }
    public string? Email { get; set; }
    public bool Confirmado { get; set; } = true;
    public DateTime DataConfirmacao { get; set; } = DateTime.UtcNow;
}

