import 'i18next'

declare module 'i18next' {
    interface CustomTypeOptions {
        returnNull: false
    }

    interface TFunction {
        <
            TKeys extends 'welcome' | 'toggleTheme' | 'language' | 'lightMode' | 'darkMode',
            TInterpolationMap extends object | undefined = undefined
        >(
            key: TKeys,
            options?: TOptions<TInterpolationMap>
        ): string
    }
}
