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


let adversaries_index = 0;
const adversaries_common_stat_lines = {
    "Average": [2, 2, 2, 2, 2, 2],
    "Brawn": [3, 2, 2, 2, 2, 2],
    "Combat": [3, 3, 2, 2, 2, 2],
    "Pilot": [2, 3, 2, 2, 2, 2],
    "Stormtrooper": [3, 3, 2, 2, 3, 1],
};

function adversaries_addAdversary(selector) {
    const adversary = {
        idx: adversaries_index,
        size: 1,
        soak: 1,
        wounds_per: 5,
        strain_per: 5,
        code: null,
        wounds: 0,
        strain: 0,
    };

    let internal = $(`#templates div[name="${selector}"]`).html();
    adversary.code = $(`<div name="${selector}">`).attr('group_index', adversaries_index).append(internal);
    $('#adversaries').append(adversary.code);

    const el = $(`div[group_index=${adversary.idx}]`);
    const el_group_size = el.find('[name="group_size"]');
    const el_soak = el.find('[name="soak"]');
    const el_wounds_per = el.find('[name="wounds_per"]');
    const el_strain_per = el.find('[name="strain_per"]');
    const el_template = el.find('[name="adversary_template"]');
    const el_characteristics = el.find('.characteristics');

    el.find('[name="delete"]').click(function () {
        el.remove();
    });

    el_group_size.change(function () {
        adversary.size = $(this).val();
        updateAdversary();
    });
    el_soak.change(function () {
        adversary.soak = $(this).val();
        updateAdversary();
    });
    el_wounds_per.change(function () {
        adversary.wounds_per = $(this).val();
        updateAdversary();
    });
    el_strain_per.change(function () {
        adversary.strain_per = $(this).val();
        updateAdversary();
    });
    el_template.change(function () {
        let array = adversaries_common_stat_lines[$(this).val()];
        el_characteristics.find('input[type="number"]').each((idx, element) => $(element).val(array[idx]));
        updateSkills();
    });
    el_characteristics.find('input[type="number"]').change(updateSkills);


    function updateAdversary() {
        el_group_size.val(adversary.size);
        el_soak.val(adversary.soak);
        el_wounds_per.val(adversary.wounds_per);
        el_strain_per.val(adversary.strain_per);
        buildTrack('wounds');
        buildTrack('strain');
        updateTrack('wounds');
        updateTrack('strain');
        updateSkills();
    }

    function buildTrack(selector, radio_class) {
        let el_track = el.find('.' + selector);
        if (el_track.length === 0)
            return;
        el_track.empty();
        const total = adversary[`${selector}_per`] * adversary.size;

        for (let i = 0; i <= total; i++) {
            let checkbox = $(`<input type="radio" class="${radio_class}">`);
            checkbox.click(function () {
                adversary[`${selector}`] = 1 + i;
                updateTrack(selector);
                updateSkills();
            });
            el_track.append(checkbox);

            if (i > 0 && i % adversary[`${selector}_per`] === 0)
                checkbox.addClass('kill').after('<label>');
        }
    }

    function updateTrack(selector) {
        let el_track = el.find('.' + selector);
        if (el_track.length === 0)
            return;
        el_track.children('input[type="radio"]').prop('checked', false).slice(0, adversary[`${selector}`]).prop('checked', true);
    }

    function updateSkills() {
        el_characteristics.children().each(function (index) {
            let el_attr = $(this);
            let char = el_attr.find('input[type="number"]').val();
            let el_rank = el_attr.find('div.attribute-dice[rank]');
            if (el_rank.length > 0) {
                el_rank.each(function () {
                    let rank = $(this).attr('rank');
                    $(this).html(global_buildDice(char, rank));
                })
            } else {
                let wounds = Math.max(0, adversary.wounds - 1);
                let lost_members = Math.floor(wounds / adversary.wounds_per);
                let rank = Math.max(adversary.size - 1 - lost_members, 0);
                el_attr.find('div.attribute-dice').html(global_buildDice(char, rank));
            }
        });
    }

    updateAdversary();

    adversaries_index++;
}


function adversaries_initButtons() {
    $('#add_minion').click(() => adversaries_addAdversary('miniongroup'));
    $('#add_rival').click(() => adversaries_addAdversary('rival'));
    $('#add_nemesis').click(() => adversaries_addAdversary('nemesis'));

    let template_select = $('select[name="adversary_template"]');
    for (let t in adversaries_common_stat_lines) {
        let opt = $('<option>').prop('value', t).text(t);
        template_select.append(opt);
    }
}


$(document).ready(function () {
    adversaries_initButtons();
});