/**
 * @Component esta clase lo que hace es generar el componente seleccionado por la clase Profile.
 */
class Component {
    domElement;
    component;
    data = {
        headers : {

        }
    };
    config = {
      date : {
         generate : this.date
     },
      modal: {
         generate : this.modal
      },
      datatable: {
         generate : this.datatable
      },
      form : {
        generate : this.dataExtract,
        send : this.send
      },
      button : {
        generate : this.button
      }
    };

    constructor(component, domElement, config){
         this.component = component;
         this.domElement = domElement;
         const datedObjects = Object.keys(this.config);
         datedObjects.forEach(object => {
             if(this.component == object){
                const pConfig = Object.keys(this.config[this.component]);
                pConfig.forEach(element=>{
                    this.config[this.component]['domElement'] = domElement;
                    this.config[this.component][element](config);
                })
             }
         });
    }    

    button(config){
        this['savedData'] = {};
        $(this.domElement).on(config.event, config.callback);
    }
 
    date(config){
        this['savedData'] = {};
         $(this.domElement).flatpickr(config);
    }
 
    modal(config){
         $(this.domElement).on('click', function () {
             bootbox.dialog(config)
         });
    }
 
    datatable(config){
        $(this.domElement).DataTable(config);
    }
    
    dataExtract(config){
        if(config.ajax){
            const dElements = this.domElement.querySelectorAll(`[${config.get}]`);
            const sElement =  this.domElement.querySelector(`[${config.send}]`);
            this.data = {
                formClass : new FormData(),
                url : this.domElement.action,
                type : this.domElement.enctype,
                sender : sElement
            }
            dElements.forEach(element=>{
                if(element.type == 'file'){
                    const img = element.files[0];
                    if(img != undefined){
                        this.data.formClass.append(element.name, img);
                    }
                }else{
                    this.data.formClass.append(element.name, element.value);
                }
            });
        }
    }

    send(params){
        const s = ()=>{
            return params
        }
        $(this.data.sender).click(async()=>{
            this.generate(s());
            /* discoment in case of debug
            for (const pair of this.data.formClass.entries()) {
                console.log(`${pair[0]}, ${pair[1]}`);
            }*/
            const conn = await fetch(this.data.url, {
                method: s().method,
                headers : this.data.headers,
                body: this.data.formClass
            });
            const resp = await conn.json();
            
            //discoment in case of debug
            //console.log(resp)
        
            if(resp.status == 200 && s().redirect){
                window.location.reload();
            }else if(resp.status == 200 && !s().redirect){
                if(Object.hasOwn(resp, 'msg')){
                    toastr.success("", resp.msg);
                }else{
                    toastr.success("", "Operación completada")
                }
            }else{
                if(Object.hasOwn(resp, 'msg')){
                    toastr.error("", resp.msg);
                }else{
                    toastr.error("", "Operación no completada")
                }
            }

        })
    }
}