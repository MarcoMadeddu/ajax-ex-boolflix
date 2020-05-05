$(document).ready(function () {
    // V A R I A B I L I // 

    var input = $("#input");
    var btnSearch =$ ("#search");
    var list = $(".film-list");
    
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    input.focus(); //.select()

    // S E A R C H  B Y  C L I C K //
    btnSearch.click(function(){
        searchFilm(template, input ,list);
    });

     // S E A R C H  B Y  E N T E R  //
    input.keyup(function(e){
        if(e.which==13){
        searchFilm(template, input ,list);
        }
    });
// E N D  D O C U M E N T  R E A D Y //
});



// F U N C T I O N S //

// S E A R C H F I L M //
function searchFilm(template, from , list){
    list.children().remove();
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
            
            for(var i = 0; i < films.length; i++){
                var currentFilm = films[i];
                var value = {
                    title: currentFilm.title,
                    originalTitle: currentFilm.original_title,
                    originaLanguage: currentFilm.original_language,
                    averege: getvote(currentFilm.vote_average)
                };

                
                var set = template(value);
                list.append(set);
                from.val("");
            }

        },

        error: function() {
            console.log("oh no");
            
        }
    });
    
}

function getvote(number){
    
    if(number > 5){
        number = 5;
    }else{
        number.toFixed(0);
    }
    var stars = "";
    var star = '<i class="fas fa-star"></i>'
    for(var i = 0; i< number; i++){
        stars+=star;
    }
    return stars;
}

