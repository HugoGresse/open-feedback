/**
 * True while an IME composition is ongoing (e.g. Japanese or Chinese input):
 * Enter/Escape then confirm or cancel the composition, they must not submit or
 * cancel the field. Safari reports it only through keyCode 229.
 */
export const isComposingKeyEvent = (event: {
    nativeEvent: { isComposing: boolean }
    keyCode: number
}): boolean => event.nativeEvent.isComposing || event.keyCode === 229
