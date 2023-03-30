$( document ).ready(function() {
    let source_name = 'zaim_info';
    let url = 'https://crm.fin.media/api/vitrinaTemplate/' + source_name;

    let addParams = '&aff_sub2=' + getUrlParameter('source')
        + '&aff_sub3=' + getUrlParameter('type')
        + '&aff_sub4=' + getUrlParameter('hyp')
        + '&aff_sub5=' + getUrlParameter('visit');

    $.ajax({
        url: url,
        method: 'GET',
        success: function(res) {
            res.forEach(function(card){
                $('#cards').append("<a href=\"" + card.link + addParams + "\" onclick='click_fn(" + card.offerId + ");' target=\"_blank\" id='" + card.offerId + "' class=\"row item card_item\" data-special=\"0\">\n" +
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

function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let counter = '92845569';

let is_click = false;

$(document).ready(function() {
    setTimeout(function(){
        ym(counter, 'reachGoal', 'sit_on_offer_wall');
        ga('send', 'event', 'offer_wall', 'sit_on_offer_wall');
    },20000)
});

click_fn = function (offerId) {
    ym(counter, 'reachGoal', 'any_offer_click');
    ga('send', 'event', 'offer_wall', 'any_offer_click');

    ym(counter, 'reachGoal', 'offer_click_' + offerId);
    ga('send', 'event', 'offer_wall', 'offer_click_' + offerId);

    if (is_click === false) {
        ym(counter, 'reachGoal', 'first_offer_click');
        ga('send', 'event', 'offer_wall', 'first_offer_click');
        is_click = true;
    }
}

ga = function (couter, type, category, event) {
    // console.log('ga' + '_' + couter + '_' + type + '_' + event);
}

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