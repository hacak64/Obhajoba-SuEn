// Globální proměnná pro uchování aktuální úrovně
let aktualniUroven = 0;

document.addEventListener('DOMContentLoaded', function () {
    nactiOtazku(aktualniUroven);
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
                                    alert("Gratulujeme, vyhráli jste!");
                                }
                            } else {
                                alert("Bohužel, to nebyla správná odpověď.");
                                // Zde můžete přidat logiku pro ukončení hry nebo restart
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

