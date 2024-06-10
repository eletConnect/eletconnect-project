export default function Institution() {
    return (
        <>
            <div className="cards d-flex justify-content-center gap-4 pt-4">
                <div className="card" style={{ width: '48em' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        Detalhes da instituição
                        <button className="btn btn-outline-secondary">Salvar</button>
                    </div>
                    <div className="card-body">
                        <form class="row g-3">
                            <div class="col-12">
                                <label for="inputAddress" class="form-label">Nome da instituição</label>
                                <input type="text" class="form-control" id="inputAddress" />
                            </div>
                            <div class="col-12">
                                <label for="inputAddress" class="form-label">Endereço de email</label>
                                <input type="email" class="form-control" id="inputAddress" />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="card" style={{ width: '24em' }}>
                    <div className="card-header">
                        Foto do perfil
                        <button className="btn">‎</button>
                    </div>
                    <div className="card-body d-flex flex-column text-center">
                        <span className="d-flex justify-content-center mb-2">
                            <img className="rounded-circle" width={150} src="https://yt3.googleusercontent.com/ytc/AIf8zZR6BiSSLtdVFClPHHRBOSnZPRP1JrdLwtQzZRCgLg=s900-c-k-c0x00ffffff-no-rj" alt="" />
                        </span>
                        <small className="mb-4">JPG ou PNG não maior que 5 MB</small>
                        <input type="file" class="form-control" />
                    </div>
                </div>
            </div>
        </>
    );
}
