$(document).ready(function () {
    const tabs = $('.tab-content');
    $('li.tab').click(function () {
        let name = $(this).attr('data-tab');
        tabs.hide();
        $(`div.tab-content[data-tab="${name}"]`).show();
    });

    $(`li.tab[data-tab="home"]`).click();
});

function global_buildDice(num1, num2) {
    let dice = Math.max(num1, num2);
    let upgrades = Math.min(num1, num2);
    let pool = $('#templates div[name="dice_y"]').html().repeat(Math.max(0, upgrades));
    pool += $('#templates div[name="dice_g"]').html().repeat(dice - upgrades);
    return pool;
}

function global_buildTrack(container, length, interval, radio_class, interval_class, zero_start, callback) {
    for (let i = 0; i <= length; i++) {
        let title = zero_start?i: 1+i;
        let checkbox = $(`<input type="radio" class="${radio_class}" title="${title}">`);
        checkbox.click(() => callback(i));
        if (i > 0 && i % interval === 0) {
            checkbox.addClass("interval");
            checkbox.addClass(interval_class);
            container.append(checkbox);
            container.append('<label>');
        } else
            container.append(checkbox);
    }
}

