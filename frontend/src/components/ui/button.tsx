import * as React from 'react';
import { cn } from '../../lib/utils';

export interface PropriedadesBotao extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'padrao' | 'destaque' | 'suave' | 'contorno' | 'fantasma';
  tamanho?: 'pequeno' | 'padrao' | 'grande';
}

export const Botao = React.forwardRef<HTMLButtonElement, PropriedadesBotao>(
  ({ className, variante = 'padrao', tamanho = 'padrao', ...propriedades }, ref) => {
    const estilosVariante = {
      padrao: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-[0.99]',
      destaque: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-[0.99]',
      suave: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.99]',
      contorno: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 active:scale-[0.99]',
      fantasma: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    };

    const estilosTamanho = {
      pequeno: 'h-8 px-3 text-xs rounded-lg font-medium tracking-wide',
      padrao: 'h-10 px-4 text-sm rounded-xl font-medium',
      grande: 'h-12 px-6 text-sm font-semibold rounded-xl'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          estilosVariante[variante],
          estilosTamanho[tamanho],
          className
        )}
        {...propriedades}
      />
    );
  }
);
Botao.displayName = 'Botao';
