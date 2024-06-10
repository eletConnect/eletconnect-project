import React, { useState, useEffect } from 'react';
import axios from 'axios';
import showToast from '../../../../_utils/toasts';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export default function configInstituicao() {
    const escola = JSON.parse(sessionStorage.getItem('escola'));
    const [nome, setNome] = useState(escola?.nome || '');
    const [cep, setCEP] = useState(escola?.cep || '');
    const [endereco, setEndereco] = useState(escola?.endereco || '');
    const [telefone, setTelefone] = useState(escola?.telefone || '');
    const [logo, setLogo] = useState(null);
    const [logotipoUrl, setLogotipoUrl] = useState(escola?.logotipo || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!escola) return window.location.href = '/verification';
    }, [escola]);

    const verificarCEP = async (cep) => {
        if (!cep) return;
        try {
            const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`, { withCredentials: false });
            if (response.status === 200) {
                setEndereco(response.data.street);
            }
        } catch (error) {
            console.error('Erro ao verificar CEP', error);
            showToast('danger', 'Erro ao verificar CEP.');
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const previewUrl = URL.createObjectURL(file);
            setLogotipoUrl(previewUrl);
        }
    };

    const armazenarLogo = async () => {
        if (!logo) return logotipoUrl;

        const pathF = `LOGOTIPO_${nome}_${Date.now()}`;

        try {
            const { error } = await supabase.storage.from('logotipo').upload(pathF, logo);
            if (error) {
                showToast('danger', error.message);
                return null;
            }

            const { data, error: publicUrlError } = supabase.storage.from('logotipo').getPublicUrl(pathF);
            if (publicUrlError) {
                showToast('danger', publicUrlError.message);
                return null;
            }

            return data.publicUrl;
        } catch (error) {
            showToast('danger', 'Erro ao armazenar a logo.');
            return null;
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const logotipoUrlAtualizado = await armazenarLogo();
        if (!logotipoUrlAtualizado) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put('http://localhost:3001/instituicao/alterar', { cnpj: escola.cnpj, nome, cep, endereco, telefone, logotipo: logotipoUrlAtualizado });
            if (response.status === 200) {
                showToast('success', 'Instituição atualizada com sucesso!');
                sessionStorage.setItem('escola', JSON.stringify({ ...escola, nome, cep, endereco, telefone, logotipo: logotipoUrlAtualizado }));
                setTimeout(() => window.location.reload(), 2500);
            }
        } catch (error) {
            showToast('danger', error.response ? error.response.data.mensagem : 'Erro ao atualizar instituição.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cards d-flex justify-content-center gap-4 pt-4">
            <div className="card" style={{ width: '48em' }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    Detalhes da instituição
                    <button className="btn btn-outline-secondary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
                <div className="card-body">
                    <form className="row g-3">
                        <div className="col-6">
                            <label className="form-label">Inscrição estadual</label>
                            <input type="text" className="form-control" value={escola?.inscricaoEstadual} disabled />
                        </div>
                        <div className="col-6">
                            <label className="form-label">CNPJ</label>
                            <input type="text" className="form-control" value={escola?.cnpj} disabled />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Nome da instituição</label>
                            <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className="form-label">CEP</label>
                            <input type="text" className="form-control" value={cep} onChange={(e) => setCEP(e.target.value)} onBlur={() => verificarCEP(cep)} />
                        </div>
                        <div className="col-6">
                            <label className="form-label">Endereço</label>
                            <input type="text" className="form-control" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Telefone (+55)</label>
                            <input type="text" className="form-control" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                        </div>
                    </form>
                </div>
            </div>
            <div className="card" style={{ width: '24em' }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    Foto do perfil
                    <button className="btn btn-outline-secondary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <span className="d-flex justify-content-center mb-2">
                        <img className="img-fluid" width={150} src={logotipoUrl} alt="Logo" />
                    </span>
                    <small className="mb-4">JPG ou PNG não maior que 5 MB</small>
                    <input type="file" className="form-control" onChange={handleLogoChange} />
                </div>
            </div>
        </div>
    );
}
