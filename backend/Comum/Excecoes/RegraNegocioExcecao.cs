namespace ChaDeBebe.Api.Comum.Excecoes;

public class RegraNegocioExcecao(string mensagem) : Exception(mensagem);

public class ValidacaoExcecao(string mensagem) : Exception(mensagem);

public class NaoAutorizadoExcecao(string mensagem = "Acesso não autorizado.") : Exception(mensagem);

