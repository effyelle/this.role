</div>
<!--end::Content-->
</div>
<!--end::Container-->
</div>
<!--end::Content Wrapper2-->


</div>
<!--end::Wrapper-->
</div>
<!--end::Page-->
</div>
<!--end::Page Container-->
<script src="/assets/plugins/jQuery-3.6.0/jquery-3.6.0.js"></script>
<!-- begin::Templates Scripts-->
<script src="/assets/plugins/global/plugins.bundle.js"></script>
<script src="/assets/js/scripts.bundle.js"></script>
<script src="/assets/plugins/custom/fullcalendar/fullcalendar.bundle.js"></script>
<script src="/assets/plugins/custom/datatables/datatables.bundle.js"></script>
<script src="/assets/plugins/custom/formplugins/bootstrap-datepicker/bootstrap-datepicker.js"></script>
<script src="/assets/plugins/custom/formplugins/bootstrap-datepicker/locales/bootstrap-datepicker.es.min.js"></script>
<script src="/assets/plugins/custom/formplugins/select2/es.js"></script>
<script src="/assets/js/widgets.bundle.js"></script>
<script src="/assets/js/custom/widgets.js"></script>
<script src="/assets/js/custom.emp.js"></script>
<script src="/assets/js/general.emb.js"></script>
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-org-chart@2"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-flextree@2.1.2/build/d3-flextree.js"></script>
<script type="text/javascript" src="/assets/js/custom/apps/groups/teams.js"></script>
<!-- end::Templates Scripts-->
<!-- begin::Custom Scripts-->
<script>
    function getForm(parent) {
        let formFields = document.querySelectorAll(parent + ' .this-role-form-field');
        let form = {};
        for (let i = 0; i < formFields.length; i++) {
            if (formFields[i].value === '') return false;
            let key = formFields[i].getAttribute('name');
            if (key !== null) {
                form[key] = formFields[i].value;
            }
        }
        return form;
    }

    function toSentenceCase(str) {
        let strAr = str.split(' ');
        str = '';
        for (let i in strAr) {
            str += strAr[i].charAt(0).toUpperCase() + strAr[i].substring(1).toLowerCase();
            if (typeof strAr[i] !== 'undefined') str += ' ';
        }
        return str;
    }
</script>
<!-- end::Custom Scripts-->
</body>
</html>