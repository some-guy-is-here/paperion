// ==UserScript==
// @name         paper2hack
// @description  Modding utility/menu for paper.io
// @version      0.1.11
// @author       its-pablo
// @match        https://paper-io.com
// @match        https://paper-io.com/teams/
// @match        https://paper-io.com/battleroyale/
// @match        https://paperanimals.io
// @match        https://amogus.io
// @require      https://cdn.jsdelivr.net/npm/lil-gui
// @icon         https://paper-io.com/favicon.ico
// @grant        none
// ==/UserScript==
adblock = () => false //this detects if adblock is on, we make it always return false so that the impostor skin loads
window.addEventListener('load', function () {
  "use strict";
  const VERSION = "beta 0.1.10"
  let newApi
  switch(location.href) {
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
        if(!!paper2) {
            newApi = false
        } else if(!!paperio2api) {
            newApi = true
        } else {
            //uhh idk
        }
  }
  if(newApi === true){
    console.log("USING NEW API")
  } else if(newApi === false){
    console.log("USING OLD API")
  }
  window.api = {
      config: function(){
          if(newApi){
              return paperio2api.config
          } else {
              return paper2.currentConfig
          }
      },
      game: function(){
          if(newApi){
              return paperio2api.game
          } else {
              return paper2.game
          }
      }
  }
  let ETC = {
      "Reset to Default": function(){gui.reset()},
      "Scroll to zoom": false,
      "Debug": false,
      "Speed": api.config().unitSpeed,
      "Skin (requires refresh)": "",
      "Unlock all Skins": () => {
        shop.btnsData.forEach(item => {
            if (item.unlockName) {
                unlockSkin(item.unlockName)
            }
        })
      },
      "_skins": [],
      "Pause/Play": function(){
        if(api.config().unitSpeed !== 0){
            api.config().unitSpeed = 0
        } else {
            api.config().unitSpeed = 90
        }
      },
      "Despawn players": function(){api.game().units = [api.game().player]},
      "Help": function(){
        alert(`
            paper2hack ${VERSION} written by its-pablo and contributors.\n\n
            https://github.com/its-pablo/paper2hack \n
            Issues? https://github.com/its-pablo/paper2hack/issues

            If you encounter any issues with paper2hack, refresh the page, hit the 'Reset' button, or uninstall/reinstall the mod. As a last resort, try clearing site data.
        `)
      },
      "Keyboard Shortcuts": function(){
        alert(`
            None for the moment!\n
            Stay tuned...
        `)
      },
      "Github": function(){
        window.open("https://github.com/its-pablo/paper2hack", '_blank').focus();
      }
  }
  shop.btnsData.forEach(i => {
      if(i.useId === Cookies.get('skin')){
          ETC["Skin (requires refresh)"] = i.name
      }
  })
  shop.btnsData.forEach(i => {ETC._skins.push(i.name)})
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
  let GUI = lil.GUI
  let gui = new GUI({title: "paper2hack"})
  let mods = gui.addFolder("Mods")
  mods.open() //just in case it's closed
  mods.add(ETC, "Speed", 1, 500, 5)
  mods.add(ETC, "Skin (requires refresh)", ETC._skins).onChange(v => {
      let id;
      shop.btnsData.forEach(i => {
          if(i.name === v){
              id = i.useId
          }
      })
      Cookies.set('skin', id)
  })
  mods.add(ETC, "Debug").onFinishChange(value => {
    api.game().debug = value
    api.game().debugGraph = value
  })
  mods.add(ETC, "Pause/Play")
  mods.add(ETC, "Unlock all Skins")
  mods.add(ETC, "Despawn players")
  mods.add(ETC, "Scroll to zoom").onFinishChange(value => {
      if(value === true){
          window.addEventListener("wheel", scrollE)
      } else {
          window.removeEventListener("wheel", scrollE)
      }
  })
  mods.add(ETC, "Reset to Default")
  let about = gui.addFolder("About")
  about.close()
  about.add(ETC, "Help")
  about.add(ETC, "Keyboard Shortcuts")
  about.add(ETC, "Github")
  /*Last things*/
  if(!localStorage.getItem('paper2hack')){
    this.localStorage.setItem('paper2hack', JSON.stringify({}))
  }
  gui.load(JSON.parse(localStorage.getItem("paper2hack")))
  gui.onFinishChange(e => {
      localStorage.setItem("paper2hack", JSON.stringify(gui.save()))
  })
}, false);
