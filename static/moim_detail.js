function showPPL() {
    const listOfppl = document.createElement("div");
    listOfppl.className = "listOfppl";

    const turnoff = document.createElement("div");
    turnoff.className = "turnOff";
    turnoff.innerHTML = "×";
    listOfppl.append(turnoff);

    const body = document.querySelector("body");
    body.append(listOfppl);

    const button = document.querySelector("button");
    const setting = document.querySelector(".setting");
    const apply = document.querySelector(".apply");
    button.style.cssText = "pointer-events: none;"
    setting.style.cssText = "pointer-events: none;"
    apply.style.cssText = "pointer-events: none;"

    listOfppl.onclick = () => {
        listOfppl.remove();
        button.style.cssText = "pointer-events: all;"
        setting.style.cssText = "pointer-events: all;"
        apply.style.cssText = "pointer-events: all;"
    }
}