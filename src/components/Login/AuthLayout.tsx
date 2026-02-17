import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { FC } from "react";
import { Link } from "react-router-dom";

const AuthLayout: FC<{
	mode?: "login" | "signup";
	customForm?: React.ReactNode;
	onSubmit?: () => void;
}> = ({ mode = "login", customForm, onSubmit }) => {
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
	return (
		<div className="h-screen w-full flex items-stretch justify-center bg-background font-sans overflow-hidden">
			<div className="w-full grid grid-cols-1 md:grid-cols-2 bg-background overflow-hidden">
				<div className="hidden md:block relative bg-slate-950 overflow-hidden">
					<Slider {...settings} className="h-full auth-slider">
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
					</Slider>
				</div>

				{/* RIGHT SECTION: BRANDING & VISUALS */}

				<div className="p-8 md:p-0 flex flex-col justify-center w-full mx-auto md:w-[500px] bg-background">
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
						<h1 className="text-4xl text-center font-bold text-foreground">
							{isLogin ? "Welcome back." : "Create an account."}
						</h1>
						<p className="text-muted-foreground text-center mt-2 text-lg">
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
									<label className="block text-sm font-semibold text-foreground">
										Email Address
									</label>
									<input
										type="email"
										placeholder="name@company.com"
										className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:ring-2 focus:ring-brand outline-none transition-all"
									/>
								</div>
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-foreground">
										Password
									</label>
									<input
										type="password"
										placeholder="••••••••"
										className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:ring-2 focus:ring-brand outline-none transition-all"
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
			</div>
		</div>
	);
};

export default AuthLayout;
