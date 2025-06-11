import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'AI & Machine Learning', href: '#' },
    { name: 'Web Development', href: '#' },
    { name: 'Cybersecurity', href: '#' },
    { name: 'Cloud Computing', href: '#' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-x-12">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">TechNexus</span>
            <h1 className="text-2xl font-bold text-primary">TechNexus<span className="text-accent">.</span></h1>
          </Link>
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-dark hover:text-primary">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="hidden lg:flex">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-medium" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-64 rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-light-dark focus:ring-2 focus:ring-inset focus:ring-primary"
                placeholder="Search articles..."
              />
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="hidden lg:block"
          >
            Subscribe
          </Button>
          <Link to="#" className="hidden lg:block">
            <UserCircleIcon className="h-6 w-6 text-medium hover:text-primary" aria-hidden="true" />
          </Link>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-dark"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"}`}>
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-light-dark">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">TechNexus</span>
              <h1 className="text-2xl font-bold text-primary">TechNexus<span className="text-accent">.</span></h1>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-light-dark">
              <div className="py-6">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-medium" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-light-dark focus:ring-2 focus:ring-inset focus:ring-primary"
                    placeholder="Search articles..."
                  />
                </div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-dark hover:bg-light"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;