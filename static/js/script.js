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
    document.getElementById('word-types').innerHTML = '';


    word_details = word_details[0];
    let meanings = word_details.meanings;

    var i = 1;
    let html_js = ``;
    meanings.map(value => {
        console.log(value);
        html_js += `<li ${(i == 1) ? 'class="active"' : ''}>
                        <label data-id="${i}" for="opt1">${value.partOfSpeech}</label>
                    </li>`;
        i++;
    });
    document.getElementById('word-types').innerHTML = html_js;


    document.getElementById('offcanvasBottom').classList.add('show');
    dictionary_loader.style.display = "none";

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
