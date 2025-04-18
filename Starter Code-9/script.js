document.addEventListener("DOMContentLoaded", function () {
    const noteContainer = document.getElementById("note-container");
    const footer = document.querySelector('footer');
    const colorSwatches = document.querySelectorAll('.swatch');
    const newNote = document.querySelector('#note-text');
    const postIt = document.querySelector('.post');

    let notesList = [];
    let noteColor = null;
    let noteIdCounter = 0;
    let activeNote = null;

    //retrieve localStorage and assign
    readFromLS();

    newNote.addEventListener('input', () => {
        if (newNote.value.trim() === '') {
            postIt.classList.add('inactive');
        } else {
            postIt.classList.remove('inactive');
        }
    });

    function writeToLS(key, value) {
        if (!key || !value) return;
        localStorage.setItem(key, value.toString());
    }
    function readFromLS() {
        noteIdCounter = parseInt(localStorage.getItem('noteIDCounter')) || 0;
        noteColor = localStorage.getItem('noteColor') || 'info';
        newNote.className = noteColor;
        let notes = JSON.parse(localStorage.getItem('notesList')) || [];

        notesList = [];
        for (let noteData of notes) {
            const note = document.createElement('textarea');
            note.setAttribute('data-note-id', noteData.id);
            note.className = noteData.className;
            note.value = noteData.value;
            note.id = 'note';

            document.querySelector('#note-container').append(note);
            notesList.push(note);
        }
    }
    function addNewNote() {
        const id = noteIdCounter;
        const note = document.createElement('textarea');
        note.setAttribute("data-note-id", id.toString());
        note.className = newNote.className;
        note.value = newNote.value;
        note.id = "note";
        noteContainer.appendChild(note);
        newNote.value = '';

        //for persistence
        noteIdCounter++;
        notesList.push(note);

        //map from HTML element to JS object
        const savedNotes = notesList.map(note => ({
            id: note.getAttribute("data-note-id"),
            className: note.className,
            value: note.value
        }));
        writeToLS('notesList', JSON.stringify(savedNotes));
        writeToLS('noteIdCounter', noteIdCounter);
    }

    //select color
    footer.addEventListener('mouseover', () => {
        footer.style.opacity = 1;
    });
    footer.addEventListener('mouseout', () => {
        footer.style.opacity = 0;
    });
    for (let swatch of colorSwatches) {
        swatch.addEventListener('click', (event) => {
            newNote.className = swatch.innerText.toLowerCase();

            //for persistence
            noteColor = swatch.innerText.toLowerCase();
            writeToLS('noteColor', noteColor);

            for (let swatch of colorSwatches) {
                if (event.target === swatch) {
                    swatch.classList.add('selected');
                } else {
                    swatch.classList.remove('selected');
                }
            }
        });
    }

    //post note
    postIt.addEventListener('click', () => {
        if (!postIt.classList.contains('inactive')) addNewNote();
    });

    //delete note
    document.addEventListener("dblclick", function (event) {
        if (event.target.id === 'note') {
            event.target.remove();

            for (let i = 0; i < notesList.length; i++) {
                if (event.target === notesList[i]) {
                    notesList.splice(i, 1);

                    //map from HTML element to JS object
                    const savedNotes = notesList.map(note => ({
                        id: note.getAttribute("data-note-id"),
                        className: note.className,
                        value: note.value
                    }));
                    writeToLS('notesList', JSON.stringify(savedNotes));
                    writeToLS('noteIdCounter', noteIdCounter);
                    break;
                }
            }
        }
    });

    //slow double click for reading and editing existing note
    document.addEventListener('click', (event) => {
        if (event.target.id === 'note') {
            for (let note of notesList) {
                note.style.width = '132px';
                note.style.height = '132px';
            }
            if (event.target === activeNote) {
                event.target.style.width = '264px';
                event.target.style.height = '264px';
            }
            activeNote = event.target;
        } else {
            for (let note of notesList) {
                note.style.width = '132px';
                note.style.height = '132px';
            }
        }

        //map from HTML element to JS object
        const savedNotes = notesList.map(note => ({
            id: note.getAttribute("data-note-id"),
            className: note.className,
            value: note.value
        }));
        writeToLS('notesList', JSON.stringify(savedNotes));
        writeToLS('noteIdCounter', noteIdCounter);
    });

    noteContainer.addEventListener("blur", function (event) {
        if (event.target.classList.contains("note")) {
            // TODO: Update the note from the saved notes in the local storage.
        }
    }, true);

    window.addEventListener("keydown", function (event) {
        /* Ignores key presses made for color and note content inputs. */
        if (event.target.id === "color-input" || event.target.type === "textarea") {
            return;
        }

        /* Adds a new note when the "n" key is pressed. */
        if (event.key === "n" || event.key === "N") {
            addNewNote(); // Adds a new note.
        }
    });
});
