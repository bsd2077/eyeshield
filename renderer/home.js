let init_lan

function Checked() {
    if ($(".scales").is(':checked')) {
        window.electronAPI.enable_auto_boot()

    } else {
        window.electronAPI.disable_auto_boot()

    }
};

async function load() {
    init_lan = await window.electronAPI.get_init_lan()

    let init_auto_boot = await window.electronAPI.get_init_auto_boot()

    if (init_auto_boot) {
        $(".scales").prop("checked", true);
    } else {
        $(".scales").prop("checked", false);
    }
    let init_minute = await window.electronAPI.get_init_minute()

    $(".input_minutes").val(init_minute)

    $(".labe").text(init_lan.auto_boot)

}

$(".scales").on("click", Checked);
window.addEventListener("load", load)
window.electronAPI.update_tip((value) => {
    $(".tip").html("It's time to rest")
})

function minimize(e) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSpanElement || e.target instanceof HTMLLabelElement || e.target.className === "duration_title" || e.target instanceof HTMLButtonElement || e.target.className === "lan_setting" || e.target.className === "div_setting") {
    } else {
        let minutes = $(".input_minutes").val()

        if (minutes) {
            if (Number(minutes) > 0) {
                if (Number.isInteger(Number(minutes))) {
                    window.electronAPI.duration(Number(minutes))
                    window.electronAPI.minimize()
                    window.electronAPI.write_minute(Number(minutes))
                    $(".div_setting").hide();
                    $(".set").show()
                    $(".tip").html("Sleeping...")

                } else {
                    alert(`${init_lan.tip_integer}`)
                }

            } else {
                alert(`${init_lan.format_error}`)
            }

        } else {
            alert(`${init_lan.format_error}`)
            /*window.electronAPI.duration(7)
            window.electronAPI.minimize()
            $(".div_setting").hide();$(".set").show()
            $(".tip").html("Sleeping...")*/
        }
    }

}

window.addEventListener("click", minimize)
$(".conform_set").on("click", function () {
    let minutes = $(".input_minutes").val()

    if (minutes) {
        if (Number(minutes) > 0) {
            if (Number.isInteger(Number(minutes))) {
                $(".tip").html("Sleeping...")
                $(".div_setting").hide();
                $(".set").show()

            } else {
                alert(`${init_lan.tip_integer}`)
            }

        } else {
            alert(`${init_lan.format_error}`)
        }

    } else {
        alert(`${init_lan.format_error}`)
    }

    let lan = $('input:radio:checked').val()
    if (lan) {
        window.electronAPI.write_locale(String(lan))
        setTimeout(() => {
            window.electronAPI.restart()

        })
        
    }

})
$(".set").on("click", function () {
    $(".tip").html("")

    $(this).hide();
    $(".div_setting").show()

})
