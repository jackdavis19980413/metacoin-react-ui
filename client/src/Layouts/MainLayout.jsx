
export default function MainLayout({ header, children }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}
            <main>{children}</main>
        </div>
    );
}
