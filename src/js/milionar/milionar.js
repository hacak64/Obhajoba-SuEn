let aktualniUroven = 1;
let pouziti_kamos = true;
let pouziti_padenapade = true;
let pouziti_lidi = true;

document.addEventListener('DOMContentLoaded', function () {
    nactiOtazku(aktualniUroven);
    kamos();
    padenapade()
    lidi()
});
function nastavitAktualniHodnoty(data) {
    if (data.urovne && data.urovne[aktualniUroven - 1]) {
        const urovenData = data.urovne[aktualniUroven - 1];

        penize = urovenData.penize;

        const formatovanePenize = penize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        const splnenoTextElement = document.getElementById('splneno_text');


        if (splnenoTextElement) {
   
            splnenoTextElement.innerText = `${aktualniUroven}/${data.urovne.length} ${formatovanePenize}$`;
        } else {
            console.error('Element pro zobrazení stavu hry nebyl nalezen.');
        }
    } else {
        console.error('Úroveň neexistuje v databázi nebo chyba ve struktuře dat.');
    }
}

function vyhodnotitOdpoved(otazkaData, indexOdpovedi, data) {
    const vybranaOdpoved = otazkaData.moznosti[indexOdpovedi];
    if (vybranaOdpoved === otazkaData.spravna_odpoved) {
        aktualniUroven++;
        if (aktualniUroven <= data.urovne.length) {
            nactiOtazku(aktualniUroven);
        } else {
           
            window.location.href = "vyhra_hry.html"; 
        }
    } else {
        ukoncitHru(); 
    }
}



function nastavitOtazkyAOdpovedi(otazkaData, data) {
    document.getElementById('text_otazky').innerText = otazkaData.otazka;

    for (let i = 0; i < otazkaData.moznosti.length; i++) {
        const odpovedTextElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
        const odpovedObrazekElem = document.getElementById('odpoved' + String.fromCharCode(65 + i) + '_tvar'); 

        odpovedTextElem.innerText = otazkaData.moznosti[i];
        odpovedTextElem.onclick = () => vyhodnotitOdpoved(otazkaData, i, data);

        if (odpovedObrazekElem) {
            odpovedObrazekElem.style.cursor = 'pointer';
            odpovedObrazekElem.onclick = () => vyhodnotitOdpoved(otazkaData, i, data);
        }
    }
}


function nactiOtazku(uroven) {
    fetch('../../json/milionar/databaze.json')
        .then(response => response.json())
        .then(data => {
           
            if (data.urovne && data.urovne[uroven - 1] && data.urovne[uroven - 1].otazky) {
                const otazky = data.urovne[uroven - 1].otazky;            
                if (otazky.length > 0) {
                    const otazkaData = otazky[Math.floor(Math.random() * otazky.length)];
                    aktualniOtazkaData = otazkaData; 
                    nastavitAktualniHodnoty(data);
                    nastavitOtazkyAOdpovedi(otazkaData, data);
                    
                    for (let i = 0; i < 4; i++) {
                        const odpovedElemText = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
                        const odpovedElemObrazek = document.getElementById('odpoved' + String.fromCharCode(65 + i) + '_tvar');

                        if (odpovedElemText) {
                            odpovedElemText.style.opacity = '1'; 
                            odpovedElemText.style.pointerEvents = 'auto'; 
                            odpovedElemText.style.color = 'white'; 
                        }

                        if (odpovedElemObrazek) {
                            odpovedElemObrazek.style.opacity = '1';
                            odpovedElemObrazek.style.pointerEvents = 'auto'; 
                        }
                    }

                    document.getElementById('text_otazky').innerText = otazkaData.otazka;
                    for (let i = 0; i < otazkaData.moznosti.length; i++) {
                        const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
                        odpovedElem.innerText = otazkaData.moznosti[i];
                        odpovedElem.onclick = () => {
                            if (otazkaData.moznosti[i] === otazkaData.spravna_odpoved) {
                                if (aktualniUroven < data.urovne.length) {
                                    aktualniUroven++;
                                    nactiOtazku(aktualniUroven);
                                } else {
                                    window.location.href = "vyhra_hry.html"
                                }
                            } else {
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
        if (pouziti_kamos) {
            if (aktualniOtazkaData) {
                let zvolenaOdpoved;
                if (Math.random() <= 0.9) { 
                    zvolenaOdpoved = aktualniOtazkaData.spravna_odpoved;
                } else { 
                    let nespravneOdpovedi = aktualniOtazkaData.moznosti.filter(odpoved => odpoved !== aktualniOtazkaData.spravna_odpoved);
                    zvolenaOdpoved = nespravneOdpovedi[Math.floor(Math.random() * nespravneOdpovedi.length)];
                }

                const spravnaOdpovedIndex = aktualniOtazkaData.moznosti.indexOf(zvolenaOdpoved);

                const spravnaOdpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + spravnaOdpovedIndex));
                if (spravnaOdpovedElem) {
                    spravnaOdpovedElem.style.color = 'green'; 
                }
                pouziti_kamos = false; 

                document.querySelector('.kamos').style.opacity = '0.5';
                document.querySelector('.kamos').style.pointerEvents = 'none'; 
                console.error('Nebyla načtena žádná otázka.');
            }
        } else {
            alert('Nápověda kámoše již byla použita a není dostupná.');
        }
    });
}


function padenapade() {
    document.querySelector('.padenapade').addEventListener('click', function () {
        if (pouziti_padenapade) { 
            if (aktualniOtazkaData) {
                pouziti_padenapade = false; 

                const spravnaOdpovedIndex = aktualniOtazkaData.moznosti.indexOf(aktualniOtazkaData.spravna_odpoved);
                let spatneIndexy = [];

                for (let i = 0; i < aktualniOtazkaData.moznosti.length; i++) {
                    if (i !== spravnaOdpovedIndex) {
                        spatneIndexy.push(i);
                    }
                }

                spatneIndexy = spatneIndexy.filter(index => index !== spravnaOdpovedIndex);
                const zatmaveneIndexy = spatneIndexy.length > 2 ? spatneIndexy.sort(() => .5 - Math.random()).slice(0, 2) : spatneIndexy;

                zatmaveneIndexy.forEach(index => {
                    const elementOdpovediText = document.getElementById('text_odpovedi' + String.fromCharCode(65 + index));
                    const elementOdpovediObrazek = document.getElementById('odpoved' + String.fromCharCode(65 + index) + '_tvar'); // Doplněno pro obrázky

                    if (elementOdpovediText) {
                        elementOdpovediText.style.opacity = '0.5';
                        elementOdpovediText.style.pointerEvents = 'none'; 
                    }

                    if (elementOdpovediObrazek) {
                        elementOdpovediObrazek.style.pointerEvents = 'none'; 
                    }
                });

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

        let procenta = [];
        for (let i = 0; i < 3; i++) {
            let cislo = Math.floor(Math.random() * 30) + 3; 
            procenta.push(cislo);
        }
        let soucetProcent = procenta.reduce((a, b) => a + b, 0);
        procenta.push(100 - soucetProcent); 

        procenta.sort(() => Math.random() - 0.5);

        const indexSpravneOdpovedi = aktualniOtazkaData.moznosti.indexOf(aktualniOtazkaData.spravna_odpoved);
        const nejvyssiHodnota = Math.max(...procenta);
        procenta[procenta.indexOf(nejvyssiHodnota)] = procenta[indexSpravneOdpovedi];
        procenta[indexSpravneOdpovedi] = nejvyssiHodnota;

        for (let i = 0; i < 4; i++) {
            const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
            if (odpovedElem) {
                odpovedElem.textContent += ' - ' + procenta[i] + '%';
            }
        }

        document.querySelector('.lidi').style.opacity = '0.5';
        document.querySelector('.lidi').style.pointerEvents = 'none';
    });
}


function ukoncitHru() {
    spenize = ["0","100","200","300","500","1 000","2 000","4 000","8 000","16 000","32 000","64 000", "125 000", "250 000", "500 000", "1 000 000" ]
    for (let i = 0; i < 4; i++) { 
        const odpovedElem = document.getElementById('text_odpovedi' + String.fromCharCode(65 + i));
        if (odpovedElem) {
            odpovedElem.style.pointerEvents = 'none';
            odpovedElem.style.opacity = '0.5';
        }
    }
    predeslauroven = aktualniUroven - 1;
    predeslepenize = spenize[predeslauroven];

    window.location.href = 'konec_hry.html?score=' + predeslauroven  + '&money=' + predeslepenize

}
