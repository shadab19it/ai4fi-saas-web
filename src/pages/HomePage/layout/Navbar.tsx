"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, Zap, User, ChevronDown, Sparkles, Layers, Clapperboard, GalleryHorizontal, CreditCard, Shield, LogOut, Scissors, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import authService from "../../../services/authService";
import { setUser } from "../../../store/userReducer";
import { ThemeToggle } from "../../../components/ThemeToggle";


// ─── Dropdown overlay backdrop blur panel ────────────────────────────────────
const dropdownVariants = {
	hidden: { opacity: 0, y: -8, scale: 0.97 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
	},
	exit: {
		opacity: 0,
		y: -6,
		scale: 0.97,
		transition: { duration: 0.15, ease: "easeIn" },
	},
};

const itemVariants = {
	hidden: { opacity: 0, x: -6 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" },
	}),
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface DropdownItem {
	name: string;
	href: string;
	icon: React.ReactNode;
	description?: string;
}

// ─── Hover Dropdown Component ─────────────────────────────────────────────────
const HoverDropdown = ({
	label,
	items,
	accentColor = "cyan",
	active
}: {
	label: string;
	items: DropdownItem[];
	accentColor?: string;
	active?: boolean;

}) => {
	const [open, setOpen] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setOpen(true);
	};
	const handleLeave = () => {
		timeoutRef.current = setTimeout(() => setOpen(false), 120);
	};

	return (

		<div
			className="relative"
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
		>
			{/* Trigger */}
			<button
				className={`group relative flex
                   ${active ? "text-foreground bg-muted font-medium" : "text-secondary-foreground hover:text-foreground font-semibold hover:bg-foreground/5"}
					
					items-center gap-1.5 px-3 py-2 mx-1 rounded-lg  transition-all duration-200
          text-secondary-foreground hover:text-foreground`}
			>
				<span className="relative z-10">{label}</span>
				<motion.span
					animate={{ rotate: open ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="relative z-10 opacity-50 group-hover:opacity-100"
				>
					<ChevronDown size={13} strokeWidth={2.5} />
				</motion.span>
				{/* underline glow */}

			</button>

			{/* Panel */}
			<AnimatePresence>
				{open && (
					<motion.div
						variants={dropdownVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="absolute top-full -left-[100px] -translate-x-[200px] mt-3 z-50"
						style={{ minWidth: "240px" }}
					>
						{/* glass card */}
						<div
							className="relative rounded-2xl bg-background backdrop-blur-lg overflow-hidden border border-border shadow-2xl"
							style={{

								boxShadow:
									"0 0 0 1px rgba(6,182,212,0.08), 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.06)",
							}}
						>
							{/* top glow line */}
							<div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

							<div className="p-2.5">
								{items.map((item, i) => (
									<motion.div
										key={item.href}
										custom={i}
										variants={itemVariants}
										initial="hidden"
										animate="visible"
									>
										<Link
											to={item.href}
											onClick={() => setOpen(false)}
											className="group/item flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200
                        hover:bg-background/5 text-foreground/60 hover:text-foreground"
										>
											{/* icon container */}
											<div
												className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                          bg-muted group-hover/item:bg-cyan-500/15 text-foreground group-hover/item:text-cyan-400"
												style={{
													boxShadow:
														"inset 0 1px 0 rgba(255,255,255,0.07)",
												}}
											>
												{React.cloneElement(item.icon as React.ReactElement, {
													size: 15,
													strokeWidth: 1.8,
												})}
											</div>

											<div className="flex flex-col min-w-0">
												<span className="text-sm text-secondary-foreground font-semibold leading-tight tracking-wide">
													{item.name}
												</span>
												{item.description && (
													<span className="text-xs text-secondary-foreground mt-0.5 leading-snug truncate">
														{item.description}
													</span>
												)}
											</div>

											<ChevronRight
												size={12}
												className="ml-auto opacity-0 group-hover/item:opacity-40 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-200 flex-shrink-0"
											/>
										</Link>
									</motion.div>
								))}
							</div>

							{/* bottom glow */}
							<div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
						</div>

						{/* caret */}
						<div
							className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 rounded-sm border-t border-l border-white/10"
							style={{ background: "var(--background)" }}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>

	);
};

// ─── Profile Dropdown Component ───────────────────────────────────────────────
const ProfileDropdown = ({ user, effectiveCredits, onLogout }: { user: any, effectiveCredits: number, onLogout: () => void }) => {
	const [open, setOpen] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setOpen(true);
	};
	const handleLeave = () => {
		timeoutRef.current = setTimeout(() => setOpen(false), 120);
	};

	const items = [
		{ name: "Credits", href: "/credits", icon: <Zap /> },
		{ name: "Billing", href: "/billing", icon: <CreditCard /> },
		{ name: "Generated Models", href: "/generated-model", icon: <Database /> },
	];

	if (user?.role === "admin") {
		items.push({ name: "Admin Dashboard", href: "/admin", icon: <Shield /> });
	}

	return (
		<div
			className="relative z-50"
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
		>
			<button className="flex items-center gap-2.5 px-3.5 py-2 mx-1 rounded-xl border border-border bg-muted hover:bg-background/5 transition-all text-secondary-foreground hover:text-foreground group">
				<div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center">
					<User size={11} className="text-white" />
				</div>
				<span className="text-sm font-semibold text-foreground">
					{user?.username}
				</span>
				{user?.role === "user" && (
					<span className="text-xs text-cyan-500 font-medium">
						{effectiveCredits} {user.teamId ? "team credits" : "credits"}
					</span>
				)}
				<motion.span
					animate={{ rotate: open ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="opacity-50 group-hover:opacity-100"
				>
					<ChevronDown size={13} strokeWidth={2.5} />
				</motion.span>
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						variants={dropdownVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="absolute top-full right-0 mt-3 min-w-[220px]"
					>
						<div
							className="relative rounded-2xl bg-background backdrop-blur-lg overflow-hidden border border-border shadow-2xl"
							style={{
								boxShadow:
									"0 0 0 1px rgba(6,182,212,0.08), 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.06)",
							}}
						>
							<div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

							<div className="p-2.5">
								{items.map((item, i) => (
									<motion.div
										key={item.href}
										custom={i}
										variants={itemVariants}
										initial="hidden"
										animate="visible"
									>
										<Link
											to={item.href}
											onClick={() => setOpen(false)}
											className="group/item flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200
                        hover:bg-background/5 text-foreground/60 hover:text-foreground"
										>
											<div
												className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                          bg-muted group-hover/item:bg-cyan-500/15 text-foreground group-hover/item:text-cyan-400"
												style={{
													boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
												}}
											>
												{React.cloneElement(item.icon as React.ReactElement, {
													size: 15,
													strokeWidth: 1.8,
												})}
											</div>

											<span className="text-sm text-secondary-foreground font-semibold leading-tight tracking-wide">
												{item.name}
											</span>

											<ChevronRight
												size={12}
												className="ml-auto opacity-0 group-hover/item:opacity-40 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-200 flex-shrink-0"
											/>
										</Link>
									</motion.div>
								))}

								<div className="h-px bg-border my-1.5 mx-2" />

								<motion.div
									custom={items.length}
									variants={itemVariants}
									initial="hidden"
									animate="visible"
								>
									<button
										onClick={() => {
											setOpen(false);
											onLogout();
										}}
										className="w-full group/item flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200
                        hover:bg-red-500/10 text-foreground/60 hover:text-red-500"
									>
										<div
											className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                          bg-muted group-hover/item:bg-red-500/15 text-foreground group-hover/item:text-red-500"
											style={{
												boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
											}}
										>
											<LogOut size={15} strokeWidth={1.8} />
										</div>

										<span className="text-sm text-secondary-foreground font-semibold leading-tight tracking-wide">
											Logout
										</span>
									</button>
								</motion.div>
							</div>

							<div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
						</div>

						<div
							className="absolute -top-[5px] right-6 w-2.5 h-2.5 rotate-45 rounded-sm border-t border-l border-white/10"
							style={{ background: "var(--background)" }}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const { team } = useSelector((state: RootState) => state.team);
	const effectiveCredits = user?.teamId ? (team?.credits ?? 0) : (user?.credits ?? 0);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeLink, setActiveLink] = useState("home");
	const [mobileOfferingsOpen, setMobileOfferingsOpen] = useState(false);
	const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;
		if (path === "/") setActiveLink("home");
		else if (path === "/about") setActiveLink("about");
		else if (path === "/model-gallery") setActiveLink("gallery");
		else if (path === "/contact") setActiveLink("contact");
		else if (path === "/pricing") setActiveLink("pricing");
		else if (path === "/client-showcase") setActiveLink("client-showcase");
	}, [location.pathname]);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		{ name: "Home", link: "/", isLink: true },
		{ name: "About", link: "/about", isLink: true },
		{ name: "Pricing", link: "/pricing", isLink: true },
		{ name: "Contact", link: "/contact", isLink: true },
	];

	const dropdownItems: DropdownItem[] = [
		{
			name: "StyleLabs",
			href: "/trial-room",
			icon: <Zap />,
			description: "Next-gen fitting experience",
		},
		{
			name: "Product Studio",
			href: "/product-listing-studio",
			icon: <Sparkles />,
			description: "AI-powered eCommerce photography & listing generator",
		},
		{
			name: "Stichify",
			href: "/unstitched-studio",
			icon: <Scissors />,
			description: "Unstitched → Stitched Try-On",
		},
	
		{
			name: "ModelHub",
			href: "/model",
			icon: <Clapperboard />,
			description: "Create Photorealistic Fashion Model Images with Custom Attribute",
		},
	];

	const showcaseItems: DropdownItem[] = [
		{
			name: "Model Gallery",
			href: "/model-gallery",
			icon: <GalleryHorizontal />,
			description: "Browse our model portfolio",
		},
		{
			name: "Result Showcase",
			href: "/client-showcase",
			icon: <User />,
			description: "See real client results",
		},
	];

	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className={`fixed  w-full z-50 transition-all duration-300 ${isScrolled
				? "py-2 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
				: "py-4 bg-transparent"
				}`}
		>
			{/* backdrop */}


			<div className="relative max-w-7xl mx-auto px-5 lg:px-8">
				<div className="flex items-center justify-between h-16 lg:h-[68px]">
					{/* Logo */}
					<Link to="/">
						<div className="flex-shrink-0 flex items-center">
							<span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
								<img src="./light-logo.png" className="w-auto h-[60px]" />
							</span>
						</div>
					</Link>

					{/* Desktop Nav */}
					<div className="hidden lg:flex items-center">
						{/* Regular links */}
						{navLinks.map((item) => (
							<Link
								key={item.name}
								to={item.link}
								onClick={() => setActiveLink(item.name.toLowerCase())}
								className={`relative px-3.5 py-2 mx-0.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200
                   ${activeLink === item.name.toLowerCase() ? "text-foreground bg-muted font-medium" : "text-secondary-foreground hover:text-foreground font-semibold hover:bg-foreground/5"}`}
							>
								{activeLink === item.name.toLowerCase() && (
									<motion.span
										layoutId="navPill"
										className="absolute inset-0 rounded-lg bg-background/[0.07]"
										style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
									/>
								)}
								<span className="relative z-10">{item.name}</span>
							</Link>
						))}

						{/* Gallery hover dropdown */}
						<HoverDropdown label="Portfolio" active={activeLink === "model-gallery"} items={showcaseItems} />

						{/* Our Offerings hover dropdown */}
						<HoverDropdown label="Our Offerings" active={activeLink === "our-offerings"} items={dropdownItems} />
					</div>

					{/* Right Actions */}
					<div className="hidden lg:flex items-center gap-3">
						<ThemeToggle />

					{authService.isAuthenticated() && user ? (
						<div className="flex items-center gap-2.5">
							<ProfileDropdown
								user={user}
								effectiveCredits={effectiveCredits}
								onLogout={() => {
									authService.logout();
									dispatch(setUser(null));
								}}
							/>
						</div>
					) : (
							<div className="flex items-center gap-2">
								<Link
									to="/login"
									className="px-4 py-2 rounded-lg text-sm font-semibold text-secondary-foreground hover:text-white bg-background hover:bg-brand-color transition-colors duration-200"
								>
									Login
								</Link>
								<motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
									<Link
										to="/signup"
										className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden"
										style={{
											background: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
											boxShadow: "0 0 20px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
										}}
									>
										<Zap size={13} strokeWidth={2.5} />
										Sign Up
									</Link>
								</motion.div>
							</div>
						)}
					</div>

					{/* Mobile hamburger */}
					<div className="flex lg:hidden items-center gap-4">
						{/* <ThemeToggle /> */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-background/10 text-foreground/60 hover:text-foreground transition-colors duration-200"
						>
							<AnimatePresence mode="wait">
								{isMobileMenuOpen ? (
									<motion.span
										key="x"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<X size={17} color={"var(--foreground)"} />
									</motion.span>
								) : (
									<motion.span
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<Menu size={17} color={"var(--foreground)"} />
									</motion.span>
								)}
							</AnimatePresence>
						</button>
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
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className="lg:hidden overflow-hidden backdrop-blur-sm border-t border-white/[0.06]"
						style={{ background: "var(--background)", backdropFilter: "blur(20px)" }}
					>
						<div className="px-4 py-4 space-y-1">
							{navLinks.map((item, index) => (
								<motion.div
									key={item.name}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
								>
									<Link
										to={item.link}
										onClick={() => {
											setActiveLink(item.name.toLowerCase());
											setIsMobileMenuOpen(false);
										}}
										className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
									>
										{item.name}
									</Link>
								</motion.div>
							))}

							{/* Mobile Our Offerings */}
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: navLinks.length * 0.05 }}
							>
								<button
									onClick={() => setMobileOfferingsOpen(!mobileOfferingsOpen)}
									className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
								>
									Our Offerings
									<motion.span animate={{ rotate: mobileOfferingsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
										<ChevronDown size={14} />
									</motion.span>
								</button>
								<AnimatePresence>
									{mobileOfferingsOpen && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="ml-4 mt-1 space-y-0.5 overflow-hidden"
										>
											{dropdownItems.map((item) => (
												<Link
													key={item.href}
													to={item.href}
													onClick={() => { setMobileOfferingsOpen(false); setIsMobileMenuOpen(false); }}
													className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-foreground hover:text-foreground hover:bg-background/5 transition-all"
												>
													<span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-cyan-400/70">
														{React.cloneElement(item.icon as React.ReactElement, { size: 13 })}
													</span>
													{item.name}
												</Link>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>

							{/* Mobile Gallery */}
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: (navLinks.length + 1) * 0.05 }}
							>
								<button
									onClick={() => setMobileGalleryOpen(!mobileGalleryOpen)}
									className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:text-foreground hover:bg-secondary transition-all"
								>
									Portfolio
									<motion.span animate={{ rotate: mobileGalleryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
										<ChevronDown size={14} />
									</motion.span>
								</button>
								<AnimatePresence>
									{mobileGalleryOpen && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="ml-4 mt-1 space-y-0.5 overflow-hidden"
										>
											{showcaseItems.map((item) => (
												<Link
													key={item.href}
													to={item.href}
													onClick={() => { setMobileGalleryOpen(false); setIsMobileMenuOpen(false); }}
													className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-foreground hover:text-foreground hover:bg-secondary transition-all"
												>
													<span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-cyan-400/70">
														{React.cloneElement(item.icon as React.ReactElement, { size: 13 })}
													</span>
													{item.name}
												</Link>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>

							{/* Mobile Auth */}
							<>
						{authService.isAuthenticated() && (
								<div className="pt-3 border-t border-border mt-3">
									<div className="px-4 py-2 flex flex-col gap-2">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-semibold text-foreground">
												{user?.username}
												{user?.role === "user" && (
													<span className="text-cyan-500 ml-2 text-xs">{effectiveCredits} {user.teamId ? "team credits" : "credits"}</span>
												)}
											</span>
										</div>
										<Link
											to="/credit"
											onClick={() => setIsMobileMenuOpen(false)}
											className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-secondary-foreground hover:text-foreground hover:bg-secondary transition-all"
										>
											<Zap size={14} className="text-cyan-400" />
											Credits
										</Link>
										<Link
											to="/billing"
											onClick={() => setIsMobileMenuOpen(false)}
											className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-secondary-foreground hover:text-foreground hover:bg-secondary transition-all"
										>
											<CreditCard size={14} className="text-cyan-400" />
											Billing
										</Link>
										<Link
											to="/generated-model"
											onClick={() => setIsMobileMenuOpen(false)}
											className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-secondary-foreground hover:text-foreground hover:bg-secondary transition-all"
										>
											<Database size={14} className="text-cyan-400" />
											Generated Models
										</Link>
										{user?.role === "admin" && (
											<Link
												to="/admin"
												onClick={() => setIsMobileMenuOpen(false)}
												className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-secondary-foreground hover:text-foreground hover:bg-secondary transition-all"
											>
												<Shield size={14} className="text-cyan-400" />
												Admin Dashboard
											</Link>
										)}
										<button
											onClick={() => { authService.logout(); dispatch(setUser(null)); }}
											className="flex items-center gap-3 px-3 py-2 mt-2 rounded-xl text-sm text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all text-left w-full"
										>
											<LogOut size={14} />
											Logout
										</button>
									</div>
								</div>
							)
								}
							</>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.nav>
	);
};

export default Navbar;
