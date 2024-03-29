// Globální proměnná pro uchování aktuální úrovně
let aktualniUroven = 1;
let penize = 100;
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

function nastavitAktualniHodnoty(data) {
    if (data.urovne && data.urovne[aktualniUroven - 1]) {
        const urovenData = data.urovne[aktualniUroven - 1];

        // Aktualizace peněz podle aktuální úrovně
        penize = urovenData.penize;

        // Formátování peněz s mezerami po třech místech
        const formatovanePenize = penize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        // Získáme element, kam chceme vložit text
        const splnenoTextElement = document.getElementById('splneno_text');

        // Zkontrolujeme, jestli element existuje
        if (splnenoTextElement) {
            // Nastavíme text elementu na formát "X/Y Z $", kde X je aktuální úroveň, Y je celkový počet úrovní a Z jsou formátované peníze
            splnenoTextElement.innerText = `${aktualniUroven}/${data.urovne.length} ${formatovanePenize}$`;
        } else {
            console.error('Element pro zobrazení stavu hry nebyl nalezen.');
        }
    } else {
        console.error('Úroveň neexistuje v databázi nebo chyba ve struktuře dat.');
    }
}



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
                    nastavitAktualniHodnoty(data);

                    // Reset barvy textu a stavu odpovědí
                    for (let i = 0; i < 4; i++) {
                        const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
                        if (odpovedElem) {
                            odpovedElem.style.color = 'white'; // Reset barvy textu na bílou
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
                                    aktualniUroven++;
                                    nactiOtazku(aktualniUroven);
                                } else {
                                    window.location.href = "vyhra_hry.html"
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
                    let nespravneOdpovedi = aktualniOtazkaData.moznosti.filter(odpoved => odpoved !== aktualniOtazkaData.spravna_odpoved);
                    zvolenaOdpoved = nespravneOdpovedi[Math.floor(Math.random() * nespravneOdpovedi.length)];
                }

                // Najdeme index správné odpovědi
                const spravnaOdpovedIndex = aktualniOtazkaData.moznosti.indexOf(zvolenaOdpoved);

                // Změníme barvu textu správné odpovědi na zelenou
                const spravnaOdpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + spravnaOdpovedIndex));
                if (spravnaOdpovedElem) {
                    spravnaOdpovedElem.style.color = 'green'; // Změna barvy textu na zelenou
                }
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

                // Projdeme všechny možnosti a zatmavíme dvě špatné odpovědi
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
    document.querySelector('.lidi').addEventListener('click', function () {
        if (!pouziti_lidi || !aktualniOtazkaData) {
            alert('Nápověda již byla použita nebo neexistuje žádná otázka.');
            return;
        }
        pouziti_lidi = false;

        // Generujeme náhodná procenta a ujistíme se, že součet je 100
        let procenta = [];
        for (let i = 0; i < 3; i++) {
            let cislo = Math.floor(Math.random() * 35) + 1; // Zajistíme, že každá hodnota bude alespoň 1% a maximálně 25%
            procenta.push(cislo);
        }
        let soucetProcent = procenta.reduce((a, b) => a + b, 0);
        procenta.push(100 - soucetProcent); // Zbývající hodnota pro správnou odpověď

        // Náhodně zamícháme procenta tak, aby nejvyšší hodnota nebyla vždy na stejném místě
        procenta.sort(() => Math.random() - 0.5);

        // Nyní přiřadíme nejvyšší hodnotu k správné odpovědi
        const indexSpravneOdpovedi = aktualniOtazkaData.moznosti.indexOf(aktualniOtazkaData.spravna_odpoved);
        const nejvyssiHodnota = Math.max(...procenta);
        procenta[procenta.indexOf(nejvyssiHodnota)] = procenta[indexSpravneOdpovedi];
        procenta[indexSpravneOdpovedi] = nejvyssiHodnota;

        // Zobrazíme procenta vedle textů odpovědí
        for (let i = 0; i < 4; i++) {
            const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
            if (odpovedElem) {
                odpovedElem.textContent += ' - ' + procenta[i] + '%';
            }
        }

        // Deaktivujeme tlačítko a nastavíme jeho styl na "použito"
        document.querySelector('.lidi').style.opacity = '0.5';
        document.querySelector('.lidi').style.pointerEvents = 'none';
    });
}


function ukoncitHru() {
    // Zde můžete přidat jakoukoliv logiku pro ukončení hry
    // Například: Skrytí herní oblasti, zobrazení zprávy o konečném skóre, atd.

    // Deaktivace všech tlačítek odpovědí
    for (let i = 0; i < 4; i++) { // Předpokládáme, že máte 4 možnosti odpovědí
        const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
        if (odpovedElem) {
            odpovedElem.style.pointerEvents = 'none';
            odpovedElem.style.opacity = '0.5';
        }
    }

    // Přesměrování na stránku 'konec_hry.html'
    window.location.href = 'konec_hry.html?score=' + aktualniUroven + '&money=' + penize

}

