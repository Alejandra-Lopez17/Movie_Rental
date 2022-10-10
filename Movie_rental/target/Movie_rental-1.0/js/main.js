//Trae el usuario del login 
var username = new URL(location.href).searchParams.get("username");
var user;

$(document).ready(function () {

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    getUsuario().then(function () {
        
        $("#mi-perfil-btn").attr("href","profile.html?username=" + username);
        
        $("#user-saldo").html(user.saldo.toFixed(2) + "$");

        getPeliculas(false, "ASC");

        $("#ordenar-genero").click(ordenarPeliculas);
    });
});

//trae el saldo
async function getUsuario() {

    await $.ajax({
        type: "GET",
        dataType: "html",
        url: "./ServletUsuarioPedir",
        data: $.param({
            username: username
        }),
        success: function (result) {
            let parsedResult = JSON.parse(result);

            if (parsedResult != false) {
                user = parsedResult;
            } else {
                console.log("Error recuperando los datos del usuario");
            }
        }
    });

}
function getPeliculas(ordenar, orden) {

    $.ajax({
        type: "GET",
        dataType: "html",
        url: "./ServletPeliculaListar",
        data: $.param({
            ordenar: ordenar,
            orden: orden
        }),
        success: function (result) {
            let parsedResult = JSON.parse(result);

            if (parsedResult != false) {
                mostrarPeliculas(parsedResult);
            } else {
                console.log("Error recuperando los datos de las peliculas");
            }
        }
    });
}
function mostrarPeliculas(peliculas) {

    let contenido = "";

    $.each(peliculas, function (index, pelicula) {

        pelicula = JSON.parse(pelicula);
        let precio;

        if (pelicula.copias > 0) {

            if (user.premium) {

                if (pelicula.novedad) {
                    precio = (2 - (2 * 0.1));
                } else {
                    precio = (1 - (1 * 0.1));
                }
            } else {
                if (pelicula.novedad) {
                    precio = 2;
                } else {
                    precio = 1;
                }
            }

            contenido += '<tr><th scope="row">' + pelicula.id + '</th>' +
                    '<td>' + pelicula.titulo + '</td>' +
                    '<td>' + pelicula.genero + '</td>' +
                    '<td>' + pelicula.autor + '</td>' +
                    '<td>' + pelicula.copias + '</td>' +
                    '<td><input type="checkbox" name="novedad" id="novedad' + pelicula.id + '" disabled ';
            if (pelicula.novedad) {
                contenido += 'checked';
            }
            contenido += '></td>' +
                    '<td>' + precio + '</td>' +
                    '<td><button onclick="alquilarPelicula(' + pelicula.id + ',' + precio + ');" class="btn btn-success" ';
            if (user.saldo < precio) {
                contenido += ' disabled ';
            }

            contenido += '>Reservar</button></td></tr>'

        }
    });
    $("#peliculas-tbody").html(contenido);
}

