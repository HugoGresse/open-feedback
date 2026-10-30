/** Random 6-digit hex color without `#`. */
export const newRandomHexColor = () =>
    Math.floor(Math.random() * 0x1000000)
        .toString(16)
        .padStart(6, '0')
