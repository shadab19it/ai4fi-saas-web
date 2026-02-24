// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
// 	Menu,
// 	X,
// 	ChevronRight,
// 	Zap,
// 	User,
// 	ChevronDown,
// 	Sparkles,
// 	Layers,
// 	Clapperboard,
// 	GalleryHorizontal,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import authService from "../../../services/authService";
// import { setUser } from "../../../store/userReducer";
// import { ThemeToggle } from "../../../components/ThemeToggle";


// // ─── Dropdown overlay backdrop blur panel ────────────────────────────────────
// const dropdownVariants = {
// 	hidden: { opacity: 0, y: -8, scale: 0.97 },
// 	visible: {
// 		opacity: 1,
// 		y: 0,
// 		scale: 1,
// 		transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
// 	},
// 	exit: {
// 		opacity: 0,
// 		y: -6,
// 		scale: 0.97,
// 		transition: { duration: 0.15, ease: "easeIn" },
// 	},
// };

// const itemVariants = {
// 	hidden: { opacity: 0, x: -6 },
// 	visible: (i: number) => ({
// 		opacity: 1,
// 		x: 0,
// 		transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" },
// 	}),
// };

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface DropdownItem {
// 	name: string;
// 	href: string;
// 	icon: React.ReactNode;
// 	description?: string;
// }

// // ─── Hover Dropdown Component ─────────────────────────────────────────────────
// const HoverDropdown = ({
// 	label,
// 	items,
// 	accentColor = "cyan",
// }: {
// 	label: string;
// 	items: DropdownItem[];
// 	accentColor?: string;
// }) => {
// 	const [open, setOpen] = useState(false);
// 	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// 	const handleEnter = () => {
// 		if (timeoutRef.current) clearTimeout(timeoutRef.current);
// 		setOpen(true);
// 	};
// 	const handleLeave = () => {
// 		timeoutRef.current = setTimeout(() => setOpen(false), 120);
// 	};

// 	return (
// 		<div
// 			className="relative"
// 			onMouseEnter={handleEnter}
// 			onMouseLeave={handleLeave}
// 		>
// 			{/* Trigger */}
// 			<button
// 				className={`group relative flex items-center gap-1.5 px-3 py-2 mx-1 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200
//           text-white/60 hover:text-white`}
// 			>
// 				<span className="relative z-10">{label}</span>
// 				<motion.span
// 					animate={{ rotate: open ? 180 : 0 }}
// 					transition={{ duration: 0.2 }}
// 					className="relative z-10 opacity-50 group-hover:opacity-100"
// 				>
// 					<ChevronDown size={13} strokeWidth={2.5} />
// 				</motion.span>
// 				{/* underline glow */}
// 				<span
// 					className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-cyan-400 transition-all duration-300 ${open ? "w-full opacity-100" : "w-0 opacity-0"
// 						}`}
// 				/>
// 			</button>

// 			{/* Panel */}
// 			<AnimatePresence>
// 				{open && (
// 					<motion.div
// 						variants={dropdownVariants}
// 						initial="hidden"
// 						animate="visible"
// 						exit="exit"
// 						className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50"
// 						style={{ minWidth: "240px" }}
// 					>
// 						{/* glass card */}
// 						<div
// 							className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
// 							style={{
// 								background:
// 									"linear-gradient(145deg, rgba(10,15,30,0.97) 0%, rgba(5,10,20,0.98) 100%)",
// 								boxShadow:
// 									"0 0 0 1px rgba(6,182,212,0.08), 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.06)",
// 							}}
// 						>
// 							{/* top glow line */}
// 							<div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

// 							<div className="p-2.5">
// 								{items.map((item, i) => (
// 									<motion.div
// 										key={item.href}
// 										custom={i}
// 										variants={itemVariants}
// 										initial="hidden"
// 										animate="visible"
// 									>
// 										<Link
// 											to={item.href}
// 											onClick={() => setOpen(false)}
// 											className="group/item flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200
//                         hover:bg-white/5 text-white/60 hover:text-white"
// 										>
// 											{/* icon container */}
// 											<div
// 												className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
//                           bg-white/5 group-hover/item:bg-cyan-500/15 text-white/40 group-hover/item:text-cyan-400"
// 												style={{
// 													boxShadow:
// 														"inset 0 1px 0 rgba(255,255,255,0.07)",
// 												}}
// 											>
// 												{React.cloneElement(item.icon as React.ReactElement, {
// 													size: 15,
// 													strokeWidth: 1.8,
// 												})}
// 											</div>

// 											<div className="flex flex-col min-w-0">
// 												<span className="text-sm font-semibold leading-tight tracking-wide">
// 													{item.name}
// 												</span>
// 												{item.description && (
// 													<span className="text-xs text-white/30 mt-0.5 leading-snug truncate">
// 														{item.description}
// 													</span>
// 												)}
// 											</div>

// 											<ChevronRight
// 												size={12}
// 												className="ml-auto opacity-0 group-hover/item:opacity-40 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-200 flex-shrink-0"
// 											/>
// 										</Link>
// 									</motion.div>
// 								))}
// 							</div>

// 							{/* bottom glow */}
// 							<div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
// 						</div>

// 						{/* caret */}
// 						<div
// 							className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 rounded-sm border-t border-l border-white/10"
// 							style={{ background: "rgba(10,15,30,0.97)" }}
// 						/>
// 					</motion.div>
// 				)}
// 			</AnimatePresence>
// 		</div>
// 	);
// };


// const Navbar = () => {
// 	const dispatch = useDispatch();
// 	const { user } = useSelector((state: RootState) => state.user);
// 	const [isScrolled, setIsScrolled] = useState(false);
// 	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// 	const [activeLink, setActiveLink] = useState("home");
// 	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// 	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
// 	const [mobileOfferingsOpen, setMobileOfferingsOpen] = useState(false);
// 	const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);


// 	useEffect(() => {
// 		if (typeof window !== "undefined") {
// 			if (window.location.pathname === "/") {
// 				setActiveLink("home");
// 			} else if (window.location.pathname === "/about") {
// 				setActiveLink("about");
// 			} else if (window.location.pathname === "/model-gallery") {
// 				setActiveLink("gallery");
// 			} else if (window.location.pathname === "/contact") {
// 				setActiveLink("contact");
// 			}
// 		}
// 		const handleScroll = () => {
// 			setIsScrolled(window.scrollY > 20);
// 		};
// 		window.addEventListener("scroll", handleScroll);
// 		return () => window.removeEventListener("scroll", handleScroll);
// 	}, []);

// 	const navLinks = [
// 		{ name: "Home", icon: "home", link: "/", isLink: true },
// 		// { name: "Features", icon: "features", link: "/#features", isLink: false },
// 		{ name: "About", icon: "about", link: "/about", isLink: true },
// 		{ name: "Pricing", icon: "pricing", link: "/pricing", isLink: true },
// 		// {
// 		// 	name: "Portfolio",
// 		// 	icon: "gallery",
// 		// 	link: "/model-gallery",
// 		// 	isLink: true,
// 		// },
// 		{ name: "Contact", icon: "contact", link: "/contact", isLink: true },
// 	];

// 	const dropdownItems = [
// 		{ name: "Model Generator", href: "/model", icon: <Sparkles size={14} /> },
// 		{
// 			name: "Virtual Try Room",
// 			href: "/virtualtryon",
// 			icon: <Layers size={14} />,
// 		},
// 		{
// 			name: "Try On V2 (beta)",
// 			href: "/try-on-v2-beta",
// 			icon: <Zap size={14} />,
// 		},
// 		{
// 			name: "Ads Generator",
// 			href: "/ads-generator",
// 			icon: <Clapperboard size={14} />,
// 		},
// 	];
// 	const showcaseItems = [
// 		{ name: "Portfolio", href: "/model-gallery", icon: <Sparkles size={14} /> },
// 		{
// 			name: "Client Showcase",
// 			href: "/client-showcase",
// 			icon: <GalleryHorizontal size={14} />,
// 		},
// 	];

// 	return (
// <motion.nav
// 	initial={{ y: -20, opacity: 0 }}
// 	animate={{ y: 0, opacity: 1 }}
// 	transition={{ duration: 0.5 }}
// 	className={`fixed  w-full z-50 transition-all duration-300 ${isScrolled
// 		? "py-2 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
// 		: "py-4 bg-transparent"
// 		}`}
// >
// 			<div className="lg:max-w-[var(--content-width)] max-w-[calc(100vw-20px)] mx-auto px-4 sm:px-6 lg:px-8">
// 				<div className="flex items-center justify-between">
// 					{/* Logo */}
// <Link to="/">
// 	<div className="flex-shrink-0 flex items-center">
// 		<span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
// 			<img src="./light-logo.png" className="w-auto h-[60px]" />
// 		</span>
// 	</div>
// </Link>

// 					{/* Desktop Navigation */}
// 					<div className="hidden md:flex items-center space-x-1">
// 						{navLinks.map((item) => {
// 							if (item.isLink) {
// 								return (
// 									<Link to={`${item.link}`}>
// 										<motion.span
// 											key={item.name}
// 											className={`relative px-3 py-2 mx-1 rounded-lg transition-colors duration-200
//                     ${activeLink === item.name.toLowerCase() ? "text-foreground font-medium" : "text-secondary-foreground hover:text-foreground font-semibold hover:bg-foreground/5"}`}
// 											onClick={() => setActiveLink(item.name.toLowerCase())}
// 											whileHover={{ scale: 1.05 }}
// 											whileTap={{ scale: 0.95 }}
// 										>
// 											{activeLink === item.name.toLowerCase() && (
// 												<motion.span
// 													layoutId="activeNavIndicator"
// 													className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-sky-500/20"
// 													initial={{ opacity: 0 }}
// 													animate={{ opacity: 1 }}
// 													transition={{ duration: 0.2 }}
// 												/>
// 											)}
// 											<span className="relative z-10">{item.name}</span>
// 										</motion.span>
// 									</Link>
// 								);
// 							} else {
// 								return (
// 									<a href={`${item.link}`}>
// 										<motion.span
// 											key={item.name}
// 											className={`relative px-3 py-2 mx-1  rounded-lg transition-colors duration-200
//                     ${activeLink === item.name.toLowerCase() ? "text-foreground font-medium" : "text-secondary-foreground hover:text-foreground hover:bg-foreground/5"}`}
// 											onClick={() => setActiveLink(item.name.toLowerCase())}
// 											whileHover={{ scale: 1.05 }}
// 											whileTap={{ scale: 0.95 }}
// 										>
// 											{activeLink === item.name.toLowerCase() && (
// 												<motion.span
// 													layoutId="activeNavIndicator"
// 													className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-sky-500/20"
// 													initial={{ opacity: 0 }}
// 													animate={{ opacity: 1 }}
// 													transition={{ duration: 0.2 }}
// 												/>
// 											)}
// 											<span className="relative z-10">{item.name}</span>
// 										</motion.span>
// 									</a>
// 								);
// 							}
// 						})}
// 						{/* <div className="relative  z-50">
// 							<motion.button
// 								onClick={() => {
// 									setIsDropdownOpen(false);
// 									setIsGalleryOpen(!isGalleryOpen);
// 								}}
// 								className="relative px-3 py-2 mx-1 rounded-lg transition-colors duration-200 text-secondary-foreground font-semibold hover:text-foreground hover:bg-foreground/5 flex items-center"
// 								whileHover={{ scale: 1.05 }}
// 								whileTap={{ scale: 0.95 }}
// 							>
// 								<span>Gallery</span>
// 								<ChevronDown size={16} className="ml-1" />
// 							</motion.button>
// 							<AnimatePresence>
// 								{isGalleryOpen && (
// 									<motion.div
// 										initial={{ opacity: 0, y: -10 }}
// 										animate={{ opacity: 1, y: 0 }}
// 										exit={{ opacity: 0, y: -10 }}
// 										transition={{ duration: 0.2 }}
// 										className="absolute z-[100000] top-full left-0 right-64 mt-2 w-48 h-auto bg-muted backdrop-blur-xl border border-border grid grid-cols-1 gap-2 px-2 py-4 rounded-lg shadow-lg "
// 									>
// 										{showcaseItems.map((item) => (
// 											<Link
// 												to={item.href}
// 												onClick={() => {
// 													setIsGalleryOpen(false);
// 												}}
// 											>
// 												<div className="flex items-center gap-2 px-2 hover:bg-background rounded-lg">
// 													<div className="p-2 border border-border rounded-lg bg-background text-foreground">
// 														{item.icon}
// 													</div>
// 													<motion.span
// 														key={item.name}
// 														className="block py-3  text-secondary-foreground hover:text-foreground  transition-colors duration-200"
// 														onClick={() => {
// 															setIsDropdownOpen(false);
// 															setIsGalleryOpen(false);
// 														}}
// 													>
// 														{item.name}
// 													</motion.span>
// 												</div>
// 											</Link>
// 										))}
// 									</motion.div>
// 								)}
// 							</AnimatePresence>
// 						</div> */}
// 						{/* Our Offerings Dropdown */}
// 						{/* <div className="relative  z-50">
// 							<motion.button
// 								onClick={() => {
// 									setIsGalleryOpen(false);
// 									setIsDropdownOpen(!isDropdownOpen);
// 								}}
// 								className="relative px-3 py-2 mx-1 rounded-lg transition-colors duration-200 text-secondary-foreground font-semibold hover:text-foreground hover:bg-foreground/5 flex items-center"
// 								whileHover={{ scale: 1.05 }}
// 								whileTap={{ scale: 0.95 }}
// 							>
// 								<span>Our Offerings</span>
// 								<ChevronDown size={16} className="ml-1" />
// 							</motion.button>
// 							<AnimatePresence>
// 								{isDropdownOpen && (
// 									<motion.div
// 										initial={{ opacity: 0, y: -10 }}
// 										animate={{ opacity: 1, y: 0 }}
// 										exit={{ opacity: 0, y: -10 }}
// 										transition={{ duration: 0.2 }}
// 										className="absolute z-[100000] top-full left-0 right-64 mt-2 w-[450px] h-[150px] bg-muted backdrop-blur-xl border border-border grid grid-cols-2 gap-2 place-items-center  rounded-lg shadow-lg "
// 									>
// 										{dropdownItems.map((item) => (
// 											<Link to={item.href}>
// 												<div className="flex items-center gap-2 px-2 hover:bg-background rounded-lg">
// 													<div className="p-2 border border-border rounded-lg bg-background text-foreground">
// 														{item.icon}
// 													</div>
// 													<motion.span
// 														key={item.name}
// 														className="block py-3  text-secondary-foreground hover:text-foreground  transition-colors duration-200"
// 														onClick={() => setIsDropdownOpen(false)}
// 													>
// 														{item.name}
// 													</motion.span>
// 												</div>
// 											</Link>
// 										))}
// 									</motion.div>
// 								)}
// 							</AnimatePresence>
// 						</div> */}

// 						<motion.div
// 							initial={{ opacity: 0, x: -10 }}
// 							animate={{ opacity: 1, x: 0 }}
// 							transition={{ delay: navLinks.length * 0.05 }}
// 						>
// 							<button
// 								onClick={() => setMobileOfferingsOpen(!mobileOfferingsOpen)}
// 								className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-background/5 transition-all"
// 							>
// 								Our Offerings
// 								<motion.span animate={{ rotate: mobileOfferingsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
// 									<ChevronDown size={14} />
// 								</motion.span>
// 							</button>
// 							<AnimatePresence>
// 								{mobileOfferingsOpen && (
// 									<motion.div
// 										initial={{ opacity: 0, height: 0 }}
// 										animate={{ opacity: 1, height: "auto" }}
// 										exit={{ opacity: 0, height: 0 }}
// 										className="ml-4 mt-1 space-y-0.5 overflow-hidden"
// 									>
// 										{dropdownItems.map((item) => (
// 											<Link
// 												key={item.href}
// 												to={item.href}
// 												onClick={() => { setMobileOfferingsOpen(false); setIsMobileMenuOpen(false); }}
// 												className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-foreground/50 hover:text-foreground hover:bg-background/5 transition-all"
// 											>
// 												<span className="w-7 h-7 rounded-lg bg-background/5 flex items-center justify-center text-foreground">
// 													{React.cloneElement(item.icon as React.ReactElement, { size: 13 })}
// 												</span>
// 												{item.name}
// 											</Link>
// 										))}
// 									</motion.div>
// 								)}
// 							</AnimatePresence>
// 						</motion.div>

// 						{/* Mobile Gallery */}
// 						<motion.div
// 							initial={{ opacity: 0, x: -10 }}
// 							animate={{ opacity: 1, x: 0 }}
// 							transition={{ delay: (navLinks.length + 1) * 0.05 }}
// 						>
// 							<button
// 								onClick={() => setMobileGalleryOpen(!mobileGalleryOpen)}
// 								className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-background/5 transition-all"
// 							>
// 								Gallery
// 								<motion.span animate={{ rotate: mobileGalleryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
// 									<ChevronDown size={14} />
// 								</motion.span>
// 							</button>
// 							<AnimatePresence>
// 								{mobileGalleryOpen && (
// 									<motion.div
// 										initial={{ opacity: 0, height: 0 }}
// 										animate={{ opacity: 1, height: "auto" }}
// 										exit={{ opacity: 0, height: 0 }}
// 										className="ml-4 mt-1 space-y-0.5 overflow-hidden"
// 									>
// 										{showcaseItems.map((item) => (
// 											<Link
// 												key={item.href}
// 												to={item.href}
// 												onClick={() => { setMobileGalleryOpen(false); setIsMobileMenuOpen(false); }}
// 												className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-foreground/50 hover:text-foreground hover:bg-background/5 transition-all"
// 											>
// 												<span className="w-7 h-7 rounded-lg bg-background/5 flex items-center justify-center text-cyan-400/70">
// 													{React.cloneElement(item.icon as React.ReactElement, { size: 13 })}
// 												</span>
// 												{item.name}
// 											</Link>
// 										))}
// 									</motion.div>
// 								)}
// 							</AnimatePresence>
// 						</motion.div>

// 					</div>

// 					{/* CTA Button or User Profile */}
// 					<div className="hidden md:flex items-center gap-4">
// 						<ThemeToggle />
// 						{authService.isAuthenticated() && user ? (
// 							<div className="flex gap-2">
// 								<motion.div
// 									whileHover={{ scale: 1.05 }}
// 									className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20"
// 								>
// 									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 flex items-center justify-center">
// 										<User size={16} className="text-white" />
// 									</div>
// 									<span className=" font-medium text-foreground">
// 										{user?.username}{" "}
// 										{user?.role === "user" &&
// 											`- Points ${user.subscription.points}`}
// 									</span>
// 								</motion.div>
// 								<motion.div
// 									onClick={() => {
// 										authService.logout();
// 										dispatch(setUser(null));
// 									}}
// 									whileHover={{ scale: 1.05 }}
// 									className=" cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20"
// 								>
// 									<span className=" font-medium text-foreground">Logout</span>
// 								</motion.div>
// 							</div>
// 						) : (
// 							<div className="flex gap-3">
// 								<Link to="/login">
// 									<motion.div
// 										whileHover={{ scale: 1.05 }}
// 										className=" cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20"
// 									>
// 										<span className=" font-medium text-foreground">Login</span>
// 									</motion.div>
// 								</Link>
// 								<Link to="/signup">
// 									<motion.button
// 										whileHover={{
// 											scale: 1.05,
// 											boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
// 										}}
// 										whileTap={{ scale: 0.95 }}
// 										onClick={() => { }}
// 										className="bg-brand-color text-white px-6 py-2.5 rounded-xl font-medium  transition-all duration-300 flex items-center gap-2 "
// 									>
// 										<span>SignUp</span>
// 									</motion.button>
// 								</Link>
// 							</div>
// 						)}
// 					</div>

// 					{/* Mobile Menu Button */}
// 					<div className="md:hidden flex items-center gap-2">
// 						<ThemeToggle />
// 						<motion.button
// 							whileTap={{ scale: 0.9 }}
// 							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// 							className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/10 to-sky-500/10 text-cyan-400 hover:text-white"
// 						>
// 							{isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
// 						</motion.button>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Mobile Menu */}
// 			<AnimatePresence>
// 				{isMobileMenuOpen && (
// 					<motion.div
// 						initial={{ opacity: 0, height: 0 }}
// 						animate={{ opacity: 1, height: "auto" }}
// 						exit={{ opacity: 0, height: 0 }}
// 						transition={{ duration: 0.3 }}
// 						className="md:hidden "
// 					>
// 						<motion.div
// 							initial={{ opacity: 0, y: -20 }}
// 							animate={{ opacity: 1, y: 0 }}
// 							transition={{ delay: 0.1, staggerChildren: 0.1 }}
// 							className="px-4 pt-2 pb-6 space-y-1 bg-background/95 backdrop-blur-xl border-b border-border"
// 						>
// 							{navLinks.map((item, index) => (
// 								<motion.a
// 									key={item.name}
// 									href={`${item.link}`}
// 									className={`block px-4 py-3 rounded-lg  font-medium transition-colors duration-200 ${activeLink === item.name.toLowerCase()
// 										? "bg-muted text-foreground"
// 										: "text-secondary-foreground hover:text-secondary-foreground hover:bg-foreground/5"
// 										}`}
// 									onClick={() => {
// 										setActiveLink(item.name.toLowerCase());
// 										setIsMobileMenuOpen(false);
// 									}}
// 									initial={{ opacity: 0, y: -10 }}
// 									animate={{ opacity: 1, y: 0 }}
// 									transition={{ delay: 0.1 * index }}
// 								>
// 									{item.name}
// 								</motion.a>
// 							))}
// 							{/* Our Offerings Dropdown in Mobile Menu */}
// 							<div className="pt-2 mb-8">
// 								<motion.button
// 									onClick={() => {
// 										setIsGalleryOpen(false);
// 										setIsDropdownOpen(!isDropdownOpen);
// 									}}
// 									className="w-full px-4 py-3 rounded-lg  font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200 flex items-center justify-between"
// 									initial={{ opacity: 0, y: -10 }}
// 									animate={{ opacity: 1, y: 0 }}
// 									transition={{ delay: 0.1 * navLinks.length }}
// 								>
// 									<span>Our Offerings</span>
// 									<ChevronDown
// 										size={16}
// 										className={`transform ${isDropdownOpen ? "rotate-180" : ""}`}
// 									/>
// 								</motion.button>
// 								<AnimatePresence>
// 									{isDropdownOpen && (
// 										<motion.div
// 											initial={{ opacity: 0, height: 0 }}
// 											animate={{ opacity: 1, height: "auto" }}
// 											exit={{ opacity: 0, height: 0 }}
// 											transition={{ duration: 0.2 }}
// 											className="pl-4"
// 										>
// 											{dropdownItems.map((item) => (
// 												<motion.a
// 													key={item.name}
// 													href={item.href}
// 													className="block px-4 py-3  text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
// 													onClick={() => {
// 														setIsDropdownOpen(false);
// 														setIsMobileMenuOpen(false);
// 													}}
// 													initial={{ opacity: 0, y: -10 }}
// 													animate={{ opacity: 1, y: 0 }}
// 													transition={{ delay: 0.1 }}
// 												>
// 													{item.name}
// 												</motion.a>
// 											))}
// 										</motion.div>
// 									)}
// 								</AnimatePresence>
// 							</div>
// 							<motion.div
// 								initial={{ opacity: 0, y: -10 }}
// 								animate={{ opacity: 1, y: 0 }}
// 								transition={{ delay: 0.5 }}
// 							>
// 								{authService.isAuthenticated() ? (
// 									<div>
// 										<div
// 											className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-gray-100 "
// 											onClick={() => {
// 												authService.logout();
// 												dispatch(setUser(null));
// 											}}
// 										>
// 											Logout
// 										</div>
// 										<div className="flex items-center gap-3 px-4 py-3 rounded-xl mt-4 bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20">
// 											<div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 flex items-center justify-center">
// 												<User size={16} className="text-white" />
// 											</div>
// 											<span className=" font-medium text-white">
// 												{user?.username}{" "}
// 												{user?.role === "user" &&
// 													`- Points ${user.subscription.points}`}
// 											</span>
// 										</div>
// 									</div>
// 								) : (
// 									<Link to="/login">
// 										<button
// 											onClick={() => { }}
// 											className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 "
// 										>
// 											<span>Virtual Try Room</span>
// 											<ChevronRight size={16} />
// 										</button>
// 									</Link>
// 								)}
// 							</motion.div>
// 						</motion.div>
// 					</motion.div>
// 				)}
// 			</AnimatePresence>
// 		</motion.nav>
// 	);
// };

// export default Navbar;



"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, Zap, User, ChevronDown, Sparkles, Layers, Clapperboard, GalleryHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeLink, setActiveLink] = useState("home");
	const [mobileOfferingsOpen, setMobileOfferingsOpen] = useState(false);
	const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const path = window.location.pathname;
			if (path === "/") setActiveLink("home");
			else if (path === "/about") setActiveLink("about");
			else if (path === "/model-gallery") setActiveLink("gallery");
			else if (path === "/contact") setActiveLink("contact");
			else if (path === "/pricing") setActiveLink("pricing");
			else if (path === "/model-gallery") setActiveLink("model-gallery");
			else if (path === "/client-showcase") setActiveLink("client-showcase");
		}
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [window.location.pathname]);

	const navLinks = [
		{ name: "Home", link: "/", isLink: true },
		{ name: "About", link: "/about", isLink: true },
		{ name: "Pricing", link: "/pricing", isLink: true },
		{ name: "Contact", link: "/contact", isLink: true },
	];

	const dropdownItems: DropdownItem[] = [
		{
			name: "Model Generator",
			href: "/model",
			icon: <Sparkles />,
			description: "AI-powered fashion model creation",
		},
		{
			name: "Virtual Try Room",
			href: "/virtualtryon",
			icon: <Layers />,
			description: "Try outfits in real-time",
		},
		{
			name: "Trial Room",
			href: "/trial-room",
			icon: <Zap />,
			description: "Next-gen fitting experience",
		},
		{
			name: "Ads Generator",
			href: "/ads-generator",
			icon: <Clapperboard />,
			description: "Create stunning ad visuals",
		},
	];

	const showcaseItems: DropdownItem[] = [
		{
			name: "Portfolio",
			href: "/model-gallery",
			icon: <GalleryHorizontal />,
			description: "Browse our model portfolio",
		},
		{
			name: "Client Showcase",
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
						<HoverDropdown label="Gallery" active={activeLink === "model-gallery"} items={showcaseItems} />

						{/* Our Offerings hover dropdown */}
						<HoverDropdown label="Our Offerings" active={activeLink === "our-offerings"} items={dropdownItems} />
					</div>

					{/* Right Actions */}
					<div className="hidden lg:flex items-center gap-3">
						{/* <ThemeToggle /> */}

						{authService.isAuthenticated() && user ? (
							<div className="flex items-center gap-2.5">
								<div
									className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-white/10"
									style={{ background: "rgba(6,182,212,0.06)" }}
								>
									<div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center">
										<User size={11} className="text-white" />
									</div>
									<span className="text-sm font-semibold text-white/80">
										{user?.username}
									</span>
									{user?.role === "user" && (
										<span className="text-xs text-cyan-400/70 font-medium">
											{user.subscription.points} pts
										</span>
									)}
								</div>
								<motion.button
									onClick={() => {
										authService.logout();
										dispatch(setUser(null));
									}}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200"
								>
									Logout
								</motion.button>
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
									Gallery
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
									<div className="pt-3 border-t border-white/[0.06]">

										<div className="flex items-center justify-between px-4 py-3">
											<span className="text-sm font-semibold text-white/70">
												{user?.username}
												{user?.role === "user" && (
													<span className="text-cyan-400 ml-2 text-xs">{user.subscription.points} pts</span>
												)}
											</span>
											<button
												onClick={() => { authService.logout(); dispatch(setUser(null)); }}
												className="text-sm text-white/40 hover:text-white transition-colors"
											>
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
