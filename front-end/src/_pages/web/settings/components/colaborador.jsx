export default function Perfil() {
    return (
        <>
            <div className="cards d-flex justify-content-center gap-4 pt-4">
                <div className="card" style={{ width: '10em' }}>
                    <div className="card-header">
                        Foto do perfil
                        <button className="btn">‎</button>
                    </div>
                    <div className="card-body d-flex flex-column text-center">
                        <span className="d-flex justify-content-center mb-2">
                            <img className="rounded-circle" width={150} src="https://sb-admin-pro-angular.startbootstrap.com/assets/img/illustrations/profiles/profile-1.png" alt="" />
                        </span>
                        <small className="mb-4">JPG ou PNG não maior que 5 MB</small>
                        <input type="file" className="form-control" />
                    </div>
                </div>

                <div className="card" style={{ width: '48em' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        Detalhes da conta
                        <button className="btn btn-outline-secondary">Salvar</button>
                    </div>
                    <div className="card-body">
                        <form className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Nome de usuário (como seu nome aparecerá para outros usuários do site)</label>
                                <input type="text" className="form-control" id="inputAddress" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Nome</label>
                                <input type="text" className="form-control" id="inputEmail4" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Sobrenome</label>
                                <input type="text" className="form-control" id="inputPassword4" />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Endereço de email</label>
                                <input type="email" className="form-control" id="inputAddress" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
