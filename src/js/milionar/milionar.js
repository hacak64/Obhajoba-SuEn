// Globální proměnná pro uchování aktuální úrovně
let aktualniUroven = 0;
let pouziti_kamos = true;
let pouziti_padenapade = true;
let pouziti_lidi = true;
let aktualniOtazkaData = null; // Globální proměnná pro uchování dat aktuální otázky

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
                    aktualniOtazkaData = otazkaData; // Aktualizujeme globální proměnnou

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

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.kamos').addEventListener('click', function() {
        if (aktualniOtazkaData) { // Zkontrolujeme, jestli aktualniOtazkaData existuje
            var spravnaOdpoved = aktualniOtazkaData.spravna_odpoved;
            alert('Správná odpověď je: ' + spravnaOdpoved);
        } else {
            console.error('Nebyla načtena žádná otázka.');
        }
    });
});
