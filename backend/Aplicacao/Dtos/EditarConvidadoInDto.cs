namespace ChaDeBebe.Api.Aplicacao.Dtos;

public record EditarConvidadoInDto(
    string NomeCompleto,
    string? NomeAcompanhante,
    string? Email
);

public record ExcluirConvidadosEmLoteInDto(
    List<Guid> Identificadores
);

