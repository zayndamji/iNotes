const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');

const notes = {};

createNote.addEventListener('click', () => {
  const uuid = crypto.randomUUID();

  const note = document.createElement('div');
  note.classList.add('note');
  note.setAttribute('uuid', uuid);

  const noteInput = document.createElement('textarea');

  note.append(noteInput);

  notesList.append(note);

  notes[uuid] = new SimpleMDE({ element: noteInput });

  notes[uuid].codemirror.on('change', () => {
    localStorage[uuid] = notes[uuid].value();
  });
});