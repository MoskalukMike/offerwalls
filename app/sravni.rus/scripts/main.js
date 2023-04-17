$( document ).ready(function() {
    let source_name = 'sravni_rus';
    let url = 'https://crm.fin.media/api/vitrinaTemplate/' + source_name;

    let addParams = '';

    if (getUrlParameter('type')) {
        addParams += '&aff_sub3=' + getUrlParameter('type');
    }
    if (getUrlParameter('hyp')) {
        addParams += '&aff_sub4=' + getUrlParameter('hyp');
    }
    if (getUrlParameter('visit')) {
        addParams += '&aff_sub5=' + getUrlParameter('visit');
    }

    $('.show-more-btn').on('click', function(){
        $('#cards-last').show().css('display', 'flex')
        $('.show-more-btn').hide()
    })

    let hideClass = '';
    let recommendation = "<div><span data-qa=\"Badge\" class=\"_lfqxd5\"><span class=\"_1grdi1h _1up09sy _d80tz3\">Mы рекомендуем</span></span></div>";

    $.ajax({
        url: url,
        method: 'GET',
        success: function(res) {
            res.forEach(function(card, index){
                if (index >= 2) {
                    hideClass = 'hide-cards';
                    recommendation = '';
                }
                $('#cards').append("<div data-qa=\"Card\" class=\"styles_card__1w-M8 styles_link__1BwP4 _utzdjt _1e4oips _1ke009i " + hideClass +"\">" +
                    "<a class=\"styles_link_content__157UG\">" +
                    "    <div class=\"styles_header__2NbIa\">" +
                    "<div class=\"styles_text__F-RYX\">" +
                    "<h6 class=\"styles_text__F-RYX _e9qrci _wf06uq\">" + card.name + "</h6></div>" +
                    "</div>" +
                    recommendation +
                    "<div class=\"styles_card_content__2Q2z7\">" +
                    "<div class=\"lazyload-wrapper\"><img class=\"styles_pixel__rFWHr\" alt=\"\" src=\"files/aff_i(1)\"></div>" +
                    "<div class=\"styles_content_row__1s5m-\">" +
                    "    <div class=\"styles_wrapper__3ShzQ\">" +
                    "        <div class=\"styles_title__29Z5R _1h41p0x\">Сумма до</div>" +
                    "        <div class=\"styles_data__dCyem _1h41p0x\">" + number_format(card.summ, 0, ',', ' ') +" ₽</div>" +
                    "    </div>" +
                    "    <div class=\"styles_wrapper__3ShzQ\">" +
                    "        <div class=\"styles_title__29Z5R _1h41p0x\">Ставка</div>" +
                    "        <div class=\"styles_data__dCyem _1h41p0x\">от " + card.percent + "%</div>" +
                    "    </div>" +
                    "    <div class=\"styles_wrapper__3ShzQ styles_content_item_special__3SZBw\">" +
                    "        <div class=\"styles_title__29Z5R styles_content_item_title_special__2oHh8 _1h41p0x\">Срок (дни)</div>" +
                    "        <div class=\"styles_data__dCyem styles_content_item_special__3SZBw _1h41p0x\">" + card.term + "</div>" +
                    "    </div>" +
                    "</div>" +
                    "</div>" +
                    "</a><a class=\"styles_header_logo__20K5t\" href=\"" + card.link + addParams +"\"><span data-qa=\"Badge\" class=\"styles_badge__2EOYG _lfqxd5\"><div data-qa=\"Avatar\" class=\"styles_logo__3ah2e _1odobbn _l850am\"><img class=\"_bsk47n\" src=\"" + card.logo_mobile + "\" alt=\"avatar\" loading=\"lazy\"></div><span class=\"_1grdi1h _13cnnoy _rcv8kb _1e8yrvd _1nbmjet\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"4\" y=\"4\" width=\"10\" height=\"10\" fill=\"var(--color-L100)\"></rect><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.8322 0.0606198L9.38253 0.853487C9.13414 0.934484 8.86596 0.934484 8.61847 0.853487L6.16877 0.0606198C5.58919 -0.126572 4.95832 0.134417 4.68203 0.676194L3.51028 2.9693C3.39148 3.20239 3.20249 3.39138 2.9694 3.51018L0.677195 4.68103C0.134517 4.95822 -0.126472 5.58909 0.0607202 6.16867L0.853587 8.61747C0.933684 8.86586 0.933684 9.13314 0.853587 9.38153L0.0607202 11.8312C-0.127372 12.4108 0.133617 13.0408 0.676295 13.318L2.9694 14.4897C3.20249 14.6085 3.39148 14.7984 3.51028 15.0306L4.68113 17.3237C4.95832 17.8655 5.58829 18.1274 6.16787 17.9393L8.61757 17.1464C8.86596 17.0663 9.13324 17.0663 9.38163 17.1464L11.8313 17.9393C12.4109 18.1274 13.0409 17.8664 13.3181 17.3237L14.4898 15.0306C14.6086 14.7975 14.7985 14.6085 15.0307 14.4897L17.3238 13.3189C17.8656 13.0417 18.1275 12.4117 17.9394 11.8321L17.1465 9.38243C17.0664 9.13404 17.0664 8.86676 17.1465 8.61837L17.9295 6.19926C18.123 5.60169 17.8539 4.95192 17.295 4.66663L15.0307 3.51018C14.7976 3.39138 14.6086 3.20149 14.4898 2.9693L13.319 0.676194C13.0418 0.134417 12.4118 -0.127472 11.8322 0.0606198ZM12.8328 6.23973C12.5826 6.02248 12.2037 6.04919 11.9864 6.29939L8.22524 10.631L5.64784 8.23972L5.5622 8.17346C5.32247 8.02034 5.00027 8.05556 4.79994 8.27148C4.57457 8.51439 4.58879 8.89401 4.8317 9.11938L7.86364 11.9324L7.95132 12C8.19686 12.1554 8.52711 12.1135 8.72474 11.8859L12.8925 7.08613L12.9559 6.99836C13.1011 6.75372 13.0552 6.43285 12.8328 6.23973Z\" fill=\"#00AFFF\"></path></svg></span></span></a>" +
                    "<div class=\"styles_actions__3u1a9\">" +
                    "<a class=\"styles_link__DRN1i styles_button__WlK5-\" target='_blank' href='" + card.link + addParams + "'>" +
                    "   <button data-qa=\"Button\" class=\"styles_button__1c96I _artl5a _a4n4z3 _tqjt92\"><span class=\"_hp2bt3\">Перейти на сайт</span></button>" +
                    "</a>" +
                    "</div>" +
                    "</div>")

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