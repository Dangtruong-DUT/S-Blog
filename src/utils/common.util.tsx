import { FaGlobe } from 'react-icons/fa'
import axios, { AxiosError, HttpStatusCode } from 'axios'
import { ICONS_WITH_COLOR } from 'src/constants/IconSocial'
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
    return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

const removeSpecialCharacter = (str: string) =>
    // eslint-disable-next-line no-useless-escape
    str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
    return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}`
}

export const getIdFromNameId = (nameId: string) => {
    const arr = nameId.split('-i.')
    return arr[arr.length - 1]
}

export const formatter = new Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' })

export const getDomainIconWithColor = (link: string) => {
    try {
        if (link.startsWith('mailto:')) return ICONS_WITH_COLOR['email']
        const domain = new URL(link).hostname.replace('www.', '')
        return ICONS_WITH_COLOR[domain] || { icon: <FaGlobe size={45} color='gray' />, name: 'Website' }
    } catch {
        return { icon: <FaGlobe size={45} color='gray' />, name: 'Website' }
    }
}
