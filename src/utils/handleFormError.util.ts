import { Path, UseFormReturn } from 'react-hook-form'
import { ResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from './common.util'

import { FieldValues } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function handleFormError<T extends FieldValues>(error: unknown, form: UseFormReturn<T>) {
    if (isAxiosUnprocessableEntityError<ResponseApi<T>>(error)) {
        const formError = error.response?.data.data
        if (formError != undefined) {
            Object.keys(formError).forEach((element) => {
                const key = element as keyof T
                form.setError(key as Path<T>, {
                    message: formError[key],
                    type: 'Server'
                })
            })
        } else {
            toast.error(error.response?.data.message)
        }
    }
}
