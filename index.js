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
let vehicles_index = 0;

function vehicles_addVehicle(selector) {
    const vehicle = {
        idx: vehicles_index,
        size: 1,
        speed_max: 1,
        handling: 1,
        defense: [0, 0, 0, 0],
        armor: 1,
        hull_per: 10,
        strain_per: 10,
        code: null,
        speed: 0,
        hull: 0,
        strain: 0,
    };

    let internal = $(`#templates div[name="${selector}"]`).html();
    vehicle.code = $(`<div name="${selector}" class="stat-block">`).attr('group_index', vehicles_index).append(internal);
    $('#vehicles').append(vehicle.code);

    const el = $(`#vehicles div[group_index=${vehicle.idx}]`);
    const el_group_size = el.find('[name="group_size"]');
    const el_speed = el.find('[name="speed"]');
    const el_handling = el.find('[name="handling"]');
    const el_defense = el.find('[name="defense"]');
    const el_armor = el.find('[name="armor"]');
    const el_hull_per = el.find('[name="hull_per"]');
    const el_strain_per = el.find('[name="strain_per"]');

    el.find('[name="delete"]').click(function () {
        el.remove();
    });

    el_group_size.change(function () {
        vehicle.size = $(this).val();
        updateVehicle(true);
    });
    el_speed.change(function () {
        vehicle.speed_max = $(this).val();
        updateVehicle(true);
    });
    el_handling.change(function () {
        vehicle.handling = $(this).val();
        updateVehicle(false);
    });
    el_defense.each(function (idx) {
        $(this).change(function () {
            vehicle.defense[idx] = $(this).val();
            updateVehicle(false);
        })
    })
    el_armor.change(function () {
        vehicle.armor = $(this).val();
        updateVehicle(false);
    });
    el_hull_per.change(function () {
        vehicle.hull_per = $(this).val();
        updateVehicle(true);
    });
    el_strain_per.change(function () {
        vehicle.strain_per = $(this).val();
        updateVehicle(true);
    });

    function updateVehicle(rebuild_tracks) {
        el_group_size.val(vehicle.size);
        el_armor.val(vehicle.armor);
        el_speed.val(vehicle.speed_max);
        el_handling.val(vehicle.handling);
        el_defense.each(function(idx) {
            $(this).val(vehicle.defense[idx]);
        });
        el_hull_per.val(vehicle.hull_per);
        el_strain_per.val(vehicle.strain_per);
        if (rebuild_tracks) {
            buildSpeedTrack();
            buildTrack('hull', 'hull');
            buildTrack('strain', 'strain');
            updateTrack('speed');
            updateTrack('hull');
            updateTrack('strain');
        }
    }

    function buildTrack(selector, radio_class) {
        let el_track = el.find('.' + selector);
        if (el_track.length === 0)
            return;
        el_track.empty();
        const total = vehicle[`${selector}_per`] * vehicle.size;

        global_buildTrack(el_track, total, vehicle[`${selector}_per`], radio_class, 'kill', false, function (idx) {
            vehicle[`${selector}`] = 1 + idx;
            updateTrack(selector);
        })
    }

    function buildSpeedTrack() {
        let el_track = el.find('.speed');
        el_track.empty();
        global_buildTrack(el_track, vehicle.speed_max, vehicle.speed_max, 'speed', 'max-speed', true, function (idx) {
            vehicle.speed = 1 + idx;
            updateTrack('speed');
        })
    }

    function updateTrack(selector) {
        let el_track = el.find('.' + selector);
        if (el_track.length === 0)
            return;
        el_track.children('input[type="radio"]').prop('checked', false).slice(0, vehicle[`${selector}`]).prop('checked', true);
    }

    updateVehicle(true);

    vehicles_index++;
}


function vehicles_initButtons() {
    $('#add_vehicle').click(() => vehicles_addVehicle('vehicle'));
    $('#add_vehiclegroup').click(() => vehicles_addVehicle('vehiclegroup'));
}


$(document).ready(function () {
    vehicles_initButtons();
});