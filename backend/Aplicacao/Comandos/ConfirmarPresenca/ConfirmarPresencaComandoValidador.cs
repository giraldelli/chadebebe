using FluentValidation;

namespace ChaDeBebe.Api.Aplicacao.Comandos.ConfirmarPresenca;

public class ConfirmarPresencaComandoValidador : AbstractValidator<ConfirmarPresencaComando>
{
    public ConfirmarPresencaComandoValidador()
    {
        RuleFor(comando => comando.NomeCompleto)
            .NotEmpty().WithMessage("O nome completo é obrigatório.")
            .MinimumLength(3).WithMessage("O nome completo deve conter pelo menos 3 caracteres.")
            .MaximumLength(200).WithMessage("O nome completo não pode ultrapassar 200 caracteres.");

        RuleFor(comando => comando.NomeAcompanhante)
            .MaximumLength(200).WithMessage("O nome do acompanhante não pode ultrapassar 200 caracteres.")
            .When(comando => !string.IsNullOrWhiteSpace(comando.NomeAcompanhante));

        RuleFor(comando => comando.Email)
            .EmailAddress().WithMessage("O e-mail informado não é válido.")
            .MaximumLength(250).WithMessage("O e-mail não pode ultrapassar 250 caracteres.")
            .When(comando => !string.IsNullOrWhiteSpace(comando.Email));
    }
}

