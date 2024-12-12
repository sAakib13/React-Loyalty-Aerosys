import React, { useState } from "react";
import logo from "../../assets/telerivetlogo.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, Button } from "flowbite-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Control Drawer visibility

  const handleClose = () => setIsOpen(false);
  const isRootPath = location.pathname === "/";
  return (
    <header className="bg-dark p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo Section */}
        <div>
          <a href="/">
            <img
              src={logo}
              alt="Telerivet Logo"
              className="w-auto sm:h-12 md:h-5 lg:h-12"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-6">
            {[
              { name: "Product", href: "https://www.telerivet.com/product/platform" },
              // { name: "Pricing", href: "#pricing" },
              { name: "Guide", href: "https://guide.telerivet.com/hc/en-us?hsLang=en" },
              { name: "Solution", href: "https://www.telerivet.com/solutions" },
              { name: "About", href: "https://www.telerivet.com/about" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-white transition duration-200 hover:bg-primary hover:text-white sm:text-sm lg:text-tiny"
                >
                  {item.name}
                </a>
              </li>
            ))}
            {isRootPath && (
              <>
                <li>
                  <a href="https://telerivet.com/login?hsLang=en"
                    className="px-4 py-2 text-primary sm:text-sm lg:text-tiny  hover:text-primary"

                  >
                    Sign In
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-2xl border-2 border-primary px-4 py-2 text-white transition duration-300 hover:bg-primary sm:text-sm lg:text-tiny"
                  >
                    Programs
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Drawer Toggle */}
        <Button
          onClick={() => setIsOpen(true)}
          className="text-white md:hidden"
        >
          {/* Hamburger Icon */}
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        {/* Drawer Component */}
        <Drawer
          open={isOpen}
          onClose={handleClose}
          position="right"
          className="w-1/2"
        >
          {/* Custom Close Button */}
          <div className="flex justify-end p-4">
            <button onClick={handleClose} className="text-gray-600">
              {/* Close (X) Icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Navigation Items */}
          <Drawer.Items>
            <ul className="space-y-4">
              {[
                { name: "Product", href: "https://www.telerivet.com/product/platform" },
                // { name: "Pricing", href: "#pricing" },
                { name: "Guide", href: "https://guide.telerivet.com/hc/en-us?hsLang=en" },
                { name: "Solution", href: "https://www.telerivet.com/solutions" },
                { name: "About", href: "https://www.telerivet.com/about" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white"
                    onClick={handleClose}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              {isRootPath && (
                <>
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left font-medium text-primary hover:bg-primary hover:text-white"
                      onClick={() => {
                        navigate("/signin");
                        handleClose();
                      }}
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      className="block w-full rounded-lg border-2 border-blue-500 px-4 py-2 text-left font-medium transition duration-300 hover:bg-primary hover:text-white"
                      onClick={() => {
                        navigate("/login");
                        handleClose();
                      }}
                    >
                      Programs
                    </button>
                  </li>
                </>
              )}
            </ul>
          </Drawer.Items>
        </Drawer>
      </div>
    </header>
  );
};

export default Header;
