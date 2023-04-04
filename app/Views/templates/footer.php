<!--begin::Footer-->
<div class="modal fade" tabindex="-1" id="modal_suggestions">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Buzón de sugerencias</h3>

                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal"
                     aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
                <!--end::Close-->
            </div>

            <div class="modal-body">
                <!-- FORMULARIO PARA ENVIO DE SUGERENCIAS -->
                <form enctype="multipart/form-data" id="form_suggestions" name="form_suggestions">
                    <div class="form-group">
                        <label for="type">Tipo</label>
                        <select class="form-select form-select-solid" id="type" name="type">
                            <option value="Sugerencia">Sugerencia 💡</option>
                            <option value="Queja">Queja 😩</option>
                            <option value="Felicitación">Felicitación 🍾</option>
                        </select>
                    </div>
                    <div class="form-group mt-5">
                        <label for="comment">Comentario</label>
                        <textarea class="form-control form-control-solid" id="comment" name="comment"
                                  rows="3"></textarea>
                    </div>
                    <!-- IMAGE INPUT -->
                    <div class="form-group mt-5">
                        <label for="image">Imagen</label>
                        <input class="form-control form-control-solid" multiple type="file" id="image"
                               name="image[]" value="">
                    </div>
                    <div class="form-check form-check-custom form-check-solid mt-5">
                        <input class="form-check-input" name="anonymous" type="checkbox" value="1"
                               id="anonymous"/>
                        <label class="form-check-label" for="anonymous">
                            Enviar anónimamente
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" id="send_suggestion_btn" class="btn btn-primary">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">Enviar</span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <span class="indicator-progress">Por favor espere...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                    <!--end::Indicator progress-->
                </button>
            </div>
        </div>
    </div>
</div>
<!--end::Footer-->