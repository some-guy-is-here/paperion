// ==UserScript==
// @name         paper2hack
// @description  Modding utility/menu for paper.io
// @version      0.1.12
// @author       its-pablo
// @match        https://paper-io.com
// @match        https://paper-io.com/teams/
// @match        https://paper-io.com/battleroyale/
// @match        https://paperanimals.io
// @match        https://amogus.io
// @require      https://cdn.jsdelivr.net/npm/tweakpane@3.1.4/dist/tweakpane.min.js
// @icon         https://paper-io.com/favicon.ico
// @grant        none
// ==/UserScript==
adblock = () => false //this detects if adblock is on, we make it always return false so that the impostor skin loads
window.addEventListener('load', function () {
    "use strict";
    const VERSION = "beta 0.1.10"
    let newApi
    switch (location.href) { //remember: they must have trailing slash!!
        case "https://paper-io.com/battleroyale/":
            newApi = true
            break
        case "https://paper-io.com/teams/":
            newApi = true
            break
        case "https://paperanimals.io/":
            newApi = true
            break
        case "https://amogus.io/":
            newApi = true
            break
        case "https://paper-io.com/":
            newApi = false
            break
        default:
            if (!!paper2) {
                newApi = false
            } else if (!!paperio2api) {
                newApi = true
            } else {
                //uhh idk
            }
    }
    if (newApi === true) {
        console.log("USING NEW API")
    } else if (newApi === false) {
        console.log("USING OLD API")
    }
    window.api = {
        config: function () {
            if (newApi) {
                return paperio2api.config
            } else {
                return paper2.currentConfig
            }
        },
        game: function () {
            if (newApi) {
                return paperio2api.game
            } else {
                return paper2.game
            }
        }
    }
    let ETC = {
        "reset": function () { alert("Cannot be done with tweakpane!\nTry clearing site data.") },
        "zoomScroll": false,
        "debugging": false,
        "speed": api.config().unitSpeed,
        "skin": "",
        "skinUnlock": () => {
            shop.btnsData.forEach(item => {
                if (item.unlockName) {
                    unlockSkin(item.unlockName)
                }
            })
        },
        "_skins": [],
        "pause": function () {
            if (api.config().unitSpeed !== 0) {
                api.config().unitSpeed = 0
            } else {
                api.config().unitSpeed = 90
            }
        },
        "despawnOthers": function () {
            api.game().units = [api.game().player]
            /*api.game().units.forEach(item => {
                if(item === api.game().player){
                    //dont despawn!
                } else {
                    item.schemes.manager.Schemes[0].prototype.kill()
                }
            })*/
        },
        "help": function () {
            alert(`
            paper2hack ${VERSION} written by its-pablo and contributors.\n\n
            https://github.com/its-pablo/paper2hack \n
            Issues? https://github.com/its-pablo/paper2hack/issues

            If you encounter any issues with paper2hack, refresh the page, hit the 'Reset' button, or uninstall/reinstall the mod. As a last resort, try clearing site data.
        `)
        },
        "keysList": function () {
            alert(`
            None for the moment!\n
            Stay tuned...
        `)
        },
        "openGithub": function () {
            window.open("https://github.com/its-pablo/paper2hack", '_blank').focus();
        }
    }
    if (!newApi) {
        shop?.btnsData.forEach(i => {
            if (i.useId === Cookies.get('skin')) {
                ETC.skin = i.name
            }
        })
        shop?.btnsData.forEach(i => { ETC._skins.push(i.name) })
    }
    function scrollE(e) {
        if (e.deltaY > 0) {
            if (paper2.currentConfig.maxScale > 0.45) {
                paper2.currentConfig.maxScale -= 0.2
            }
        } else if (e.deltaY < 0) {
            if (paper2.currentConfig.maxScale < 4.5) {
                paper2.currentConfig.maxScale += 0.2
            }
        }
    }

    let pane = new Tweakpane.Pane({ title: "paper2hack" })
    let mods = pane.addFolder({ title: "Mods" })
    mods.addInput(ETC, "speed", { min: 5, max: 500, count: 5 })
    mods.addInput(ETC, "skin", {
        label: "Skin (requires refresh)",
        options: {
            "Coming soon (TODO)": ""
        }
    }).on("change", ev => {
        let id;
        shop?.btnsData.forEach(i => {
            if (i.name === ev.value) {
                id = i.useId
            }
        })
        Cookies.set('skin', id)
    })
    mods.addInput(ETC, "debugging", { label: "Debug" }).on("change", ev => {
        api.game().debug = ev.value
        api.game().debugGraph = ev.value
    })
    mods.addButton({ title: "Pause/Play" }).on("click", ETC.pause)
    if (!newApi) {
        mods.addButton({ title: "Unlock skins", }).on("click", ETC.skinUnlock)
    }
    mods.addButton({ title: "Despawn others" }).on("click", ETC.despawnOthers)
    mods.addInput(ETC, "zoomScroll", { label: "Scroll to Zoom" }).on("change", ev => {
        if (ev.value === true) {
            window.addEventListener("wheel", scrollE)
        } else {
            window.removeEventListener("wheel", scrollE)
        }
    })
    mods.addButton({ title: "Reset" }).on('click', ETC.reset)
    let about = pane.addFolder({ title: "About", expanded: false })
    about.addButton({ title: "Help" })
    about.addButton({ title: "Keyboard Shortcuts" }).on("click", ETC.keysList)
    about.addButton({ title: "GitHub" }).on("click", ETC.openGithub)
    /*Last things*/
    if (!localStorage.getItem('paper2hack')) {
        this.localStorage.setItem('paper2hack', JSON.stringify({}))
    }
    pane.importPreset(JSON.parse(localStorage.getItem("paper2hack")))
    pane.on("change", e => {
        localStorage.setItem("paper2hack", JSON.stringify(pane.exportPreset()))
    })
}, false);
