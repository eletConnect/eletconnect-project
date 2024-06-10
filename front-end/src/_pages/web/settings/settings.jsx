import Header from "../../../_components/Header";

import Instituicao from "./components/instituicao";
import Colaborador from "./components/colaborador";
import Perfil from "./components/perfil";
import "bootstrap";

export default function settings() {
    return (
        <>
            <div id='toast-container' className="toast-container position-fixed bottom-0 end-0 p-3"></div>
            <Header />
            <section id='section'>
                <div className="box">
                    <div className="title">
                        <h3 className='m-0'>Configurações</h3>
                    </div>
                    <div className="p-5 pt-4">
                        <div id="alert-message"></div>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button className="nav-link text-dark active" id="nav-instituicao-tab" data-bs-toggle="tab" data-bs-target="#nav-instituicao" type="button" role="tab" aria-controls="nav-institution" aria-selected="true">Instituição</button>
                            <button className="nav-link text-dark" id="nav-colaborador-tab" data-bs-toggle="tab" data-bs-target="#nav-colaborador" type="button" role="tab" aria-controls="nav-colaborador" aria-selected="false">Colaborador</button>
                            <button className="nav-link text-dark" id="nav-perfil-tab" data-bs-toggle="tab" data-bs-target="#nav-perfil" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Perfil</button>
                        </div>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-instituicao" role="tabpanel" aria-labelledby="nav-instituicao-tab" tabIndex="0"><Instituicao /></div>
                            <div className="tab-pane fade" id="nav-colaborador" role="tabpanel" aria-labelledby="nav-colaborador-tab" tabIndex="0"><Colaborador /></div>
                            <div className="tab-pane fade" id="nav-perfil" role="tabpanel" aria-labelledby="nav-perfil-tab" tabIndex="0"><Perfil /></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
