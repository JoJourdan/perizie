"use strict"

$(document).ready(function () {

    let _tbody = $("tbody")
    let _cercaUtente = $("#cercaUtente")
    let _nomeUtente = $("#nomeUtente")
    let _inserisciUtente = $("#inserisciUtente")

    getUtenti()


    function getUtenti() {
        let rq = inviaRichiesta('GET', '/api/elencoUtenti',);
        rq.then(function (response) {
            console.log(response);
            _tbody.empty()
            for (let utente of response.data) {
                let _tr = $("<tr>").appendTo(_tbody)
                $("<td>").appendTo(_tr).text(utente._id)
                $("<td>").appendTo(_tr).text(utente.username)

            }
        })
        rq.catch(errore)
    }

    _cercaUtente.on("click", () => {
        console.log(_nomeUtente.val())
        let rq = inviaRichiesta('GET', '/api/cercaUtente', { "username": _nomeUtente.val() });
        rq.then(function (response) {
            console.log(response.data);
            _tbody.empty()
            for (let utente of response.data) {
                let _tr = $("<tr>").appendTo(_tbody)
                $("<td>").appendTo(_tr).text(utente._id)
                $("<td>").appendTo(_tr).text(utente.username)

            }
        })
        rq.catch(errore)
    })

    _inserisciUtente.on("click", () => {
        Swal.fire({
            title: "Inserire nuovo nome utente",
            input: "text",
            inputPlaceholder: "cognome.nome",
            inputAttributes: {
                autocapitalize: "on",
                
            },
            showCancelButton: true,
            confirmButtonText: "Conferma",
            showLoaderOnConfirm: true,
            preConfirm: async (username) => {
                try {

                    return username;
                } catch (error) {
                    Swal.showValidationMessage(`
                  Request failed: ${error}
                `);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(result.value)
                var reg = new RegExp("^.+\..+$", "i")
                  
                if(reg.test(result.value)){
                    let username=result.value.toLowerCase()
                let rq = inviaRichiesta('POST', '/api/inserisciUtente',{"username":username,"password":"$2a$10$1C8t/CO7NF/NPlurdMPjr.GjsjrKlXPQspo5VmQ/qYhAMQ16z27Za"});
                rq.then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Utente aggiunto con successo",
                        showConfirmButton: false,
                        timer: 1500
                      });
                    getUtenti()
                })
                rq.catch(errore)
                }
                else{
                    Swal.fire({
                        icon: "error",
                        title: "Nome utente non valido",
                        showConfirmButton: false,
                        timer: 1500
                      });
                }
            }
        });
    })

});