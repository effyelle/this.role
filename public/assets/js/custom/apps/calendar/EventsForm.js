class EventsForm {

    constructor(jQueryObjects) {
        this.title = jQueryObjects['title'];
        this.details = jQueryObjects['details'];
        this.dateInputs = jQueryObjects['dateInputs'];
        this.startDate = jQueryObjects['startDate'];
        this.endDate = jQueryObjects['endDate'];
        this.timeInputs = jQueryObjects['timeInputs'];
        this.startTime = jQueryObjects['initTime'];
        this.endTime = jQueryObjects['endTime'];
        this.type = jQueryObjects['type'];
        // Fill select
        this.fillTypeSelect2();
        // Init select2
        this.type.select2({minimumResultsForSearch: 1 / 0});
        this.select2type = $('.select2-selection.form-control');
        this.allDay = jQueryObjects['allDay'];
        this.isPublic = jQueryObjects['isPublic'];
        this.isPublicContainer = jQueryObjects['isPublicContainer'];
        this.submitBtn = jQueryObjects['submitBtn'];
        this.eventId = jQueryObjects['closeModal'];
        this.userCreator = jQueryObjects['deleteEvt'];
        this.configStartEndTime();
        this.formTitle = jQueryObjects['formTitle'];
    }

    /**
     * Fill select type from DB
     * -----------------------------------------------------------------------------------------------------------------
     */
    fillTypeSelect2() {
        $.ajax({
            accepts: '*//*',
            url: 'calendar/get_types',
            type: 'GET',
            dataType: 'json' // this line receives response a json instead of text, comment for debugging
        }).done((data) => { // arrow function needed for this object not to change
            console.log('Types loaded.');
            if (data['res'] !== false) {
                data['res'].forEach(type => {
                    this.type.html(this.type.html() +
                        '<option value="' + type['event_type_id'] + '">' + // Value is type ID
                        '' + type['event_type'] + // Option name is event type
                        '</option>');
                });
            }
        }).fail(function (data) {
            console.log('Something went wrong loading event types.');
            console.log(data);
        });
    }

    /**
     * Config start/end datetimes
     * -----------------------------------------------------------------------------------------------------------------
     * Set starting and ending dates so that the starting date will never be previous to TODAY, and the ending date
     * will never be previous to the starting date.
     * Set starting and ending hours im the same way.
     */
    configStartEndTime() {
        if (this.startDate.val() && this.endDate.val()) {
            // Set min for end date
            this.endDate.attr('min', this.startDate.val());
            // Set end date like init date if invalid
            if (this.startDate.val() && this.endDate.val() < this.startDate.val()) this.endDate.val(this.startDate.val());
        } else {
            // Set min for start date
            this.startDate.attr('min', TODAY);
            // Set value for start date
            this.startDate.val(TODAY);
            // Set min for end date
            this.endDate.attr('min', this.startDate.val());
            // Set value for end date
            this.endDate.val(this.startDate.val());
        }
    }

    resetTimeInputs() {
        this.timeInputs.removeClass('is-valid');
        this.timeInputs.removeClass('is-invalid');
        this.timeInputs.val('');
    }

    activateTriggers() {
        this.allDay.on('change', () => {
            // Toggle  input initTime and endTime if allDay checkbox is active.
            this.timeInputs.prop('disabled', this.allDay.is(':checked'));
            if (this.allDay.is(':checked')) this.resetTimeInputs();
        });
        this.dateInputs.on('change', () => {
            this.configStartEndTime();
        });
    }

    /**
     * Toggle css validity
     * -----------------------------------------------------------------------------------------------------------------
     * Set class valid or invalid to a jQuery Object upon parameters received.
     *
     * @param jqObj jQuery Object
     * @param isValid boolean
     */
    toggleValid(jqObj, isValid) {
        jqObj.addClass(isValid ? 'is-valid' : 'is-invalid');
        jqObj.removeClass(!isValid ? 'is-valid' : 'is-invalid');
    }

    /**
     * Toggle feedback message
     * -----------------------------------------------------------------------------------------------------------------
     * @param feedback
     */
    togglePopupFeedback(feedback) {
        feedback.addClass('show');
        setTimeout(function () {
            feedback.removeClass('show');
        }, 2000);
    }

    checkFields() {
        this.toggleValid(this.title, this.title.val() !== '');
        let validDate = this.startDate.val() && this.endDate.val() && this.endDate.val() >= this.startDate.val();
        this.toggleValid(this.dateInputs, validDate);
        if (!this.allDay.is(':checked')) {
            let validTime = this.startTime.val() && this.endTime.val()
                && !(this.startDate.val() === this.endDate.val() && this.endTime.val() < this.startTime.val());
            this.toggleValid(this.timeInputs, validTime);
            if (this.startDate.val() === this.endDate.val() && this.endTime.val() < this.startTime.val()) {
                this.togglePopupFeedback($('.end-time span.popup'));
            }
        }
        this.toggleValid(this.select2type, this.type.val());
        return !($('.is-invalid').length > 0);
    }

    addEvent() {
        $.ajax({
            accepts: '*//*',
            url: 'calendar/add_event',
            type: 'POST',
            data: {
                title: this.title.val(),
                details: this.details.val(),
                userId: this.submitBtn.val(),
                start: this.startDate.val() + " " + this.startTime.val(),
                end: this.endDate.val() + " " + this.endTime.val(),
                allDay: this.allDay.is(':checked') ? 1 : 0,
                type: this.type.val(),
                isPublic: this.isPublic.is(':checked') ? 1 : 0
            },
            dataType: 'json' // this line receives response a json instead of text, comment for debugging
        }).done((data) => {
            console.log('Event added successfully.');
            // If error, log response
            if (data['res']) alert(data['res']);
            // Add event to fullcalendar
            else {
                calendar.addEvent(data);
                // Close modal
                $('#closeModal').trigger('click');
                // Reset and empty form
                this.resetForm();
            }
        }).fail(function (data) {
            console.log('Something went wrong.');
            console.log(data);
        });
    }

    updateEvent(event) {
        $.ajax({
            accepts: '*//*',
            url: 'calendar/update_event',
            type: 'POST',
            data: event,
            dataType: 'json' // this line receives response a json instead of text, comment for debugging
        }).done((data) => {
            console.log('Event updated.');
        }).fail(function (data) {
            console.log('Something went wrong.');
            console.log(data);
        });
    }

    deleteEvent() {
        $.ajax({
            accepts: '*//*',
            url: 'calendar/delete_event',
            type: 'POST',
            data: {eventId: this.eventId.val()},
            dataType: 'json' // this line receives response a json instead of text, comment for debugging
        }).done((data) => {
            console.log(data);
            if (data['response'] === null || data['response'] === '') {
                console.log("POST['eventId'] was empty.");
            } else if (!data['response']) {
                console.log('There was a failure deleting from DB.')
            } else {
                console.log('Event succesfully deleted.');
                toastr.success("Se envió el formulario.", "Evento eliminado con éxito.");
                setTimeout(function () {
                    window.location.reload()
                }, 1000);
            }
        }).fail((data) => {
            console.log('Something went wrong.');
            console.log(data);
        });
    }

    fillFormWithEvent(e) {
        this.title.val(e._def.title);
        this.details.val(e._def.extendedProps.details);
        this.startDate.val(e.startStr.substring(0, 10));
        this.endDate.val(e.endStr !== '' ? e.endStr.substring(0, 10) : e.startStr.substring(0, 10));
        this.allDay.prop('checked', e._def.allDay);
        this.timeInputs.prop('disabled', e._def.allDay);
        this.startTime.val(e.startStr.substring(11, 16));
        this.endTime.val(e.endStr !== '' ? e.endStr.substring(11, 16) : e.startStr.substring(11, 16));
        this.type.val(e._def.extendedProps.type).trigger('change');
        this.eventId.val(e._def.publicId);
        this.isPublic.prop('checked', e._def.extendedProps.isPublic);
        if (e._def.extendedProps.userId !== this.submitBtn.val()) {
            this.isPublicContainer.hide();
        }
        this.checkFields();
    }

    resetForm() {
        // Empty form fields
        this.formTitle.html('Añadir Evento');
        $('.is-invalid').removeClass('is-invalid');
        $('.is-valid').removeClass('is-valid');
        this.title.val('');
        this.details.val('');
        this.dateInputs.val('');
        this.timeInputs.val('');
        // Unselect select2
        this.type.val('none').trigger('change');
        // Unselect checkboxes
        this.allDay.prop('checked', true);
        this.isPublic.prop('checked', false);
        this.isPublicContainer.show();
        this.timeInputs.prop('disabled', this.allDay.is(':checked'));
        // Reset dates
        this.configStartEndTime();
    }

}