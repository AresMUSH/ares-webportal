import Controller from '@ember/controller';

export default Controller.extend({
    
    
    actions: {
        download() {
          
          var element = document.createElement('a');
           element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.get('model.log')));
           element.setAttribute('download', this.get('model.title'));

           element.style.display = 'none';
           document.body.appendChild(element);

           element.click();

           document.body.removeChild(element);
           
           
        }
    }
});