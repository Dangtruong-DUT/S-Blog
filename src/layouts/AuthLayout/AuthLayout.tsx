import Header from 'src/components/AuthHeader/Header'
import Footer from 'src/components/Footer'

interface props {
    children: React.ReactNode
}
function AuthLayout({ children }: props) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default AuthLayout
