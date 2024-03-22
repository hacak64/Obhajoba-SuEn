// Globální proměnná pro uchování aktuální úrovně
let aktualniUroven = 0;
let penize = null;
let pouziti_kamos = true;
let pouziti_padenapade = true;
let pouziti_lidi = true;
let aktualniOtazkaData = null; // Globální proměnná pro uchování dat aktuální otázky
let otazky_moznosti = null;



document.addEventListener('DOMContentLoaded', function () {
    nactiOtazku(aktualniUroven);
    kamos();
    padenapade()
    lidi()
});

function nactiOtazku(uroven) {
    fetch('../../json/milionar/databaze.json')
        .then(response => response.json())
        .then(data => {
            // Kontrola, zda existuje daná úroveň a má definované otázky
            if (data.urovne && data.urovne[uroven] && data.urovne[uroven].otazky) {
                const otazky = data.urovne[uroven].otazky;
                if (otazky.length > 0) {
                    const otazkaData = otazky[Math.floor(Math.random() * otazky.length)];
                    aktualniOtazkaData = otazkaData; // Aktualizujeme globální proměnnou

                    // Reset stavu odpovědí
                    for (let i = 0; i < 4; i++) {
                        const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
                        if (odpovedElem) {
                            odpovedElem.style.opacity = '1'; // Obnovíme plnou viditelnost
                            odpovedElem.style.pointerEvents = 'auto'; // Znovu povolíme klikání
                        }
                    }

                    // Nastavit text otázky a odpovědí
                    document.getElementById('text_otazky').innerText = otazkaData.otazka;
                    for (let i = 0; i < otazkaData.moznosti.length; i++) {
                        const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
                        odpovedElem.innerText = otazkaData.moznosti[i];
                        odpovedElem.onclick = () => {
                            if (otazkaData.moznosti[i] === otazkaData.spravna_odpoved) {
                                if (aktualniUroven < data.urovne.length - 1) {
                                    console.log(otazkaData.spravna_odpoved)
                                    aktualniUroven++;
                                    nactiOtazku(aktualniUroven);
                                } else {
                                    alert("Gratulujeme, vyhráli jste!");
                                }
                            } else {
                                alert("Bohužel, to nebyla správná odpověď. Hra skončila.");
                                ukoncitHru();
                            }
                        };
                    }
                } else {
                    console.error('Neexistují žádné otázky pro úroveň ' + (uroven + 1));
                }
            } else {
                console.error('Úroveň ' + (uroven + 1) + ' neexistuje v databázi.');
            }
        })
        .catch(error => console.error('Chyba při načítání databáze:', error));
}



function kamos() {
    document.querySelector('.kamos').addEventListener('click', function () {
        if (pouziti_kamos) { // Zkontrolujeme, jestli je použití kámoše dostupné
            if (aktualniOtazkaData) { // Zkontrolujeme, jestli aktualniOtazkaData existuje
                let zvolenaOdpoved;
                if (Math.random() <= 0.9) { // 90% šance na správnou odpověď
                    zvolenaOdpoved = aktualniOtazkaData.spravna_odpoved;
                } else { // 10% šance na nesprávnou odpověď
                    // Získáme nesprávné odpovědi
                    let nespravneOdpovedi = aktualniOtazkaData.moznosti.filter(odpoved => odpoved !== aktualniOtazkaData.spravna_odpoved);
                    // Náhodně vybereme jednu z nesprávných odpovědí
                    zvolenaOdpoved = nespravneOdpovedi[Math.floor(Math.random() * nespravneOdpovedi.length)];
                }
                alert('Správná odpověď je: ' + zvolenaOdpoved);
                pouziti_kamos = false; // Nastavíme pouziti_kamos na false, čímž zakážeme další použití
                // Vizuální deaktivace tlačítka
                document.querySelector('.kamos').style.opacity = '0.5';
                document.querySelector('.kamos').style.pointerEvents = 'none'; // Zakáže klikání na tlačítko
            } else {
                console.error('Nebyla načtena žádná otázka.');
            }
        } else {
            alert('Nápověda kámoše již byla použita a není dostupná.');
        }
    });
}

function padenapade() {
    document.querySelector('.padenapade').addEventListener('click', function () {
        if (pouziti_padenapade) { // Zkontrolujeme, jestli je použití možné
            if (aktualniOtazkaData) {
                pouziti_padenapade = false; // Zakážeme další použití

                // Získáme index správné odpovědi
                const spravnaOdpovedIndex = aktualniOtazkaData.moznosti.indexOf(aktualniOtazkaData.spravna_odpoved);
                let spatneIndexy = [];

                // Najdeme indexy špatných odpovědí
                for (let i = 0; i < aktualniOtazkaData.moznosti.length; i++) {
                    if (i !== spravnaOdpovedIndex) {
                        spatneIndexy.push(i);
                    }
                }

                // Náhodně vybereme jeden špatný index k zobrazení a dva k zatmavení
                spatneIndexy = spatneIndexy.filter(index => index !== spravnaOdpovedIndex);
                const zatmaveneIndexy = spatneIndexy.length > 2 ? spatneIndexy.sort(() => .5 - Math.random()).slice(0, 2) : spatneIndexy;

                // Projdeme všechny možnosti a zatmíme dva špatné odpovědi
                zatmaveneIndexy.forEach(index => {
                    const elementOdpovedi = document.getElementById('text_odpovedi' + String.fromCharCode(65 + index));
                    elementOdpovedi.style.opacity = '0.5';
                    elementOdpovedi.style.pointerEvents = 'none'; // Zabráníme klikání na zatmavené odpovědi
                });

                // Vizuální deaktivace tlačítka
                document.querySelector('.padenapade').style.opacity = '0.5';
                document.querySelector('.padenapade').style.pointerEvents = 'none';
            } else {
                console.error('Nebyla načtena žádná otázka.');
            }
        } else {
            alert('Nápověda již byla použita a není dostupná.');
        }
    });
}

function lidi() {
    let procenta = [];
    for 
    document.querySelector('.lidi').addEventListener('click', function () {
        if (pouziti_lidi) { // Zkontrolujeme, jestli je použití kámoše dostupné
            if (aktualniOtazkaData) { // Zkontrolujeme, jestli aktualniOtazkaData existuje
                var spravnaOdpoved = aktualniOtazkaData.spravna_odpoved;
                alert('Správná odpověď je: ' + spravnaOdpoved);
                pouziti_lidi = false; // Nastavíme pouziti_kamos na false, čímž zakážeme další použití
                // Zde přidáme logiku pro vizuální deaktivaci tlačítka
                document.querySelector('.lidi').style.opacity = '0.5'; // Vizualizace deaktivace
                document.querySelector('.lidi').style.pointerEvents = 'none'; // Zakáže klikání na tlačítko
            } else {
                console.error('Nebyla načtena žádná otázka.');
            }
        } else {
            alert('Nápověda kámoše již byla použita a není dostupná.');
        }
    });
}

function ukoncitHru() {
    // Zde můžete přidat jakoukoliv logiku pro ukončení hry
    // Například: Skrytí herní oblasti, zobrazení zprávy o konečném skóre, atd.
    alert("Hra skončila. Děkujeme za hraní!");

    // Deaktivace všech tlačítek odpovědí
    for (let i = 0; i < 4; i++) { // Předpokládáme, že máte 4 možnosti odpovědí
        const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
        if (odpovedElem) {
            odpovedElem.style.pointerEvents = 'none';
            odpovedElem.style.opacity = '0.5';
        }
    }

    // Volitelně můžete přidat tlačítko pro restart hry nebo přesměrovat uživatele na úvodní stránku
    // Například:
    // document.location.reload(); // Pro načtení stránky znovu
    // nebo přidání tlačítka pro restart a jeho obsluhu
}

