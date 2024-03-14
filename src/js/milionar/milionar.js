// Globální proměnná pro uchování aktuální úrovně
let aktualniUroven = 0;

document.addEventListener('DOMContentLoaded', function () {
    nactiOtazku(aktualniUroven);
});

function nactiOtazku(uroven) {
    fetch('../../json/milionar/databaze.json')
        .then(response => response.json())
        .then(data => {
            const otazkaData = data.urovne[uroven].otazky[Math.floor(Math.random() * data.urovne[uroven].otazky.length)];

            // Nastavit text otázky a odpovědí
            document.getElementById('text_otazky').innerText = otazkaData.otazka;
            for (let i = 0; i < otazkaData.moznosti.length; i++) {
                document.getElementById('text_odpovedi' + String.fromCharCode(65 + i)).innerText = otazkaData.moznosti[i];
                document.getElementById('text_odpovedi' + String.fromCharCode(65 + i)).onclick = function() {
                    if (otazkaData.moznosti[i] === otazkaData.spravna_odpoved) {
                        if (aktualniUroven < 14) { // 14 protože indexujeme od 0
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
        })
        .catch(error => console.error('Chyba při načítání databáze:', error));
}
