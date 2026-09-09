import React from 'react';
import { Building2, MapPin, Phone, ShieldCheck, Tag, Sparkles, ArrowRight } from 'lucide-react';
import CnaeEditor from './CnaeEditor';
import { formatFacebookMetaTag } from '../utils/cnpjExtractor';

export default function CompanyForm({ data, onChange, onGenerate }) {
  const handleFieldChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const currentFormattedMeta = formatFacebookMetaTag(data.facebookMeta);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate();
      }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* 1. DADOS DA EMPRESA */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 border border-yellow-400/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Dados da Empresa</h3>
            <p className="text-xs text-zinc-400">Informações cadastrais principais extraídas do Cartão CNPJ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Razão Social
            </label>
            <input
              type="text"
              required
              value={data.razaoSocial || ''}
              onChange={(e) => handleFieldChange('razaoSocial', e.target.value)}
              placeholder="Nome Empresarial completo"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Nome Fantasia
            </label>
            <input
              type="text"
              value={data.nomeFantasia || ''}
              onChange={(e) => handleFieldChange('nomeFantasia', e.target.value)}
              placeholder="Título do estabelecimento"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              CNPJ
            </label>
            <input
              type="text"
              value={data.cnpj || ''}
              onChange={(e) => handleFieldChange('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Data de Abertura
            </label>
            <input
              type="text"
              value={data.dataAbertura || ''}
              onChange={(e) => handleFieldChange('dataAbertura', e.target.value)}
              placeholder="DD/MM/AAAA"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Porte
            </label>
            <input
              type="text"
              value={data.porte || ''}
              onChange={(e) => handleFieldChange('porte', e.target.value)}
              placeholder="ME, EPP, DEMAIS..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Situação Cadastral
            </label>
            <input
              type="text"
              value={data.situacaoCadastral || ''}
              onChange={(e) => handleFieldChange('situacaoCadastral', e.target.value)}
              placeholder="ATIVA, BAIXADA..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-semibold focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Natureza Jurídica
            </label>
            <input
              type="text"
              value={data.naturezaJuridica || ''}
              onChange={(e) => handleFieldChange('naturezaJuridica', e.target.value)}
              placeholder="ex: 206-2 - Sociedade Empresária Limitada"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. ENDEREÇO */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400 border border-blue-400/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Endereço</h3>
            <p className="text-xs text-zinc-400">Localização oficial do estabelecimento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Logradouro
            </label>
            <input
              type="text"
              value={data.logradouro || ''}
              onChange={(e) => handleFieldChange('logradouro', e.target.value)}
              placeholder="Rua, Avenida, Praça..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Número
            </label>
            <input
              type="text"
              value={data.numero || ''}
              onChange={(e) => handleFieldChange('numero', e.target.value)}
              placeholder="123, S/N..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Complemento
            </label>
            <input
              type="text"
              value={data.complemento || ''}
              onChange={(e) => handleFieldChange('complemento', e.target.value)}
              placeholder="Sala, Andar, Galpão..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Bairro
            </label>
            <input
              type="text"
              value={data.bairro || ''}
              onChange={(e) => handleFieldChange('bairro', e.target.value)}
              placeholder="Bairro ou Distrito"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Cidade / Município
            </label>
            <input
              type="text"
              value={data.cidade || ''}
              onChange={(e) => handleFieldChange('cidade', e.target.value)}
              placeholder="Nome da cidade"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              UF
            </label>
            <input
              type="text"
              maxLength={2}
              value={data.uf || ''}
              onChange={(e) => handleFieldChange('uf', e.target.value.toUpperCase())}
              placeholder="UF"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 text-center font-bold focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              CEP
            </label>
            <input
              type="text"
              value={data.cep || ''}
              onChange={(e) => handleFieldChange('cep', e.target.value)}
              placeholder="00000-000"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. CONTATO */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Contato</h3>
            <p className="text-xs text-zinc-400">Canais de comunicação exibidos e integrados ao WhatsApp</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              value={data.telefone || ''}
              onChange={(e) => handleFieldChange('telefone', e.target.value)}
              placeholder="(71) 97603-7236"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
            />
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Convertido automaticamente em link direto do WhatsApp (https://wa.me/55...)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="contato@empresa.com.br"
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
            />
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Permite contato direto via cliente de e-mail na página institucional
            </p>
          </div>
        </div>
      </div>

      {/* 4. META TAG FACEBOOK */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400 border border-purple-400/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Meta Tag Facebook</h3>
            <p className="text-xs text-zinc-400">Verificação de domínio do Facebook / Meta Business</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Meta tag ou código de verificação
          </label>
          <input
            type="text"
            value={data.facebookMeta || ''}
            onChange={(e) => handleFieldChange('facebookMeta', e.target.value)}
            placeholder='Cole aqui seu código (ex: abc123456) ou a tag <meta name="facebook-domain-verification"...'
            className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
          />
          <p className="text-[11px] text-zinc-500 mt-1.5">
            Aceita tanto o código isolado quanto a tag completa. Se preenchido, será inserido na <strong>primeira linha</strong> do HTML, antes do &lt;!DOCTYPE html&gt;. Se vazio, não será adicionado.
          </p>

          {currentFormattedMeta && (
            <div className="mt-3 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-mono text-purple-200 break-all">
              <span className="text-purple-400 font-bold">Tag gerada: </span>
              {currentFormattedMeta}
            </div>
          )}
        </div>
      </div>

      {/* 5. CNAES */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/20">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Atividades Econômicas (CNAEs)</h3>
            <p className="text-xs text-zinc-400">Atividade principal e secundárias que compõem a grade de serviços da página</p>
          </div>
        </div>

        <CnaeEditor
          cnaePrincipal={data.cnaePrincipal}
          cnaesSecundarios={data.cnaesSecundarios || []}
          onChangePrincipal={(cnae) => handleFieldChange('cnaePrincipal', cnae)}
          onChangeSecundarios={(list) => handleFieldChange('cnaesSecundarios', list)}
        />
      </div>

      {/* 6. BOTÃO PRINCIPAL */}
      <div className="pt-4 flex justify-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold bg-[#facc15] hover:bg-yellow-400 text-black transition-all shadow-xl shadow-yellow-400/20 hover:shadow-yellow-400/30 active:scale-95 cursor-pointer w-full sm:w-auto"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Página
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
