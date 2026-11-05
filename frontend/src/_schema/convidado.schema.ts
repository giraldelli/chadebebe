import { z } from 'zod';

export const esquemaConfirmacaoPresenca = z.object({
  nomeCompleto: z
    .string()
    .min(3, 'Por favor, informe seu nome completo com pelo menos 3 caracteres.')
    .max(200, 'O nome não pode exceder 200 caracteres.'),
  nomeAcompanhante: z
    .string()
    .max(200, 'O nome do acompanhante não pode exceder 200 caracteres.')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Por favor, informe um e-mail válido.')
    .max(250, 'O e-mail não pode exceder 250 caracteres.')
    .optional()
    .or(z.literal('')),
});

export type TipoConfirmacaoPresenca = z.infer<typeof esquemaConfirmacaoPresenca>;

