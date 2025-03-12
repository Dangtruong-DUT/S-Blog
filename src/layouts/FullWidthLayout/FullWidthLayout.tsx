import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface props {
    children: React.ReactNode
}
function FullWidthLayout({ children }: props) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default FullWidthLayout
