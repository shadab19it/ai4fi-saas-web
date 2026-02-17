"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Zap, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import authService from "../../../services/authService";
import { setUser } from "../../../store/userReducer";
import { ThemeToggle } from "../../../components/ThemeToggle";

const Navbar = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeLink, setActiveLink] = useState("home");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (window.location.pathname === "/") {
				setActiveLink("home");
			} else if (window.location.pathname === "/about") {
				setActiveLink("about");
			} else if (window.location.pathname === "/model-gallery") {
				setActiveLink("gallery");
			} else if (window.location.pathname === "/contact") {
				setActiveLink("contact");
			}
		}
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		{ name: "Home", icon: "home", link: "/", isLink: true },
		// { name: "Features", icon: "features", link: "/#features", isLink: false },
		{ name: "About", icon: "about", link: "/about", isLink: true },
		{ name: "Pricing", icon: "pricing", link: "/pricing", isLink: true },
		{
			name: "Portfolio",
			icon: "gallery",
			link: "/model-gallery",
			isLink: true,
		},
		{ name: "Contact", icon: "contact", link: "/contact", isLink: true },
	];

	const dropdownItems = [
		{ name: "Model Generator", href: "/model" },
		{ name: "Virtual Try Room", href: "/virtualtryon" },
		{ name: "Try On V2 (beta)", href: "/try-on-v2-beta" },
		{ name: "Ads Generator", href: "/ads-generator" },
	];

	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
					? "py-2 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
					: "py-4 bg-transparent"
				}`}
		>
			<div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/">
						<div className="flex-shrink-0 flex items-center">
							{/* <div className='w-8 h-8 mr-2 bg-gradient-to-br from-cyan-400 to-sky-600 rounded-lg flex items-center justify-center'>
                <Zap size={18} className='text-white' />
              </div> */}
							<span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
								<img src="./light-logo.png" className="w-auto h-[60px]" />
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{navLinks.map((item) => {
							if (item.isLink) {
								return (
									<Link to={`${item.link}`}>
										<motion.span
											key={item.name}
											className={`relative px-3 py-2 mx-1 rounded-lg transition-colors duration-200
                    ${activeLink === item.name.toLowerCase() ? "text-foreground font-medium" : "text-secondary-foreground hover:text-foreground font-semibold hover:bg-foreground/5"}`}
											onClick={() => setActiveLink(item.name.toLowerCase())}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											{activeLink === item.name.toLowerCase() && (
												<motion.span
													layoutId="activeNavIndicator"
													className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-sky-500/20"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.2 }}
												/>
											)}
											<span className="relative z-10">{item.name}</span>
										</motion.span>
									</Link>
								);
							} else {
								return (
									<a href={`${item.link}`}>
										<motion.span
											key={item.name}
											className={`relative px-3 py-2 mx-1  rounded-lg transition-colors duration-200
                    ${activeLink === item.name.toLowerCase() ? "text-foreground font-medium" : "text-secondary-foreground hover:text-foreground hover:bg-foreground/5"}`}
											onClick={() => setActiveLink(item.name.toLowerCase())}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											{activeLink === item.name.toLowerCase() && (
												<motion.span
													layoutId="activeNavIndicator"
													className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-sky-500/20"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.2 }}
												/>
											)}
											<span className="relative z-10">{item.name}</span>
										</motion.span>
									</a>
								);
							}
						})}

						{/* Our Offerings Dropdown */}
						<div className="relative">
							<motion.button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="relative px-3 py-2 mx-1 rounded-lg transition-colors duration-200 text-secondary-foreground font-semibold hover:text-foreground hover:bg-foreground/5 flex items-center"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<span>Our Offerings</span>
								<ChevronDown size={16} className="ml-1" />
							</motion.button>
							<AnimatePresence>
								{isDropdownOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute top-full left-0 mt-2 w-48 bg-secondary  rounded-lg shadow-lg "
									>
										{dropdownItems.map((item) => (
											<Link to={item.href}>
												<motion.span
													key={item.name}
													className="block px-4 py-3  text-secondary-foreground hover:text-foreground hover:bg-background transition-colors duration-200"
													onClick={() => setIsDropdownOpen(false)}
												>
													{item.name}
												</motion.span>
											</Link>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* CTA Button or User Profile */}
					<div className="hidden md:flex items-center gap-4">
						<ThemeToggle />
						{authService.isAuthenticated() && user ? (
							<div className="flex gap-2">
								<motion.div
									whileHover={{ scale: 1.05 }}
									className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20"
								>
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 flex items-center justify-center">
										<User size={16} className="text-white" />
									</div>
									<span className=" font-medium text-foreground">
										{user?.username}{" "}
										{user?.role === "user" &&
											`- Points ${user.subscription.points}`}
									</span>
								</motion.div>
								<motion.div
									onClick={() => {
										authService.logout();
										dispatch(setUser(null));
									}}
									whileHover={{ scale: 1.05 }}
									className=" cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20"
								>
									<span className=" font-medium text-foreground">Logout</span>
								</motion.div>
							</div>
						) : (
							<div className="flex gap-3">
								<Link to="/login">
									<motion.div
										whileHover={{ scale: 1.05 }}
										className=" cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20"
									>
										<span className=" font-medium text-foreground">Login</span>
									</motion.div>
								</Link>
								<Link to="/signup">
									<motion.button
										whileHover={{
											scale: 1.05,
											boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
										}}
										whileTap={{ scale: 0.95 }}
										onClick={() => { }}
										className="bg-brand-color text-white px-6 py-2.5 rounded-xl font-medium  transition-all duration-300 flex items-center gap-2 "
									>
										<span>SignUp</span>
									</motion.button>
								</Link>
							</div>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center gap-2">
						<ThemeToggle />
						<motion.button
							whileTap={{ scale: 0.9 }}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/10 to-sky-500/10 text-cyan-400 hover:text-white"
						>
							{isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
						</motion.button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="md:hidden overflow-hidden"
					>
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1, staggerChildren: 0.1 }}
							className="px-4 pt-2 pb-6 space-y-1 bg-background/95 backdrop-blur-xl border-b border-border"
						>
							{navLinks.map((item, index) => (
								<motion.a
									key={item.name}
									href={`${item.link}`}
									className={`block px-4 py-3 rounded-lg  font-medium transition-colors duration-200 ${activeLink === item.name.toLowerCase()
											? "bg-muted text-foreground"
											: "text-secondary-foreground hover:text-secondary-foreground hover:bg-foreground/5"
										}`}
									onClick={() => {
										setActiveLink(item.name.toLowerCase());
										setIsMobileMenuOpen(false);
									}}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * index }}
								>
									{item.name}
								</motion.a>
							))}
							{/* Our Offerings Dropdown in Mobile Menu */}
							<div className="pt-2 mb-8">
								<motion.button
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="w-full px-4 py-3 rounded-lg  font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * navLinks.length }}
								>
									<span>Our Offerings</span>
									<ChevronDown
										size={16}
										className={`transform ${isDropdownOpen ? "rotate-180" : ""}`}
									/>
								</motion.button>
								<AnimatePresence>
									{isDropdownOpen && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.2 }}
											className="pl-4"
										>
											{dropdownItems.map((item) => (
												<motion.a
													key={item.name}
													href={item.href}
													className="block px-4 py-3  text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
													onClick={() => {
														setIsDropdownOpen(false);
														setIsMobileMenuOpen(false);
													}}
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.1 }}
												>
													{item.name}
												</motion.a>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
							>
								{authService.isAuthenticated() ? (
									<div>
										<div
											className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-gray-100 "
											onClick={() => {
												authService.logout();
												dispatch(setUser(null));
											}}
										>
											Logout
										</div>
										<div className="flex items-center gap-3 px-4 py-3 rounded-xl mt-4 bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20">
											<div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 flex items-center justify-center">
												<User size={16} className="text-white" />
											</div>
											<span className=" font-medium text-white">
												{user?.username}{" "}
												{user?.role === "user" &&
													`- Points ${user.subscription.points}`}
											</span>
										</div>
									</div>
								) : (
									<Link to="/login">
										<button
											onClick={() => { }}
											className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 "
										>
											<span>Virtual Try Room</span>
											<ChevronRight size={16} />
										</button>
									</Link>
								)}
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.nav>
	);
};

export default Navbar;
