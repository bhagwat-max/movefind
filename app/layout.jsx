import './globals.css';
import Brand from '@/components/Brand';
import Footer from '@/components/Footer';

export const metadata = {
  title: { default: 'MoveFind — Find where to watch any movie', template: '%s | MoveFind' },
  description: 'Search a movie and see which streaming platforms have it in your country. Simple, fast, and clear.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return <html lang="en">
    <body>
      <div className="site-shell">
        <header className="site-header">
          <div className="header-inner container">
            <Brand />
            <div className="header-right"><span className="header-caption">Your movie, found.</span><a className="header-about" href="/#about">About <span aria-hidden="true">↗</span></a></div>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </div>
    </body>
  </html>;
}
