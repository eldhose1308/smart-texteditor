const dictionary_api = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const dictionary_loader = document.getElementById('dictionary-loader');
const codeEditors = document.getElementById('codeEditor');
var lineCounter = document.getElementById('lineCounter');


var offCanvasClose = document.querySelector('.btn-close');
offCanvasClose.onclick = function (e) {
    e.target.parentNode.parentNode.classList.remove('show');
}




function getSelectedText() {
    var start = codeEditor.selectionStart;
    var finish = codeEditor.selectionEnd;
    var selectedText = codeEditor.value.substring(start, finish);

    return selectedText;
}



async function fetchMeaningJSON(selectedText) {
    dictionary_loader.style.display = "block";
    const response = await fetch(dictionary_api + selectedText);
    if (!response.ok) {
        alert('Do something');
        return;
    }
    const word_details = await response.json();
    renderMeaning(word_details);
}




function renderMeaning(word_details) {


    word_details = word_details[0];
    let meanings = word_details.meanings;


    renderPartsOfSpeech(meanings);


    document.getElementById('offcanvasBottom').classList.add('show');
    dictionary_loader.style.display = "none";

}


function renderPartsOfSpeech(meanings) {
    document.getElementById('word-types').innerHTML = '';


    var i = 0;
    let html_part_of_speech, html_small_info;
    meanings.map(value => {
        html_part_of_speech += `<li data-id="${i}" class="partofspeech-btn ${(i == 0) ? 'active' : ''}">
                        <label for="opt1">${value.partOfSpeech}</label>
                    </li>`;

        if (i == 0)
            html_small_info += `<h1>${value.partOfSpeech}</h1>`;


        var antonyms = value.antonyms;
        html_small_info += antonyms.map(antonym => `<a class="btn btn-sm btn-outline-danger mr-10">${antonym}</a>`).join("");


        var synonyms = value.synonyms;
        html_small_info += synonyms.map(synonym => `<a class="btn btn-sm btn-outline-success mr-10">${synonym}</a>`).join("");


        i++;

    });

    document.getElementById('word-types').innerHTML = html_part_of_speech;


    partOfSpeechBtns = document.getElementsByClassName('partofspeech-btn');

    for (let partOfSpeechBtn of partOfSpeechBtns) {
        partOfSpeechBtn.addEventListener('click', function handleClick(event) {
            console.log(event.target.dataset);
            setPartOfSpeechContent(meanings, event.target.dataset.id, html_small_info);
        });
    }
}



function setPartOfSpeechContent(meanings, id, html_small_info) {
    options = document.getElementsByClassName('options')[0];
    options.innerHTML = `<div id="small-info">
                           ${html_small_info}
                        </div>
                        <hr>
                        `;


    let definitions = meanings[id].definitions;
    definitions.map(definition => {
        options.innerHTML += `<p>${definition.definition}</p>`;
        options.innerHTML += (definition.example) ? `<span class="text-muted">Eg: ${definition.example}</span>` : '';



        var antonyms = definition.antonyms;
        options.innerHTML += antonyms.map(antonym => `<a class="btn btn-sm btn-outline-danger mr-10">${antonym}</a>`).join("");


        var synonyms = definition.synonyms;
        options.innerHTML += synonyms.map(synonym => `<a class="btn btn-sm btn-outline-success mr-10">${synonym}</a>`).join("");



        options.innerHTML += `<hr>`;
    });


}


codeEditor.addEventListener('scroll', () => {
    lineCounter.scrollTop = codeEditor.scrollTop;
    lineCounter.scrollLeft = codeEditor.scrollLeft;
});



codeEditor.addEventListener('keydown', (e) => {
    let { keyCode } = e;
    let { value, selectionStart, selectionEnd } = codeEditor; if (keyCode === 9) {  // TAB = 9
        e.preventDefault();
        codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
        codeEditor.setSelectionRange(selectionStart + 2, selectionStart + 2)
    }

    var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17)
        ? true : false);

    if (!ctrl)
        return;

    var key = e.which || e.keyCode;
    if (key == 77 && ctrl) {
        fetchMeaningJSON(getSelectedText());
    }

});


var lineCountCache = 0;
function line_counter() {
    var lineCount = codeEditor.value.split('\n').length;
    var outarr = new Array();
    if (lineCountCache != lineCount) {
        for (var x = 0; x < lineCount; x++) {
            outarr[x] = (x + 1) + '';
        }
        lineCounter.value = outarr.join('\n');
    }
    lineCountCache = lineCount;
} codeEditor.addEventListener('input', () => {
    line_counter();
});
