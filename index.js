$(document).ready(function () {
    const tabs = $('.tab-content');
    $('li.tab').click(function () {
        let name = $(this).attr('data-tab');
        tabs.hide();
        $(`div.tab-content[data-tab="${name}"]`).show();
    });

    $(`li.tab[data-tab="home"]`).click();
});


let minion_group_index = 0;
const minion_common_stat_lines = {
    "Average": [2, 2, 2, 2, 2, 2],
    "Brawn": [3, 2, 2, 2, 2, 2],
    "Combat": [3, 3, 2, 2, 2, 2],
    "Pilot": [2, 3, 2, 2, 2, 2],
    "Stormtrooper": [3, 3, 2, 2, 3, 1],
};

function minion_addMinionGroup() {
    const group = {
        idx: minion_group_index,
        size: 1,
        soak: 1,
        wounds_per: 5,
        code: null,
        wounds: 0,
    };

    let internal = $('#templates div[name="miniongroup"]').html();
    group.code = $('<div name="miniongroup">').attr("group_index", minion_group_index).append(internal);
    $('#minions').append(group.code);

    const el = $(`div[group_index=${group.idx}]`);
    const el_group_size = el.find('[name="group_size"]');
    const el_soak = el.find('[name="soak"]');
    const el_wounds_per = el.find('[name="wounds_per"]');
    const el_template = el.find('[name="minion_template"]');
    const el_wounds = el.find('.wounds');
    const el_characteristics = el.find('.characteristics');

    el.find('[name="delete"]').click(function () {
        el.remove();
    });

    el_group_size.change(function () {
        group.size = $(this).val();
        updateGroup();
    });
    el_soak.change(function () {
        group.soak = $(this).val();
        updateGroup();
    });
    el_wounds_per.change(function () {
        group.wounds_per = $(this).val();
        updateGroup();
    });
    el_template.change(function () {
        let array = minion_common_stat_lines[$(this).val()];
        el_characteristics.find('input[type="number"]').each((idx, element) => $(element).val(array[idx]));
        updateSkills();
    });
    el_characteristics.find('input[type="number"]').change(updateSkills);


    function updateGroup() {
        el_group_size.val(group.size);
        el_soak.val(group.soak);
        el_wounds_per.val(group.wounds_per);
        buildWounds();
        updateWounds();
        updateSkills();
    }

    function buildWounds() {
        el_wounds.empty();
        const total = group.wounds_per * group.size;

        for (let i = 0; i <= total; i++) {
            let checkbox = $(`<input type="radio" class="wound">`);
            checkbox.click(function () {
                group.wounds = 1 + i;
                updateWounds();
                updateSkills();
            });
            el_wounds.append(checkbox);

            if (i > 0 && i % group.wounds_per === 0)
                checkbox.addClass('kill').after('<label>');
        }
    }

    function updateWounds() {
        el_wounds.children('input[type="radio"]').prop('checked', false).slice(0, group.wounds).prop('checked', true);
    }

    function updateSkills() {
        el_characteristics.children().each(function (index) {
            let el_attr = $(this);
            let wounds = Math.max(0, group.wounds - 1);
            let lost_members = Math.floor(wounds / group.wounds_per);
            let char = el_attr.find('input[type="number"]').val();
            let rank = Math.max(group.size - 1 - lost_members, 0);
            let dice = Math.max(char, rank);
            let upgrades = Math.min(char, rank);
            let pool = $('#templates div[name="dice_y"]').html().repeat(Math.max(0, upgrades));
            pool += $('#templates div[name="dice_g"]').html().repeat(dice - upgrades);
            el_attr.find('div.attribute-dice').html(pool)
        });
    }

    updateGroup();

    minion_group_index++;
}


function minion_initButtons() {
    $('#add_minion').click(minion_addMinionGroup);
    let template_select = $('select[name="minion_template"]');
    for (let t in minion_common_stat_lines) {
        let opt = $('<option>').prop('value', t).text(t);
        template_select.append(opt);
    }
}


$(document).ready(function () {
    minion_initButtons();
});