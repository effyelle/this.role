// =====================================================================================================================
// SECTION ONE: Right panel where existing alerts will be visible
// =====================================================================================================================

function getAlerts() {
    fetch('news/get_alerts')
        .then(r => r.json())
        .then(data => {
            if (!data['error']) {
                let alerts = data['results'];
                let alertsContent = '';
                if (alerts.length > 0) {
                    for (let i in alerts) {
                        alertsContent += formatAlertsContent(alerts[i], data['user']);
                    }
                    setTimeout(setAlertEdition, 750);
                } else {
                    alertsContent += formatAlertsContent({
                        alert_title: "¡Todavía no hay alertas!", alert_content: "", alert_date: ""
                    });
                }
                document.getElementById('all_alerts-ajax').innerHTML = alertsContent;
            } else {
                console.log(data['msg']);
            }
        }).catch((error) => {
        console.log(error);
    });
}

function setAlertEdition() {
    let editBtn = document.getElementsByClassName('edit-alert');
    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].addEventListener('click', function () {
            // open modal here to edit alert
            $('button[data-bs-target="#alert-modal"]').trigger('click');
            // Fill title input
            $('#alert-title').val($('.editable ~ .alert-fill > .alert_title-fill')[i].innerHTML.trim());
            // Fill content textarea
            $('#alert-content').val($('.editable ~ .alert-fill > .alert_content-fill')[i].innerHTML.trim());
            // Manage date or checkbox
            let alertFill = $('.editable ~ span .alert_date-fill')[i].innerHTML.trim();
            console.log(alertFill)
            let alertInput = $('#alert-exp_date');
            $('#no-exp_date').prop('checked', alertFill === '');
            alertInput.prop('disabled', alertFill === '');
            alertInput.val(alertFill !== '' ? alertFill : '');
            toggleModalEditable(true);
            saveAlert(this.value); // this.value = alert_id
        });
        document.getElementsByClassName('delete-alert')[i].addEventListener('click', function () {
            if (confirm('¿ESTÁS SEGURO DE QUERER BORRAR ESTA ALERTA?')) {
                const formData = new FormData();
                formData.append('idAlert', this.value);
                fetch('news/delete_alert', {method: "post", body: formData}).then(r => r.json())
                    .then((data) => {
                        if (!data['error']) {
                            toastr.success('Alerta borrada con éxito.', 'Formulario enviado');
                            window.location.reload();
                        } else {
                            toastr.error(data['msg'], 'Formulario devuelto');
                        }
                    }).catch((e) => {
                    console.log("❌ Error: ", e);
                });
            }
        });
    }
}

function saveAlert(id) {
    $('#save_alert-btn').click(function () {
        const formData = getAlertForm();
        formData.append('id_alert', id);
        fetch('/news/update_alert', {method: "post", body: formData})
            .then(r => r.text())
            .then((data) => {
                if (!data['error']) {
                    toastr.success('Alerta editada con éxito.', 'Formulario enviado');
                    window.location.reload();
                } else {
                    toastr.error(data['msg'], 'Formulario devuelto');
                }
            }).catch((e) => {
            console.log("❌ Error: ", e);
        });
    });
}

function formatAlertsContent(alert, user = null) {
    let icon = user !== null && alert['alert_created_by'] === user
        ? '' +
        '   <div class="d-flex flex-column editable">' +
        '       <button class="btn p-0 ps-1 edit-alert" value="' + alert['id_alert'] + '">' +
        '           <i class="fa fa-edit text-primary text-hover-dark fs-5 me-4 position-relative top-2px cursor-pointer"></i>' +
        '       </button>' +
        '       <button class="btn p-0 delete-alert" value="' + alert['id_alert'] + '">' +
        '           <i class="fa fa-trash-alt text-danger text-hover-dark fs-5 me-4 position-relative top-2px cursor-pointer"></i>' +
        '       </button>' +
        '   </div>'
        : '<i class="fa fa-genderless text-warning ps-1 fs-1 me-4 position-relative top-2px"></i>';
    let alertDate = alert['alert_date'] !== null
        ? '<b class="small"><em>Fecha límite:</em></b><br>' +
        '   <span class="alert_date-fill">' + alert['alert_date'].substring(0, alert['alert_date'].indexOf(':') + 3) + '</span>'
        : '';
    // let youCreatedThis = user !== null && alert['alert_created_by'] === user ? '<i class="d-block mt-3">Tú has creado esta alerta</i>' : '';
    return '' +
        '<div class=" p-5 m-5">' +
        '   <div class="d-flex align-items-center align-content-center bg-transparent rounded justify-content-between">' +
        '       <!-- begin::Alert edit button-->' +
        '    ' + icon +
        '       <!-- end::Alert edit button-->' +
        '       <!-- begin::Alert Content-->' +
        '       <div class="d-flex flex-column mx-2 w-100 alert-fill">' +
        '           <!-- begin::Alert Title-->' +
        '           <div class="flex-grow-1 fw-bolder text-gray-800 fs-6 alert_title-fill">' +
        '               ' + alert['alert_title'] +
        '           </div>' +
        '           <!-- end::Alert Title-->' +
        '           <!-- begin::Alert Body-->' +
        '           <span class="py-1 alert_content-fill">' + alert['alert_content'] + '</span>' +
        '           <!-- end::Alert Body-->' +
        /*
        '           <!-- start::"You created this" Message-->' +
        '           <div class="text-left fs-10">' + youCreatedThis + '</div>' +
        '           <!-- end::"You created this" Message-->' +
         */
        '       </div>' +
        '       <!-- end::Alert Content-->' +
        '       <!-- start::Alert Date-->' +
        '       <span class="text-left col-3">' + alertDate + '</span>' +
        '   </div>' +
        '</div>'
}

// =====================================================================================================================
// SECTION TWO: Left modal to manage alert creation
// =====================================================================================================================

function checkAlertDate(datetime, datetimeCheckbox) {
    if (datetimeCheckbox.is(':checked')) {
        return true;
    } else if (datetime.val().match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/)) {
        datetime.removeClass('is-invalid');
        return true;
    }
    datetime.addClass('is-invalid');
    toggleFeedback(document.getElementById('exp_date-feedback'));
    return false;
}

function createAlert() {
    $('#save_alert-btn').click(function () {
        const formData = getAlertForm();
        fetch('/news/add_alert', {method: 'post', body: formData})
            .then(r => r.json())
            .then((data) => {
                if (!data['error']) {
                    console.log(data);
                    toastr.success('Alerta añadida con éxito.', 'Formulario enviado');
                    window.location.reload();
                } else {
                    toastr.error(data['msg'], 'Formulario devuelto');
                }
            }).catch((e) => {
            console.log("❌ Error: ", e);
        });
    });
}

function setDatetimeFormInputs() {
    const datetime = document.getElementById('alert-exp_date');
    const datetimeCheckbox = document.getElementById('no-exp_date');
    // Enable or disable datetime-local input depending on checkbox
    datetimeCheckbox.addEventListener('change', function () {
        datetime.disabled = datetimeCheckbox.checked;
    });
    datetime.addEventListener('change', function () {
        let timeValid = datetime.value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/);
        datetime.classList.toggle('is-valid', timeValid);
        datetime.classList.toggle('is-invalid', !timeValid);
    });
}

function getAlertForm() {
    const formData = new FormData();
    formData.append('alert_title', $('#alert-title').val());
    formData.append('alert_content', $('#alert-content').val());
    formData.append('alert_date', $('#no-exp_date').is(":checked") ? null : $('#alert-exp_date').val());
    return formData;
}

function toggleModalEditable(bool) {
    // Change title
    $('#alert-modal .modal-header h2').html(!bool ? 'Crear Alerta' : 'Editar Alerta');
    // Switch buttons
    $('#update_alert-btn').toggleClass('d-none', !bool);
    $('#create_alert-btn').toggleClass('d-none', bool);
    // Unbind click events
    $('#save_alert-btn').unbind('click');
}

function initAlerts() {
    getAlerts();
    setDatetimeFormInputs();
    // Update alert on click
    [$('#update_alert-btn'), $('#create_alert-btn')].forEach(elem => {
        elem.click(function () {
            if (checkFields('alert') && checkAlertDate($('#alert-exp_date'), $('#no-exp_date'))) {
                $('#open-conf').trigger('click');
            }
        });
    });
    // Empty alert when opening modal from 'Create Alert' Main Button
    $('button[data-bs-target="#alert-modal"]').click(function () {
        emptyForms();
        // Save alert button gets unbinded here
        toggleModalEditable(false);
        // Then it gets binded here
        createAlert();
    });
    [$('#alert-title'), $('#alert-content')].forEach(elem => {
        elem.on('keyup', toggleValid);
    });
}

document.addEventListener('DOMContentLoaded', initAlerts);