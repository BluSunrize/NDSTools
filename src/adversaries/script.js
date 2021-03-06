let adversaries_index = 0;
const adversaries_common_stat_lines = {
    "Average": [2, 2, 2, 2, 2, 2],
    "Brawn": [3, 2, 2, 2, 2, 2],
    "Combat": [3, 3, 2, 2, 2, 2],
    "Pilot": [2, 3, 2, 2, 2, 2],
    "Stormtrooper": [3, 3, 2, 2, 3, 1],
};

function adversaries_addAdversary(selector, clone) {
    const adversary = {
        idx: adversaries_index,
        size: clone?clone.size:1,
        soak: clone?clone.soak:1,
        wounds_per: clone?clone.wounds_per:5,
        strain_per: clone?clone.strain_per:5,
        code: null,
        wounds: clone?clone.wounds:0,
        strain: clone?clone.strain:0,
    };

    let internal = $(`#templates div[name="${selector}"]`).html();
    adversary.code = $(`<div name="${selector}" class="stat-block">`).attr('group_index', adversaries_index).append(internal);
    $('#adversaries').append(adversary.code);

    const el = $(`#adversaries div[group_index=${adversary.idx}]`);
    const el_group_size = el.find('[name="group_size"]');
    const el_soak = el.find('[name="soak"]');
    const el_wounds_per = el.find('[name="wounds_per"]');
    const el_strain_per = el.find('[name="strain_per"]');
    const el_template = el.find('[name="adversary_template"]');
    const el_characteristics = el.find('.characteristics');

    el.find('[name="delete"]').click(function () {
        el.remove();
    });
    el.find('[name="clone"]').click(function () {
        adversaries_addAdversary(selector, adversary);
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
        buildTrack('wounds', 'wound');
        buildTrack('strain', 'strain');
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

        global_buildTrack(el_track, total, adversary[`${selector}_per`], radio_class, 'kill', false, function (idx) {
            adversary[`${selector}`] = 1 + idx;
            updateTrack(selector);
            updateSkills();
        })
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