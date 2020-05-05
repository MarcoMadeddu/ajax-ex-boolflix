$(document).ready(function () {
    // V A R I A B I L I // 

    var input = $("#input");
    var btnSearch =$ ("#search");
    var list = $(".film-list");
    
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    input.focus();

    // S E A R C H  B Y  C L I C K //
    btnSearch.click(function(){
        if(input.val() !== ""){
        resetList(list);  
        searchFilm(template, input ,list);
        searchTvSerie(template, input ,list);
        resetInput(input);
        }else{
            alert("riempi il campo");
        }
    });

     // S E A R C H  B Y  E N T E R  //
    input.keyup(function(e){
        if(e.which==13){
            if(input.val() !== ""){
                resetList(list);  
                searchFilm(template, input ,list);
                searchTvSerie(template, input ,list);
                resetInput(input);
                }else{
                    alert("riempi il campo");
                }
        }
    });
// E N D  D O C U M E N T  R E A D Y //
});



// **F U N C T I O N S** //

// R E S E T  L I S T//
function resetList(list){
    list.children().remove();
};

// R E S E T  I N P U T //
function resetInput(input){
    input.val("");
};

// S E A R C H F I L M //
function searchFilm(template, from , list){
    var filmToSearch = from.val().trim();
    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        method: "GET",
        data: {
            api_key: "d095562fc608329d4fa8c044d034e379",
            query: filmToSearch,
            language: "it-IT"
        },
        success: function (data) {
            var films = data.results;
            if(films.length>0){
               getFilm(template, list , films);
            
            }else{
                alert("NESSUN FILM");
                from.select();
            }
        },
        error: function() {
            console.log("Errore chiamata API film");
        }
    });   
};
// G E T F I L M //
function getFilm(template, list , films){
    for(var i = 0; i < films.length; i++){
        var currentFilm = films[i];
        var value = {
            title: currentFilm.title,
            originalTitle: currentFilm.original_title,
            originaLanguage: getLanguage(currentFilm.original_language),
            averege: getvote(currentFilm.vote_average),
            type: "Film"
        };
        append(template,value,list);
    }
};

// S E A R C H  S E R I E //
function searchTvSerie(template, from , list){
    var serieToSearch = from.val().trim();
    $.ajax({
        url: "https://api.themoviedb.org/3/search/tv",
        method: "GET",
        data: {
            api_key: "d095562fc608329d4fa8c044d034e379",
            query: serieToSearch,
            language: "it-IT"
        },
        
        success: function (data) {
            var series = data.results;
            if(series.length>0){
                getSerie(template, list , series);
            }else{
                console.log("non ci sono serie");
                from.select();
            }
        },

        error: function() {
            console.log("Errore chiamata API serie tv");
            
        }
    });
}   
// G E T  S E R I E //  
function getSerie(template, list , series){
    for(var i = 0; i < series.length; i++){
        var currentSerie = series[i];
        var value = {
            title: currentSerie.name,
            originalTitle: currentSerie.original_name,
            originaLanguage: getLanguage(currentSerie.original_language),
            averege: getvote(currentSerie.vote_average),
            type: "Serie Tv"
        };
        append(template,value,list);    
    }
}

// G E T  V O T E //
function getvote(number){
    
    var value = Math.floor(number/2);

    var stars = "";
    for(var i = 1; i<= 5; i++){
        if(i <= value){
            stars += '<i class="fas fa-star"></i>';
        }else{
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// G E T  L A N G U A G E //
function getLanguage(type) {
    var it = "./assets/img2/'it.svg'";
    switch(type) {
        case "it":
          return '<img class="flag" src="img/it.svg" alt="it">';
          break;
        case "en":
          return '<img class="flag" src="img/en.svg" alt="eng">';
          break;
        default:
          return type;
      }
    
};

// A P P E N D //
function append(template,value,list){
    var set = template(value);
        list.append(set);
};

