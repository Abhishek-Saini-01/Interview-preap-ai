interface RootLayoutProps {
    children: React.ReactNode

}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <div className="root-layout">
            {children}
        </div>
    )
}

export default RootLayout