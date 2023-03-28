"use strict";
var KTSigninGeneral = function () {
    var t, e, i;
    return {
        init: function () {
            t = document.querySelector("#kt_sign_in_form"), e = document.querySelector("#kt_sign_in_submit"), i = FormValidation.formValidation(t, {
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: "El email es requerido"
                            },
                            emailAddress: {
                                message: "El valor no es una dirección de correo electrónico válida"
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "La contraseña es requerida"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger,
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row"
                    })
                }
            }), e.addEventListener("click", (function (n) {
                n.preventDefault(), i.validate().then((function (i) {
                    "Valid" == i ? (e.setAttribute("data-kt-indicator", "on"), e.disabled = !0, setTimeout((function () {
                        $.ajax({
                            type: "POST",
                            url: "/app/check_login",
                            data: $("#kt_sign_in_form").serialize(),
                            dataType: "json",
                            success: function (response) {
                                e.removeAttribute("data-kt-indicator");
                                e.disabled = !1;
                                location.reload();
                            },
                            error:function (xhr, ajaxOptions, thrownError) {
                                Swal.fire({
                                    text: "Lo sentimos, parece que se han detectado algunos errores. Vuelva a intentarlo.",
                                    icon: "error",
                                    buttonsStyling: !1,
                                    confirmButtonText: "De acuerdo",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then((function (e) {
                                    $("#kt_sign_in_form input").removeClass('is-valid').val('');
                                }))
                            }
                        })
                    }), 500)) : Swal.fire({
                        text: "Lo sentimos, parece que se han detectado algunos errores, inténtalo de nuevo.",
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "De acuerdo",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    })
                }))
            }))
        }
    }
}();
KTUtil.onDOMContentLoaded((function () {
    KTSigninGeneral.init()
}));