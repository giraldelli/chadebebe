namespace ChaDeBebe.Api.Aplicacao.Dtos;

public record ConfirmarPresencaInDto(
    string NomeCompleto,
    string? NomeAcompanhante,
    string? Email
);

public record ConfirmarPresencaOutDto(
    Guid Id,
    string Mensagem,
    string NomeCompleto,
    string? NomeAcompanhante,
    DateTime DataConfirmacao
);

public record ConvidadoOutDto(
    Guid Id,
    string NomeCompleto,
    string? NomeAcompanhante,
    string? Email,
    DateTime DataConfirmacao,
    DateTime DataCriacao
);

public record ResumoConvidadosOutDto(
    int TotalConvidados,
    int TotalAcompanhantes,
    int TotalPessoasConfirmadas,
    IEnumerable<ConvidadoOutDto> ListaConvidados
);

