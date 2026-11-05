import * as React from 'react';
import { cn } from '../../lib/utils';

export interface PropriedadesEntradaTexto extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string;
  mensagemErro?: string;
}

export const EntradaTexto = React.forwardRef<HTMLInputElement, PropriedadesEntradaTexto>(
  ({ className, type = 'text', rotulo, mensagemErro, ...propriedades }, ref) => {
    return (
      <div className="w-full text-left space-y-1.5">
        {rotulo && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            {rotulo}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-none transition-all duration-150 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
            mensagemErro && 'border-rose-400 focus:border-rose-600 focus:ring-rose-600',
            className
          )}
          {...propriedades}
        />
        {mensagemErro && (
          <p className="text-[11px] text-rose-600 font-medium pl-0.5">{mensagemErro}</p>
        )}
      </div>
    );
  }
);
EntradaTexto.displayName = 'EntradaTexto';
