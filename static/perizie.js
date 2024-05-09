"use strict"

$(document).ready(async function () {
    await caricaGoogleMaps();

    const searchParams = new URLSearchParams(window.location.search);
    getPerizie()
    let mapContainer =$(".mapContainer").get(0);

    let perizie


    function getPerizie(){
        let utente=searchParams.get('utente')
        utente=utente.replace("'","")
        utente=utente.replace("'","")
        let rq = inviaRichiesta('GET', '/api/getPerizieUtente',{"_id":utente});
        rq.then(function (response) {
            perizie=response.data
            console.log(response.data[0].coordinate);
            let coord={"lat":response.data[0].coordinate.x,"lng":response.data[0].coordinate.y}
            let geoCoder = new google.maps.Geocoder();
		    geoCoder.geocode({"location": coord}, function(results, status) {
			if(status == google.maps.GeocoderStatus.OK)
			{
				console.log(results[0]);
				disegnaMappa(results[0]);
			}
		    });
            
        })
        rq.catch(errore)
    }

    function disegnaMappa(result) {
        console.log(perizie)
		let position = result.geometry.location;
		let mapOptions = {
			"center": position,
			"zoom": 16
		}
		let mappa = new google.maps.Map(mapContainer, mapOptions);
        
        for(let perizia of perizie){

            let coord={"lat":perizia.coordinate.x,"lng":perizia.coordinate.y}

            let geoCoder = new google.maps.Geocoder();
		    geoCoder.geocode({"location": coord}, function(res, status) {
			if(status == google.maps.GeocoderStatus.OK)
			{
                let infoWindowOptions = {
                    "content":
                    `
                    <div class="infoWindow">
                        <h2>${perizia.descrizione}</h2>
                        <p><span>Indirizzo:</span></br>${res[0].formatted_address}</p>
                    </div>
                    `,
                    "width": 150 
                }
                let infoWindow = new google.maps.InfoWindow(infoWindowOptions);


                let markerOptions = {
                    "map": mappa,
                    "position": coord,
                    "title": "ITIS Vallauri"
                }
                let marker = new google.maps.Marker(markerOptions);
                
                marker.addListener("click", function() {
                    infoWindow.open(mappa, marker);
                });



			}
		    });

            
            
        }
		
	}

    




})