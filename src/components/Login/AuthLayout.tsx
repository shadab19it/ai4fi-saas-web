import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { FC, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../common/ScrollToTop";

const AuthLayout: FC<{
	mode?: "login" | "signup";
	customForm?: React.ReactNode;
	onSubmit?: () => void;
}> = ({ mode = "login", customForm, onSubmit }) => {
	const videoRef = useRef<HTMLVideoElement>(null)

	const isLogin = mode === "login";
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: false,
		fade: true,
		cssEase: "linear",

		dotsClass: "slick-dots !bottom-4",
	};
	const images = [
		{
			image: "/login_1.png",
			label: "",
			title: "Virtual Trial Room",
			description: "Upload, Generate, Inspire",
		},
		{
			image: "/login_2.png",
			label: "",
			title: "Virtual Photo Studio",
			description: "Visualize, Innovate, Launch",
		},
		{
			image: "/login_3.png",
			label: "",
			title: "AI Ad Generator",
			description: "Visualize, Iterate, Convert",
		},
	];


	useEffect(() => {
		const video = videoRef.current
		if (video) {
			// Set webkit-playsinline for older iOS versions
			video.setAttribute('webkit-playsinline', 'true')
			video.setAttribute('playsinline', 'true')

			// Force play on iOS devices
			const playPromise = video.play()
			if (playPromise !== undefined) {
				playPromise.catch(() => {
					// Auto-play was prevented, try again on user interaction
					const handleUserInteraction = () => {
						video.play().catch(() => {
							// Silently handle if still prevented
						})
						document.removeEventListener('touchstart', handleUserInteraction)
						document.removeEventListener('click', handleUserInteraction)
					}
					document.addEventListener('touchstart', handleUserInteraction, { once: true })
					document.addEventListener('click', handleUserInteraction, { once: true })
				})
			}
		}
	}, [])
	return (
		<div className="h-screen w-full  flex items-stretch bg-[#000] justify-center  font-sans overflow-hidden">
			<ScrollToTop />
			<div className="fixed inset-0 z-0">
				{[...Array(80)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-white rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animation: `twinkle ${2 + Math.random() * 3}s infinite`,
							animationDelay: `${Math.random() * 2}s`,
						}}
					/>
				))}

				{/* Gradient glows */}
				{/* <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r rounded-full blur-3xl opacity-15 animate-pulse"></div> */}
				{/* <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r  rounded-full blur-3xl opacity-15 animate-pulse"></div> */}
			</div>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 bg-black overflow-hidden">


				{/* RIGHT SECTION: BRANDING & VISUALS */}


				<div className="p-8 md:p-0 flex relative z-10 flex-col justify-center w-full mx-auto md:w-[500px] bg-black">
					<div className="mb-2">
						<Link to="/">
							<div className="flex-shrink-0 flex items-center justify-center">
								{/* <div className='w-8 h-8 mr-2 bg-gradient-to-br from-cyan-400 to-sky-600 rounded-lg flex items-center justify-center'>
                            <Zap size={18} className='text-white' />
                          </div> */}
								<span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
									<img src="./light-logo.png" className="w-auto h-[60px]" />
								</span>
							</div>
						</Link>
					</div>

					<div className="mb-8">
						<h1 className="text-4xl text-center font-bold text-white">
							{isLogin ? "Welcome back." : "Create an account."}
						</h1>
						<p className="text-white text-center mt-2 text-lg">
							{isLogin
								? "Glad to see you again! Please log in."
								: "Start your journey with AI-powered insights."}
						</p>
					</div>

					{/* Dynamic Form Content via Props */}
					<div className="space-y-4">
						{customForm ? (
							customForm
						) : (
							<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-white">
										Email Address
									</label>
									<input
										type="email"
										placeholder="name@company.com"
										className="w-full px-4 py-3 rounded-xl auth-input transition-all"
									/>
								</div>
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-white">
										Password
									</label>
									<input
										type="password"
										placeholder="••••••••"
										className="w-full px-4 py-3 rounded-xl auth-input transition-all"
									/>
								</div>

								<button className="w-full py-3 bg-brand text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity mt-4">
									{isLogin ? "Sign In" : "Get Started"}
								</button>
							</form>
						)}
					</div>

					<div className="mt-8 pt-6 border-t border-border text-center">
						<p className="text-sm font-normal text-muted-foreground">
							{isLogin ? "Don't have an account?" : "Already have an account?"}
							<Link to={isLogin ? "/signup" : "/login"}>
								<button className="ml-1 text-brand font-bold hover:underline">
									{isLogin ? "Sign Up" : "Log In"}
								</button>
							</Link>
						</p>
					</div>
				</div>
				<div className="hidden md:block relative overflow-hidden">
					<div className="relative flex items-center h-screen justify-center ">
						<video
							ref={videoRef}
							src="/hero-right-video.mp4"

							autoPlay
							muted
							loop
							playsInline
							preload="auto"
							onLoadedMetadata={(e) => {
								const video = e.currentTarget
								video.play().catch(() => {
									// Silently handle autoplay prevention
								})
							}}
							className="w-[100%]   h-[70vh]  object-contain "
						/>
					</div>
					{/* <Slider {...settings} className="h-full auth-slider">
						{images.map((item) => (
							<div
								key={item.image}
								className="h-screen w-full relative outline-none"
							>
								<img
									src={item.image}
									alt="Background"
									className="w-full h-full object-fit opacity-60"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

								<div className="absolute bottom-20 left-12 right-12 z-10">
									<h3 className="text-sm font-medium text-white tracking-widest uppercase mb-2">
										{item.label}
									</h3>
									<h2 className="text-5xl font-bold leading-tight text-white mb-2">
										{item.title}
									</h2>
									<p className="text-lg font-light opacity-80 italic text-white">
										{item.description}
									</p>
								</div>
							</div>
						))}
					</Slider> */}
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;

