import * as React from 'react';
import { cn } from '../../lib/utils';

export function Cartao({ className, ...propriedades }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-md shadow-xl shadow-sky-900/5 transition-all',
        className
      )}
      {...propriedades}
    />
  );
}

export function CartaoCabecalho({ className, ...propriedades }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6 sm:p-8', className)}
      {...propriedades}
    />
  );
}

export function CartaoTitulo({ className, ...propriedades }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-2xl font-bold tracking-tight text-sky-950', className)}
      {...propriedades}
    />
  );
}

export function CartaoDescricao({ className, ...propriedades }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-base text-sky-700/80', className)}
      {...propriedades}
    />
  );
}

export function CartaoConteudo({ className, ...propriedades }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 sm:p-8 pt-0', className)} {...propriedades} />
  );
}

