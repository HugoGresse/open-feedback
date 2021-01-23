import { stringGenerator } from './generateString'
export const generateUrl = () => {
    return `https://example.com/${stringGenerator()}`
}
