export const triggerSaveKeypress = (doc) => {
    doc.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 's',
            keyCode: 83, // example values.
            code: 'KeyS', // put everything you need in this object.
            which: 83,
            shiftKey: false, // you don't need to include values
            ctrlKey: false, // if you aren't going to use them.
            metaKey: true, // these are here for example's sake.
        })
    )
}
