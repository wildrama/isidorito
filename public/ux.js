// mostrar la hora actual

    let output = document.querySelector('#actualTime');
  
        let today = new Date();
        
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        let date = today.getDate();
        let current_date = `${date}/${month}/${year}`;
        output.innerText = current_date;
