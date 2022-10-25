const dictionary_api = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const dictionary_loader = document.getElementById('dictionary-loader');
const codeEditors = document.getElementById('codeEditor');
var lineCounter = document.getElementById('lineCounter');
var imgUpload = document.getElementById('img-upload');


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
    document.getElementById('offcanvasBottom').classList.add('show');

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


    dictionary_loader.style.display = "none";

}


async function renderPartsOfSpeech(meanings) {
    document.getElementById('word-types').innerHTML = '';


    var i = 0;
    let html_part_of_speech = '', html_small_info = '';

    Promise.all(meanings.map(value => {
        html_part_of_speech += `<li data-id="${i}" class="partofspeech-btn ${(i == 0) ? 'active' : ''}">
                        <label for="opt1">${value.partOfSpeech}</label>
                    </li>`;

        if (i == 0)
            html_small_info += `<h1 id="part-of-speech"></h1>`;


        var antonyms = value.antonyms;
        html_small_info += antonyms.map(antonym => `<a class="btn btn-sm btn-outline-danger mr-10">${antonym}</a>`).join("");


        var synonyms = value.synonyms;
        html_small_info += synonyms.map(synonym => `<a class="btn btn-sm btn-outline-success mr-10">${synonym}</a>`).join("");


        i++;

    })).then(() => {

        document.getElementById('word-types').innerHTML = html_part_of_speech;


        partOfSpeechBtns = document.getElementsByClassName('partofspeech-btn');

        i = 0;
        for (let partOfSpeechBtn of partOfSpeechBtns) {
            partOfSpeechBtn.addEventListener('click', function handleClick(event) {
                togglePartOfSpeechButtons(event.target);
                setPartOfSpeechContent(meanings, event.target.dataset.id, html_small_info);

            });

            if (i == 0)
                partOfSpeechBtn.click();
            i++;

        }
    });

}

function togglePartOfSpeechButtons(current_btn) {
    partOfSpeechBtns = document.getElementsByClassName('partofspeech-btn');

    for (let partOfSpeechBtn of partOfSpeechBtns) {
        partOfSpeechBtn.classList.remove('active');
    }

    current_btn.classList.add('active');
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

    document.getElementById('part-of-speech').innerHTML = meanings[id].partOfSpeech;


}


function renderImageText(image_text) {
    // console.log(image_text);
    document.getElementById('image-text').value = image_text.message;
    BottomToast(image_text.status_msg);
}




function copyToClipBoard(element) {

    let copied_text = element.parentElement.parentElement.querySelector('.image-text').value;

    navigator.clipboard.writeText(copied_text);

    var tooltiptext = element.querySelector('.tooltiptext');
    tooltiptext.innerText = 'Copied to clipboard';
    BottomToast('Copied to clipboard');


    setTimeout(function () {
        tooltiptext.innerText = 'Copy to clipboard';
    }, 3000);


}



imgUpload.addEventListener('submit', async (e) => {
    e.preventDefault();

    loading_btn('img-upload-btn');
    await uploadImage(e.target);
    loading_btn();

});


function addWorkSpace(element) {
    let workspace_html = `<div class="row mt-30">

                            <div class="bd-clipboard">
                                <button  onclick="copyToClipBoard(this)" id="copyToClipboard" type="button" class="btn-clipboard tooltip-custom" title=""
                                    data-bs-original-title="Copy to clipboard">Copy
                                    <span class="tooltiptext tooltip-top">Copy to clipboard</span>
                                </button>

                                <a class="btn btn-rsm btn-index-textarea btn-primary">1</a>
                                <a onclick="addWorkSpace(this)" class="btn btn-rsm btn-add-textarea btn-outline-success">Add</a>
                                <a onclick="removeWorkSpace(this)" class="btn btn-rsm btn-rem-textarea btn-outline-danger">Remove</a>

                            </div>

                            <textarea oninput="autoResize(this)" placeholder="Text workspace" class="image-text" rows="4"></textarea>

                            <br>
                        </div>`;


    element.parentElement.parentElement.insertAdjacentHTML("afterend", workspace_html);
    // document.getElementById('workspaces').innerHTML += workspace_html;

    resetTextareaCount();
}

function removeWorkSpace(element) {
    if (document.getElementsByClassName('btn-index-textarea').length <= 3)
        return;
    element.parentElement.parentElement.remove();
    resetTextareaCount();
}


function resetTextareaCount() {
    let count_indexes = document.getElementsByClassName('btn-index-textarea');
    for (var i = 0; i < count_indexes.length; i++) {
        count_indexes[i].innerText = i + 1;
    }
}

async function uploadImage(target) {
    const response = await fetch(target.action, {
        method: "POST",
        body: new FormData(target)
    });

    if (!response.ok) {
        BottomToast('Something went wrong,Please try again');
        return;
    }

    const image_text = await response.json();
    if (image_text.status != 200) {
        BottomToast(image_text.status_msg);
        return;
    }

    renderImageText(image_text);



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



function BottomToast(message = 'Welcome !') {
    document.getElementById('snackbar').classList.add("show");
    document.getElementById('snackbar').innerText = message;

    setTimeout(function () {
        document.getElementById('snackbar').classList.remove("show");
    }, 3000);
}




var loadin_btn_elem;
function loading_btn(this_elem = '') {
    // return;
    var xhr_loader = document.querySelectorAll('.loader-xhr');
    if (xhr_loader.length > 0) {
        xhr_loader[0].remove();
        loadin_btn_elem.style.opacity = '1.0';
        loadin_btn_elem.removeAttribute('disabled');
    } else {
        this_elem = document.getElementById(this_elem);
        this_elem.setAttribute('disabled', true);
        this_elem.style.opacity = '0.6';
        this_elem.innerHTML += '<i class="fa fa-spinner fa-spin loader-xhr"></i>';
        loadin_btn_elem = this_elem;
    }
    return;
}