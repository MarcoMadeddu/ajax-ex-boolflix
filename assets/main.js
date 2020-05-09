$(document).ready(function () {

    // V A R I A B I L I // 
    var input = $("#input");
    var btnSearch =$ ("#search");
    var list = $(".film-list"); 
    var serieList = $(".film-debug"); 
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);
    var status = $(".status>h2");
    var topFilm = ["Tyler rake", "il buco" , "shutter island" , "american sniper", "prova a prendermi" ,  "inception" , "avengers endgame" , "once upon a time in hollywood" , "el camino" , "focus"];
    var topSerie = ["the witcher"  , "chernobyl" , "prison break", "Black mirror" , "Game of thrones" , "breaking  bad" , "Elitè" , "la casa di carta", "Vis a vis" , "stranger things"];
    var param = {list,template,input,status};
    
    // D E B U G  F I L M //
    runDebug(topFilm , template , list, "Film");
    runDebug(topSerie , template , serieList, "Serie");
    
    // S E A R C H  B Y  C L I C K //
    btnSearch.click(function(){     
        run(param);
    });

     // S E A R C H  B Y  E N T E R  //
    input.keypress(function(e){
        if(e.which==13){
            run(param);
        }
    });

    // H O V E R  F O R  I N F O //
    $('body').on('mouseenter', 'input', function() {
       $(this).parent().find("i").addClass("control-active");
       
        
     });

    $('body').on('mouseenter', '.movie', function() {
       $(this).children("ul").addClass("active");
    });

    $('body').on('mouseleave', '.movie', function() {
        $(this).children("ul").removeClass("active");
     });

     $('body').on('mouseenter', 'ul', function() {
        $(this).children("li").fadeIn();
        $(this).addClass("border");
     });


     $('body').on('mouseleave', 'ul', function() {
        $(this).removeClass("border");
        $(this).children("li").fadeOut();
        $(this).children(".title").fadeIn();
     });
// E N D  D O C U M E N T  R E A D Y //
});



// **F U N C T I O N S** //

// R U N  D E B U G //
function runDebug(string , template, list,type){
    
    var url;
    if(type == "Film"){
        url = "https://api.themoviedb.org/3/search/movie";
    }else if( type == "Serie"){
        url = "https://api.themoviedb.org/3/search/tv";
    }

    for(var y = 0; y< 10; y++)
    {
        $.ajax({
            url: url,
            method: "GET",
            data: {
                api_key: "d095562fc608329d4fa8c044d034e379",
                query: string[y],
                language: "it-IT",
            },
            success: function (data) {
                var filmTop =selectTop(data);
                getResults(template, list , filmTop, type);
            },
            error: function() {
                console.log("Errore chiamata API");
            }
        }); 
    } 
};

// S E L E C T  T O P //
function selectTop(data){
    var films = data.results;
    var us =[];
    for(var i =  0; i< films.length; i++){
        var thisData = films[i];
        if(thisData.poster_path !== null && thisData.vote_count > 500){
        us.push(thisData);
        }
    };
    return us;
}

// R U N //
function run(param){
    if(param.input.val() !== ""){
        resetList(param.list);  
        searchData(param.template, param.input , param.list, "Film");
        searchData(param.template, param.input , param.list, "Serie");
        resetInput(param.input);
        compileStatus(param.status);
    }else{
        alert("riempi il campo");
    }
}

// R E S E T  L I S T//
function resetList(list){
    list.children().remove();
};

// R E S E T  I N P U T //
function resetInput(input){
    input.val("");
};

// S E A R C H  D A T A //
function searchData(template, from , list, type){ 
    var filmToSearch = from.val().trim();
    var url;

    if(type == "Film"){
        url = "https://api.themoviedb.org/3/search/movie";
    }else if( type == "Serie"){
        url = "https://api.themoviedb.org/3/search/tv";
    }

    $.ajax({
        url: url,
        method: "GET",
        data: {
            api_key: "d095562fc608329d4fa8c044d034e379",
            query: filmToSearch,
            language: "it-IT"
        },
        success: function (data) {
            var films = data.results;
            if(films.length>0){
               getResults(template, list , films, type);
            
            }else{
                alert("NESSUN RISULTATO PER " + type );
                from.select();
            }
        },
        error: function() {
            console.log("Errore chiamata API");
        }
    });   
};
// G E T  R E S U L T S //
function getResults(template, list , data, type){
    for(var i = 0; i < data.length; i++){
        var currentData = data[i];
        var title , originalTitle;

        if (type=="Film"){
            title= currentData.title;
            originalTitle= currentData.original_title;
        }else if(type=="Serie"){
            title= currentData.name;
            originalTitle= currentData.original_name;
        }

        var value = {
            poster: getImg(currentData.poster_path),
            title: title,
            originalTitle: originalTitle,
            originaLanguage: getLanguage(currentData.original_language),
            averege: getvote(currentData.vote_average),
            overview: getOw(currentData.overview),
            type: type
        };
        append(template,value,list);
    }
};

// G E T  I M G //
function getImg(string){
    var ppUrl ="";
    if(string== null){
        ppUrl = "img/not-found.png"
    }else{
        ppUrl = "https://image.tmdb.org/t/p/w342/" + string;
    }
    return ppUrl;
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
function getLanguage(lang) {
    switch(lang) {
        case "it":
          return '<img class="flag" src="img/it.svg" alt="it">';
          break;
        case "en":
          return '<img class="flag" src="img/en.svg" alt="eng">';
          break;
        default:
          return lang;
      }
    
};

// G E T  O V E R V I E W //
function getOw(trama){
    var res= "";
    if(trama.length > 100){
        res = trama.substr(0, 100);
    }else{
        res = trama;
    }
return res;
}

// A P P E N D //
function append(template,value,list){
    var set = template(value);
        list.append(set);
};

// C O M P I L E  S T A T U S //
function compileStatus(status){
    status.text("I tuoi risultati");
    return status;
}
