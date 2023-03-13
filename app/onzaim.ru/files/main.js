$( document ).ready(function() {
    let source_name = 'onzaim_ru';
    let url = 'https://crm.fin.media/api/vitrinaTemplate/' + source_name;
    $.ajax({
        url: url,
        method: 'GET',
        success: function(res) {
            res.forEach(function(card){
                $('#cards').append("<a href=\"" + card.link + "\" target=\"_blank\" class=\"row item\" data-special=\"0\">\n" +
                    "                     <div class=\"col\">\n" +
                    "                        <picture>\n" +
                    "                          \n" +
                    "                           <img src=\"" + card.logo + "\" alt=\"\">\n" +
                    "                        </picture>\n" +
                    "                     </div>\n" +
                    "                     <div class=\"col\"> <span style=\"margin: 2px 0px -10px;\" class=\"summa\">" + number_format(card.summ, 0, ',', ' ') + " Р</span> </div>\n" +
                    "                     <div class=\"col\">\n" +
                    "                        <div class=\"st\"> <span style=\"margin: 2px 0px -10px;\" class=\"stavka\">" + card.percent + " %</span>  </div>\n" +
                    "                     </div>\n" +
                    "                     <div class=\"col\"> <span style=\"margin: 2px 0px -10px;\" class=\"vozrast\">" + card.age + " лет</span> </div>\n" +
                    "                     <div class=\"col\"> <span class=\"link\" style=\"text-decoration: none;\">Получить деньги</span> \n" +
                    "                     </div>\n" +
                    "                  </a>")
            })
        },
        error: function(res){
            console.log(res);
            console.log('error');
        }
    });
});

number_format = function (number, decimals, dec_point, thousands_sep) {
    number = number.toFixed(decimals);

    var nstr = number.toString();
    nstr += '';
    x = nstr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? dec_point + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1))
        x1 = x1.replace(rgx, '$1' + thousands_sep + '$2');

    return x1 + x2;
}