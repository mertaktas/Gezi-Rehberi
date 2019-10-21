var express = require("express");
var app = express();

app.set("view engine", "ejs");



app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/geziler", function (req, res) {
    var geziler = [{
            name: "Ayder Yaylası",
            image: "https://cdn1.ntv.com.tr/gorsel/seyahat/dogu-karadenizin-gozdesi-ayderyaylasi/,pl5KNtnIvE29W2L-UgHvdQ.jpg?w=960&mode=max&v=20180807143956290"
        },
        {
            name: "Gito Yaylası",
            image: "http://www.karadenizyaylalari.com/uploads/p/gito-yaylasi_2.jpg"
        },
        {
            name: "Pokut Yaylası",
            image: "http://i4.hurimg.com/i/hurriyet/75/1110x740/579206c967b0aa20d0022c70.jpg"
        }
    ]
    res.render("geziler", {
        geziler: geziler
    });
});


app.listen("3000", function () {
    console.log("Server Çalıştı...");
});