import React from 'react';
import { Link } from 'react-router-dom';

import "./landingPage.css";
import logo from '../../../_assets/images/logo/azul.png';
import imgSelect from '../../../_assets/images/Select-cuate.png';

export default function LandingPage() {
    return (
        <>
            <div id='landingPage' style={{ backgroundColor: '#0a2558f8', height: '80vh' }}>
                <div className="navbar pt-3" style={{ padding: '0 15em', height: '5em' }}>
                    <div className="d-flex align-items-center gap-2">
                        <img width={46} src={logo} alt="logo" />
                        <h2 className='m-0 text-white'>eletConnect</h2>
                    </div>
                    <div className="d-flex align-items-center gap-4 fonte">
                        <ul className="nav nav-underline ">
                            <li className="nav-item">
                                <Link className="nav-link text-white fonte active" to="">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white fonte" to="">Sobre</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white fonte" to="">Serviços</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white fonte" to="">Contato</Link>
                            </li>
                        </ul>
                        <Link className="btn btn-primary" to={"/login"}>Começar</Link>
                    </div>
                </div>
                <div className="container p-4 mt-5" style={{}}>
                    <div className="row">
                        <div className="col p-4 d-flex flex-column justify-content-center fonte">
                            <h1 className='text-white'>Melhores soluções para o seu negócio</h1>
                            <h5 className='fonte' style={{ color: '#d3d3d3' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, fuga. Suscipit consequuntur quibusdam voluptate illo et, corrupti aliquam dolores expedita voluptatum.</h5>
                            <button className='btn btn-primary w-25 mt-4'>Começar</button>
                        </div>
                        <div className="col p-4 text-center">
                            <img width={500} src={imgSelect} alt="Select" />
                        </div>
                    </div>
                </div>
            </div>
            <div id='empresas' className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f2f3f5', height: '10.5vh' }}>
                <ul className='d-flex gap-5'>
                    <li><h4 className='m-0 fw-bold'>CEM 03 TAGUATINGA</h4></li>
                </ul>
            </div>
            <div id='sobre' className="p-5">
                <span className='text-center'>
                    <h3 className='fw-bold'>SOBRE NÓS</h3>
                </span>
                <div className="container">
                    <div className="row">
                        <div className="col p-4">
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate quis fugit commodi aliquam at facilis dolorum non labore molestiae. Neque, dolore enim pariatur nisi maiores nostrum praesentium asperiores quibusdam qui?</p>
                            <ul>
                                <li><i className="bi bi-patch-check me-2 text-primary"></i>Ullamco laboris nisi ut aliquip ex e comodo consequat</li>
                                <li><i className="bi bi-patch-check me-2 text-primary"></i>Duis aute irure dolor in reprehenderit in voluptate velit</li>
                                <li><i className="bi bi-patch-check me-2 text-primary"></i>Ullamco laboris nisi ut aliquip ex e comodo consequat</li>
                            </ul>
                        </div>
                        <div className="col p-4">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti quis, similique est doloremque nam nulla placeat, ex harum omnis expedita dignissimos vitae consequatur facilis explicabo commodi dolorum officia sed quae.</p>
                            <button className='btn btn-outline-primary'>Saiba mais</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
