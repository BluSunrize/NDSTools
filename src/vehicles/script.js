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

        global_buildTrack(el_track, total, vehicle[`${selector}_per`], radio_class, 'kill', function (idx) {
            vehicle[`${selector}`] = 1 + idx;
            updateTrack(selector);
        })
    }

    function buildSpeedTrack() {
        let el_track = el.find('.speed');
        el_track.empty();
        global_buildTrack(el_track, vehicle.speed_max, vehicle.speed_max, 'speed', 'max-speed', function (idx) {
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