import React from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function CnaeEditor({ cnaePrincipal, cnaesSecundarios, onChangePrincipal, onChangeSecundarios }) {
  
  const handlePrincipalChange = (field, value) => {
    onChangePrincipal({
      ...cnaePrincipal,
      [field]: value
    });
  };

  const handleAddSecondary = () => {
    const newItem = {
      id: 'cnae-' + Math.random().toString(36).substring(2, 9),
      codigo: '',
      descricao: ''
    };
    onChangeSecundarios([...cnaesSecundarios, newItem]);
  };

  const handleRemoveSecondary = (id) => {
    onChangeSecundarios(cnaesSecundarios.filter(item => item.id !== id));
  };

  const handleSecondaryChange = (id, field, value) => {
    onChangeSecundarios(
      cnaesSecundarios.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Atividade Principal */}
      <div className="bg-zinc-950/60 rounded-2xl p-5 border border-zinc-800/90">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
            Atividade Principal
          </span>
          <span className="text-xs text-zinc-400">CNAE Primário da Empresa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Código CNAE</label>
            <input
              type="text"
              value={cnaePrincipal?.codigo || ''}
              onChange={(e) => handlePrincipalChange('codigo', e.target.value)}
              placeholder="ex: 62.01-5-01"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Descrição da Atividade</label>
            <input
              type="text"
              value={cnaePrincipal?.descricao || ''}
              onChange={(e) => handlePrincipalChange('descricao', e.target.value)}
              placeholder="ex: Desenvolvimento de programas de computador sob encomenda"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Atividades Secundárias */}
      <div className="bg-zinc-950/60 rounded-2xl p-5 border border-zinc-800/90">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Atividades Secundárias</h4>
            <p className="text-xs text-zinc-500">CNAEs secundários adicionados à página institucional</p>
          </div>
          <button
            type="button"
            onClick={handleAddSecondary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-zinc-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            + Adicionar CNAE
          </button>
        </div>

        {cnaesSecundarios.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-zinc-800 rounded-xl">
            <p className="text-xs text-zinc-500 mb-2">Nenhuma atividade secundária cadastrada.</p>
            <button
              type="button"
              onClick={handleAddSecondary}
              className="text-xs text-yellow-400 hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Clique para adicionar a primeira
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cnaesSecundarios.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800"
              >
                <div className="w-full md:w-36">
                  <label className="block text-[10px] text-zinc-500 md:hidden mb-1">Código</label>
                  <input
                    type="text"
                    value={sec.codigo || ''}
                    onChange={(e) => handleSecondaryChange(sec.id, 'codigo', e.target.value)}
                    placeholder="Código CNAE"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[10px] text-zinc-500 md:hidden mb-1">Descrição</label>
                  <input
                    type="text"
                    value={sec.descricao || ''}
                    onChange={(e) => handleSecondaryChange(sec.id, 'descricao', e.target.value)}
                    placeholder="Descrição da atividade secundária"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSecondary(sec.id)}
                  title="Remover atividade"
                  className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors self-end md:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
