import { FieldValues, Path, RegisterOptions, UseFormGetValues } from 'react-hook-form'
type Rules<T extends FieldValues> = { [key in 'email' | 'password' | 'confirmPassword']?: RegisterOptions<T> }

export const getRules = <T extends FieldValues>(getValues?: UseFormGetValues<T>): Rules<T> => ({
    email: {
        required: {
            value: true,
            message: 'email is required'
        },
        pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'email is not in correct format'
        },
        minLength: {
            value: 5,
            message: 'length from 5- 160 characters'
        },
        maxLength: {
            value: 160,
            message: 'length from 5- 160 characters'
        }
    },
    password: {
        required: {
            value: true,
            message: 'password is required'
        },
        minLength: {
            value: 6,
            message: 'length from 6- 160 characters'
        },
        maxLength: {
            value: 160,
            message: 'length from 6- 160 characters'
        }
    },
    confirmPassword: {
        required: {
            value: true,
            message: 'password is required'
        },
        minLength: {
            value: 6,
            message: 'length from 6- 160 characters'
        },
        maxLength: {
            value: 160,
            message: 'length from 6- 160 characters'
        },
        validate:
            typeof getValues === 'function'
                ? (value: string) => {
                      if (value === getValues('password' as Path<T>)) {
                          return true
                      } else return 'confirmation password does not match'
                  }
                : undefined
    }
})
