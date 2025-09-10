"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  LogOut,
  ShoppingCart,
  Settings,
  ChevronLeft,
  Menu as MenuIcon,
  User,
} from "lucide-react";
import { useAuth } from "./auth-provider";
import { useAdminRefresh } from "@/hooks/use-admin-refresh";
import LoginModal from "@/components/login_modual";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { isAdmin: refreshedAdmin } = useAdminRefresh();
  const router = useRouter();
  const pathname = usePathname();

  const userIsAdmin = refreshedAdmin || isAdmin;
  const instagramUrl = "https://instagram.com/sriharshavardhini";
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user && (pathname === "/" || pathname === "/combined-page")) {
      const timer = setTimeout(() => setShowModal(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [user, pathname]);

  const handleLogout = () => {
    logout();
    router.push("/combined-page");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  return (
    <>
      {/* Top striped border */}
      <div
        className="w-full h-4"
        style={{
          background:
            "repeating-linear-gradient(to right, #28563B 0px, #28563B 8px, transparent 8px, transparent 28px)",
        }}
      />

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      <header className="relative z-50 w-full bg-[#C9E3D4]">
        <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-between px-2 xs:px-3 sm:px-4 py-2 md:px-8 gap-2 sm:gap-0">
          {/* Logo, Hamburger, Title stacked on mobile */}
          <div className="flex w-full sm:w-auto items-center gap-6 min-w-0">
            <button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
              title={isMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded bg-[#C9E3D4] text-[#28563B] hover:bg-[#28563B] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#28563B] transition flex-shrink-0"
              style={{ minWidth: 40, minHeight: 40 }}
            >
              {isMenuOpen ? (
                <ChevronLeft className="w-6 h-6 text-[#28563B]" />
              ) : (
                <MenuIcon className="w-6 h-6 text-[#28563B]" />
              )}
            </button>
            <Link href="/" className="flex items-center gap-4 min-w-0 flex-shrink-0">
              {/* Logo removed as requested */}
              <div className="flex flex-col min-w-0">
                <h1 className="text-[#28563B] font-serif font-extrabold whitespace-pre-wrap text-lg sm:text-2xl md:text-4xl leading-tight tracking-widest flex items-center gap-4">
                  THE
                  <span style={{marginLeft: '0.25em', marginRight: '0.25em'}}>IMAGE</span>
                  <span className="inline-flex items-center justify-center">
                    I
                    <img src="/WhatsApp_Image_2025-08-06_at_00.12.04_9d5caab6-removebg-preview.png" alt="Logo S" className="w-8 h-8 md:w-10 md:h-10 align-middle mx-0" style={{verticalAlign: 'middle'}} />
                    LAND
                  </span>
                </h1>
                <p className="text-[#6ca16c] font-serif text-base sm:text-lg md:text-xl leading-none mt-1">
                  IMAGE CONSULTANCY
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3 md:space-x-4 lg:space-x-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(instagramUrl, "_blank")}
              className="text-[#28563B] hover:text-[#28563B] hover:bg-[#C9E3D4]"
            >
              <Instagram className="w-5 h-5 md:w-6" />
            </Button>
            {!user && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent px-3 font-sans font-semibold"
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/signup")}
                  className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent px-3 font-sans font-semibold"
                >
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/cart")}
                  className="text-[#28563B] hover:text-[#28563B] hover:bg-[#C9E3D4]"
                >
                  <ShoppingCart className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/user-info")}
                  className="text-[#28563B] hover:text-[#28563B] hover:bg-[#C9E3D4]"
                >
                  <User className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent px-3 font-sans font-semibold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            {userIsAdmin && (
              <Button
                variant="outline"
                onClick={() => router.push("/admin/dashboard")}
                className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent px-3 font-sans font-semibold"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex w-full justify-end gap-2 flex-shrink-0">
            {!user && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent text-sm px-3 py-1 font-sans font-semibold"
                  style={{ minWidth: 80 }}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/signup")}
                  className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent text-sm px-3 py-1 font-sans font-semibold"
                  style={{ minWidth: 80 }}
                >
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/user-info")}
                className="text-[#28563B] hover:text-[#28563B] hover:bg-[#C9E3D4]"
                aria-label="User Profile"
              >
                <User className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-40"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            className="fixed top-0 left-0 z-50 w-64 sm:w-72 max-h-screen p-6 bg-[#C9E3D4] flex flex-col space-y-6 rounded-tr-lg rounded-br-lg shadow-lg overflow-auto"
            role="menu"
            aria-label="Mobile navigation menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close menu"
              onClick={closeMenu}
              className="self-start mb-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition"
            >
              <ChevronLeft className="w-6 h-6 text-[#28563B]" />
            </button>
            <nav className="flex flex-col space-y-5 font-menu-serif text-[#28563B] text-lg tracking-wide">
              <Link
                href="/"
                onClick={closeMenu}
                className={`py-3 px-4 rounded ${
                  isActive("/")
                    ? "bg-[#28563B] text-white"
                    : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                }`}
              >
                HOME
              </Link>
              <Link
                href="/combined-page#about"
                onClick={closeMenu}
                className={`py-3 px-4 rounded ${
                  isActive("/combined-page#about")
                    ? "bg-[#28563B] text-white"
                    : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                }`}
              >
                ABOUT
              </Link>
              <Link
                href="/combined-page#services"
                onClick={closeMenu}
                className={`py-3 px-4 rounded ${
                  isActive("/combined-page#services")
                    ? "bg-[#28563B] text-white"
                    : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                }`}
              >
                SERVICES
              </Link>
              <Link
                href="/appointments"
                onClick={closeMenu}
                className={`py-3 px-4 rounded ${
                  isActive("/appointments")
                    ? "bg-[#28563B] text-white"
                    : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                }`}
              >
                APPOINTMENTS
              </Link>
              <Link
                href="/combined-page#faq"
                onClick={closeMenu}
                className={`py-3 px-4 rounded ${
                  isActive("/combined-page#faq")
                    ? "bg-[#28563B] text-white"
                    : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                }`}
              >
                FAQ
              </Link>
              <Link
                href="/combined-page#instagram"
                onClick={closeMenu}
                className={`py-3 px-4 rounded ${
                  isActive("/combined-page#instagram")
                    ? "bg-[#28563B] text-white"
                    : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                }`}
              >
                INSTAGRAM
              </Link>
              <Link
                href="/combined-page#contact"
                onClick={closeMenu}
                className={`py-3 px-4 rounded ${
                  isActive("/combined-page#contact")
                    ? "bg-[#28563B] text-white"
                    : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                }`}
              >
                CONTACT
              </Link>
              {!user && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeMenu();
                      router.push("/login");
                    }}
                    className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent font-menu-serif font-semibold"
                  >
                    LOGIN
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeMenu();
                      router.push("/signup");
                    }}
                    className="border-[#28563B] text-[#28563B] hover:bg-[#C9E3D4] bg-transparent font-menu-serif font-semibold"
                  >
                    SIGN UP
                  </Button>
                </>
              )}
              {userIsAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={closeMenu}
                  className={`py-3 px-4 rounded ${
                    isActive("/admin/dashboard")
                      ? "bg-[#28563B] text-white"
                      : "bg-[#C9E3D4] hover:bg-[#28563B] hover:text-white"
                  }`}
                >
                  ADMIN
                </Link>
              )}
              <Button
                variant="ghost"
                onClick={() => window.open(instagramUrl, "_blank")}
                className="flex items-center space-x-3 py-3 px-4 rounded bg-[#C9E3D4] text-pink-700 hover:bg-pink-700 hover:text-white font-menu-serif"
              >
                <Instagram className="w-6 h-6" />
                <span>INSTAGRAM</span>
              </Button>
              {user && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      closeMenu();
                      router.push("/cart");
                    }}
                    className="flex items-center space-x-3 py-3 px-4 rounded bg-[#C9E3D4] text-[#28563B] hover:bg-[#28563B] hover:text-white font-menu-serif"
                  >
                    <ShoppingCart className="w-7 h-7" />
                    <span>CART</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      closeMenu();
                      router.push("/user-info");
                    }}
                    className="flex items-center space-x-3 py-3 px-4 rounded bg-[#C9E3D4] text-[#28563B] hover:bg-[#28563B] hover:text-white font-menu-serif"
                  >
                    <User className="w-7 h-7" />
                    <span>PROFILE</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 py-3 px-4 rounded bg-[#C9E3D4] text-[#28563B] hover:bg-[#28563B] hover:text-white font-menu-serif"
                  >
                    <LogOut className="w-7 h-7" />
                    <span>LOGOUT</span>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Bottom striped border */}
      <div
        className="w-full h-4"
        style={{
          background:
            "repeating-linear-gradient(to right, #28563B 0px, #28563B 8px, transparent 8px, transparent 28px)",
        }}
      />
    </>
  );
}
