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

