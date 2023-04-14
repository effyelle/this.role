<!--begin::Footer-->
<div class="modal fade" tabindex="-1" id="contact-support">
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
                <form id="form_suggestions" name="form_suggestions">
                    <div class="form-group">
                        <label for="type">Issue</label>
                        <select class="form-select form-select-solid" id="type" name="type">
                            <option value="suggestion">Suggestion 💡</option>
                            <option value="complain">Complain 😩</option>
                            <option value="Felicitación">Felicitación 🍾</option>
                        </select>
                    </div>
                    <div class="form-group mt-5">
                        <label for="issue_details">Message</label>
                        <textarea id="issue_details" name="issue_details" rows="3"
                                  class="form-control form-control-solid"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" id="send_suggestion_btn" class="btn btn-primary">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">Enviar</span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <span class="indicator-progress">
                        Por favor espere...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                    <!--end::Indicator progress-->
                </button>
            </div>
        </div>
    </div>
</div>
<!--end::Footer-->