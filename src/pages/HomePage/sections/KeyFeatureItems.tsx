import {
	Activity,
	BrainCircuit,
	ChevronRight,
	ImageIcon,
	MousePointer2,
	Move,
	ScanLine,
	Shirt,
	ShoppingBag,
	UploadCloud,
	User,
	Zap,
	Camera,
	Upload,
	Wand2,
	Palette,
	Sparkles,
	ShoppingCart,
	ArrowRight,
	Settings,
	Monitor,
	Sun,
	Clapperboard,
	Facebook,
	Youtube,
	Chrome,
	Play,
	Megaphone,
	Video,
	Eraser,
} from "lucide-react";

const StepCard = ({ icon: Icon, title, description }) => (
	<div className="flex items-center p-4 bg-background border w-full md:w-fit min-w-full md:min-w-[400px] border-border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
		<div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
			<Icon size={24} strokeWidth={2.5} />
		</div>
		<div className="ml-4 flex-grow">
			<h4 className="text-foreground font-bold text-base">{title}</h4>
			<p className=" text-sm mt-0.5">{description}</p>
		</div>
		<ChevronRight
			className="text-gray-300 group-hover:text-blue-500 transition-colors"
			size={20}
		/>
	</div>
);

// /*
//   Component for the Feature Icons at the bottom right
// */
const FeatureIcon = ({ icon: Icon, title }) => (
	<div className="flex flex-col items-center  justify-center text-center space-y-2 w-20 sm:w-24">
		<div className="text-foreground hover:text-blue-600 transition-colors">
			<Icon size={32} strokeWidth={1.5} />
		</div>
		<span className="text-xs font-medium text-secondary-foreground leading-tight">
			{title}
		</span>
	</div>
);

export const VirtualTrialRoom = () => {
	return (
		<div className="w-full mx-auto mb-28  h-[calc(100vh-120px)]  bg-background font-sans relative overflow-hidden  py-8 px-4 sm:px-4 rounded-3xl border border-border shadow-xl">
			<div className="md:max-w-[80vw]  h-[calc(100vh-120px)] flex flex-col justify-center max-w-[100vw] mx-auto relative z-10">
				{/* Top Tabs */}

				<div className="flex w-full flex-col md:justify-between md:flex-row items-start gap-16">
					{/* LEFT COLUMN: Content & Steps */}
					<div className="w-full lg:w-[45%]  pt-0">
						{/* Header Section */}
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-300 text-white transform -rotate-3">
									<Activity size={32} />
								</div>
								<div>
									<h2 className="text-3xl  text-foreground tracking-tight">
										Virtual Trial Room
									</h2>
									<p className="text-blue-500  mt-1 uppercase">
										AI-Powered Fashion Previews
									</p>
								</div>
							</div>

							<p className="text-foreground max-w-[90%] ">
								Generate instant, photo-realistic previews of your garments on
								diverse AI-generated models.
							</p>
						</div>

						{/* Implementation Steps */}
						<div className="space-y-4 pt-2">
							<h5 className=" text-muted-foreground  tracking-wider mb-2">
								Implementation Steps
							</h5>
							<StepCard
								icon={User}
								title="Choose AI model representation"
								description="Select diverse AI-generated models"
							/>
							<StepCard
								icon={UploadCloud}
								title="Upload garment images"
								description="Easily upload photos of your clothing"
							/>
							<StepCard
								icon={Zap}
								title="Instant preview generation"
								description="Get photo-realistic previews in seconds"
							/>
						</div>

						{/* CTA Button */}
						<button className="mt-4 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-500/30 transition-transform hover:-translate-y-1 w-full sm:w-auto">
							Get Started
						</button>
					</div>

					{/* RIGHT COLUMN: Monitor & Visuals */}
					<div className="w-full lg:w-[55%] relative">
						{/* Monitor Frame */}
						<div className="relative bg-secondary rounded-2xl shadow-2xl border-4 border-border overflow-hidden z-10">
							{/* Browser/App Toolbar */}
							<div className="bg-background/50 border-b border-border px-4 py-2 flex items-center gap-2">
								<div className="flex gap-1.5">
									<div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
								</div>
								<div className="mx-auto bg-gray-200 rounded-full w-1/3 h-1.5 opacity-50"></div>
							</div>

							{/* App UI Simulation */}
							<div className="flex h-[250px] md:h-[400px] bg-slate-50">
								{/* Sidebar */}
								<div className="w-1/3 bg-background border-r border-border p-4 space-y-4">
									<div className="h-2 w-20 bg-secondary rounded mb-4"></div>

									{/* Fake UI Elements */}
									<div className="space-y-2">
										<div className="text-[10px] font-bold text-gray-400 uppercase">
											Gender
										</div>
										<div className="flex gap-2">
											<div className="h-6 w-full bg-blue-500 rounded text-[10px] text-white flex items-center justify-center">
												Male
											</div>
											<div className="h-6 w-full bg-muted rounded"></div>
										</div>
									</div>

									<div className="space-y-2">
										<div className="text-[10px] font-bold text-muted-foreground uppercase">
											Skin Tone
										</div>
										<div className="flex gap-1">
											<div className="w-4 h-4 rounded-full bg-[#fdece2] border border-border"></div>
											<div className="w-4 h-4 rounded-full bg-[#eabcac]"></div>
											<div className="w-4 h-4 rounded-full bg-[#d29b83]"></div>
											<div className="w-4 h-4 rounded-full bg-[#8d5524]"></div>
										</div>
									</div>

									<div className="pt-2">
										<div className="h-8 w-full bg-blue-500 rounded-lg text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-200">
											Generate Preview
										</div>
										{/* Cursor Graphic */}
										<div className="absolute top-[200px] left-[25%] z-50 drop-shadow-xl">
											<MousePointer2
												fill="white"
												className="text-gray-900 w-8 h-8"
											/>
										</div>
									</div>
								</div>

								{/* Main Content Area */}
								<div className="w-2/3 p-4 bg-secondary relative overflow-hidden flex items-center justify-center">
									{/* We use an image here to simulate the generated models on screen */}
									<img
										src="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=600&q=80"
										className="object-cover w-full h-full rounded shadow-inner opacity-90"
										alt="Dashboard Interface"
									/>
								</div>
							</div>
						</div>

						{/* Monitor Stand Base */}
						<div className="h-4 w-1/3 mx-auto bg-background/50 rounded-b-xl shadow-inner mt-[-2px] relative z-0"></div>
						<div className="h-1 w-1/2 mx-auto bg-background/50 rounded-full blur-sm mt-1"></div>

						{/* Floating Polaroid 1 (Top Left) */}
						<div className="absolute top-[10%] -left-[10%] lg:-left-12 z-20 w-32 bg-background p-2 pb-6 shadow-xl transform -rotate-6 rounded-md">
							<img
								src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200"
								className="rounded bg-gray-200 aspect-[3/4] object-cover"
							/>
						</div>

						{/* Floating Polaroid 2 (Bottom Left) */}
						<div className="absolute top-[45%] -left-[5%] lg:-left-8 z-20 w-36 bg-white p-2 pb-6 shadow-2xl transform rotate-3 rounded-md">
							<img
								src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200"
								className="rounded bg-gray-200 aspect-[3/4] object-cover"
							/>
						</div>

						{/* Bottom Feature Bar */}
						<div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 w-[110%] sm:w-[100%] bg-background rounded-2xl shadow-xl border border-border p-6 flex justify-between items-start z-30">
							<FeatureIcon icon={Shirt} title="200+ Styling Options" />

							{/* Vertical Divider */}
							<div className="h-10 w-px bg-background/80 self-center"></div>

							<FeatureIcon icon={BrainCircuit} title="Smart Dressing AI" />

							<div className="h-10 w-px bg-background/80 self-center"></div>

							<FeatureIcon icon={Move} title="Pose Selection" />

							<div className="hidden sm:block h-10 w-px bg-background/80 self-center"></div>

							<FeatureIcon icon={ShoppingBag} title="Accessories Try-On" />

							<div className="hidden sm:block h-10 w-px bg-background/80 self-center"></div>

							<FeatureIcon icon={ImageIcon} title="Background Change" />

							<div className="hidden sm:block h-10 w-px bg-background/80 self-center"></div>

							<FeatureIcon icon={ScanLine} title="Perfect Fit Preview" />
						</div>
					</div>
				</div>

				{/* Spacing for the bottom overlapping element */}
				{/* <div className="h-24"></div> */}
			</div>
		</div>
	);
};

const StepPhotoCard = ({
	icon: Icon,
	title,
	description,
	colorClass = "bg-blue-500",
}) => (
	<div className="flex items-center w-full min-w-full md:w-fit md:min-w-[500px] p-4 bg-background/80 backdrop-blur-sm border border-border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
		<div
			className={`flex-shrink-0 w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}
		>
			<Icon size={24} strokeWidth={2.5} />
		</div>
		<div className="ml-4 flex-grow">
			<h4 className="  text-base">{title}</h4>
			<p className="text-muted-foreground text-sm mt-0.5">{description}</p>
		</div>
		<ChevronRight
			className="text-gray-300 group-hover:text-foreground transition-colors"
			size={20}
		/>
	</div>
);

export const PhotoStudio = () => (
	<div className="flex flex-col items-center  w-full mb-32 py-8 p-4 mx-auto h-[calc(100vh-120px)] dark:bg-gradient-to-br dark:bg-transparent dark:from-pink-500 dark:via-pink/80 dark:to-fuchsia-600 bg-gradient-to-br from-blue-50 via-white to-blue-50 flex-col lg:flex-row items-start gap-12 relative z-10 rounded-3xl border border-purple-100/50 shadow-xl">
		{/* LEFT COLUMN: Text & Content */}
		<div className="md:max-w-[80vw] max-w-[90vw] h-[calc(100vh-120px)] flex flex-col items-center justify-center mx-auto relative z-10">
			<div className="flex w-full flex-col md:justify-between md:flex-row items-center gap-16">
				<div className="w-full lg:w-[45%]  ">
					{/* Header */}
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300 text-white transform rotate-3">
								<Camera size={32} />
							</div>
							<div>
								<h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
									Photo Studio
								</h2>
								<p className="text-fuchsia-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">
									AI Product Enhancement
								</p>
							</div>
						</div>

						<p className="text-gray-600 ">
							Transform raw product photos into professional, listing-ready
							visuals with automated lighting correction, background styling,
							and marketplace optimization.
						</p>
					</div>

					{/* Steps List */}
					<div className="space-y-4 pt-2">
						<div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
							Implementation Steps
						</div>
						<StepPhotoCard
							icon={Upload}
							title="Upload raw product photos"
							description="Simply drag and drop your photos"
							colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500"
						/>
						<StepPhotoCard
							icon={Wand2}
							title="Enhance lighting & backgrounds"
							description="Improve lighting, background, and shadows"
							colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500"
						/>
						<StepPhotoCard
							icon={ImageIcon}
							title="Generate listing-ready visuals"
							description="Create high-conversion photos for marketplace listings"
							colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500"
						/>
					</div>

					{/* CTA Button */}
					<button className="mt-4 px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-fuchsia-500/30 transition-transform hover:-translate-y-1 w-full sm:w-auto">
						Get Started
					</button>
				</div>

				{/* RIGHT COLUMN: Visuals */}
				<div className="w-full md:w-full lg:w-[55%] relative mt-10 lg:mt-0">
					{/* Marketplace Logos */}

					{/* Main Monitor Mockup */}
					<div className="relative h-auto w-[80%] z-10 mx-auto">
						{/* Monitor Frame */}
						<div className="bg-background rounded-t-2xl shadow-2xl border-[6px] border-gray-800 border-b-0 h-full w-full relative overflow-hidden">
							{/* Screen Content */}
							<img
								src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80"
								alt="Product Studio"
								className="w-full h-full object-cover"
							/>
							{/* Play Button Overlay */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-lg">
									<div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent"></div>
								</div>
							</div>
						</div>
						{/* Monitor Chin */}
						<div className="bg-gray-200 h-8 w-full border-x-[6px] border-b-[6px] border-gray-800 rounded-b-xl flex items-center justify-center">
							<div className="text-2xl"></div>
						</div>
						{/* Monitor Stand */}
						<div className="bg-gray-300 h-16 w-32 mx-auto mt-[-2px] shadow-inner perspective-[500px] transform rotate-x-12"></div>
						<div className="bg-gray-200 h-2 w-48 mx-auto rounded-full shadow-lg mt-[-5px]"></div>

						{/* Floating Card 1: Upload Raw */}
						<div className="absolute top-10 -left-6 lg:-left-12 bg-white p-2 rounded-xl shadow-xl w-40 animate-float-slow">
							<div className="absolute -top-3 -left-3 w-8 h-8 bg-pink-500 text-white font-bold rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
								1
							</div>
							<img
								src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80"
								className="rounded-lg mb-2 h-24 w-full object-cover"
								alt="Raw"
							/>
							<div className="text-[10px] font-bold text-center text-gray-700">
								Upload Raw Photos
							</div>
						</div>

						{/* Floating Card 2: Enhance */}
						<div className="absolute bottom-[40%] rotate-12	 -left-2 lg:-left-8 bg-white p-2 rounded-xl shadow-xl w-40 animate-float-slower">
							<div className="absolute -top-3 -left-3 w-8 h-8 bg-fuchsia-500 text-white font-bold rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
								2
							</div>
							<img
								src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=200&q=80"
								className="rounded-lg mb-2 h-24 w-full object-cover"
								alt="Enhanced"
							/>
							<div className="text-[10px] font-bold text-center text-gray-700">
								Enhance Lighting
							</div>
						</div>
					</div>

					{/* Bottom Flow Process */}
					{/* <div className="mt-8 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg flex justify-between items-center text-center relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-purple-50/50 -z-10"></div>

						<div className="flex flex-col items-center">
							<Camera className="text-slate-700 mb-1" size={20} />
							<span className="text-[10px] font-bold text-slate-600">
								1. Upload Photos
							</span>
						</div>
						<ArrowRight className="text-gray-300" size={16} />
						<div className="flex flex-col items-center">
							<Wand2 className="text-fuchsia-600 mb-1" size={20} />
							<span className="text-[10px] font-bold text-slate-600">
								AI Enhancements
							</span>
						</div>
						<ArrowRight className="text-gray-300" size={16} />
						<div className="flex flex-col items-center">
							<Sparkles className="text-orange-400 mb-1" size={20} />
							<span className="text-[10px] font-bold text-slate-600">
								3. Publish & Sell!
							</span>
						</div>
						<ArrowRight className="text-gray-300" size={16} />
						<div className="flex flex-col items-center">
							<ShoppingCart className="text-pink-600 mb-1" size={20} />
							<span className="text-[10px] font-bold text-slate-600">
								Publish & Sell!
							</span>
						</div>
					</div> */}

					{/* Bottom Features Grid */}
					{/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
						{[
							{
								icon: Sun,
								label: "Lighting Correction",
								color: "text-pink-500",
							},
							{
								icon: Palette,
								label: "Background Styling",
								color: "text-purple-500",
							},
							{
								icon: Sparkles,
								label: "Quality Enhancement",
								color: "text-fuchsia-500",
							},
							{
								icon: ShoppingCart,
								label: "E-commerce Optimization",
								color: "text-slate-600",
							},
						].map((feature, idx) => (
							<div
								key={idx}
								className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white/60 flex flex-col items-center text-center gap-2 hover:bg-white transition-colors"
							>
								<feature.icon className={`${feature.color}`} size={24} />
								<span className="text-xs font-bold text-gray-700 leading-tight">
									{feature.label}
								</span>
							</div>
						))}
					</div> */}
				</div>
			</div>
		</div>
	</div>
);

export const Advertisement = () => (
	<div className="min-h-[100vh] flex flex-col items-center ">
		<div className=" w-full p-4 pt-8 mx-auto items-center justify-center flex-col bg-background h-[calc(100vh-120px)]   relative z-10 animate-fade-in rounded-3xl border border-orange-100/50 shadow-xl">
			<div className="md:max-w-[80vw] max-w-[90vw] flex h-[calc(100vh-120px)] flex-col  justify-center  items-center flex-col mx-auto relative z-10">
				<div className="flex flex-col h-full lg:flex-row justify-between items-start gap-4">
					{/* LEFT COLUMN */}
					<div className="w-[80vw] lg:w-[40%] space-y-2 pt-4">
						{/* Header */}
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-300 text-white transform -rotate-6">
									<Megaphone
										size={30}
										fill="currentColor"
										className="text-white"
									/>
								</div>
								<div>
									<h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
										Advertisement
									</h2>
									<p className="text-orange-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">
										AI Ad Creative Generation
									</p>
								</div>
							</div>

							<p className="text-gray-700 text-lg leading-relaxed font-medium">
								Create high-converting marketing visuals and promotional videos
								using AI-generated models, environments, and automated creative
								production workflows.
							</p>
						</div>

						{/* Steps */}
						<div className="space-y-4 pt-2">
							<div className="text-xs font-bold text-orange-900/50 uppercase tracking-wider mb-2">
								Implementation Steps
							</div>
							<StepPhotoCard
								icon={UploadCloud}
								title="Upload product image"
								description="Simply upload your product photo"
								colorClass="bg-gradient-to-br from-orange-400 to-red-500"
							/>
							<StepPhotoCard
								icon={Eraser}
								title="Clean & prepare visuals"
								description="Enhance, isolate & refresh your product"
								colorClass="bg-gradient-to-br from-orange-400 to-red-500"
							/>
							<StepPhotoCard
								icon={Video}
								title="Generate AI ad creatives"
								description="Create stunning ads photos & videos"
								colorClass="bg-gradient-to-br from-orange-400 to-red-500"
							/>
						</div>

						{/* CTA */}
						<button className="mt-4 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-500/30 transition-transform hover:-translate-y-1 w-full sm:w-auto ring-4 ring-orange-200">
							Get Started
						</button>
					</div>

					{/* RIGHT COLUMN: Complex Visuals */}
					<div className="w-full lg:w-[100%] flex flex-col items-center  relative mt-16 lg:mt-0">
						{/* Text Above Monitor */}
						<h3 className="text-center w-fit text-md sm:text-lg font-bold text-foreground mb-6  backdrop-blur-sm rounded-full py-2 px-6 inline-block mx-auto  border border-border">
							Turn Products into High-Converting Ads with AI.
						</h3>

						<div className="relative flex items-end justify-center">
							{/* Floating Flow Cards (Left of Monitor) */}
							<div className="absolute top-10 left-[-20px] sm:left-0 z-30 flex flex-col gap-12 pointer-events-none hidden sm:flex">
								{/* Card 1: Input */}
								<div className="bg-white/95 p-2 rounded-lg shadow-xl w-32 transform -rotate-12 border-2 border-orange-100 animate-float-slow">
									<div className="relative">
										<span className="absolute -top-2 -left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
											1. Upload
										</span>
										<img
											src="https://images.unsplash.com/photo-1621460245217-37fb2778da5c?auto=format&fit=crop&w=150"
											className="rounded mb-1 h-20 w-full object-cover"
											alt="Can with fruit"
										/>
									</div>
									<div className="text-[9px] font-bold text-center text-gray-600">
										Product Image
									</div>
								</div>

								{/* Arrow SVG connecting cards */}
								<svg
									className="absolute top-[90px] left-[40px] w-12 h-16 text-white drop-shadow-lg opacity-80"
									viewBox="0 0 50 50"
								>
									<path
										d="M 10 10 Q 25 25 10 40"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										markerEnd="url(#arrowhead)"
									/>
								</svg>

								{/* Card 2: Processed */}
								<div className="bg-white/95 p-2 rounded-lg shadow-xl w-32 transform rotate-6 border-2 border-orange-100 animate-float-slower ml-8">
									<div className="relative">
										<span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
											2. Clean Up
										</span>
										{/* Using a similar image but pretending it's isolated/clean */}
										<img
											src="https://images.unsplash.com/photo-1621460245217-37fb2778da5c?auto=format&fit=crop&w=150"
											className="rounded mb-1 h-20 w-full object-cover scale-110"
											alt="Isolated Can"
										/>
									</div>
									<div className="text-[9px] font-bold text-center text-gray-600">
										Isolate Product
									</div>
								</div>

								{/* Arrow into Monitor */}
								<svg
									className="absolute top-[210px] left-[90px] w-24 h-12 text-white drop-shadow-lg opacity-80"
									viewBox="0 0 100 50"
								>
									<path
										d="M 0 25 Q 50 25 90 25"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
									/>
									<path d="M 85 20 L 95 25 L 85 30" fill="currentColor" />
								</svg>
							</div>

							{/* Main Monitor */}
							<div className="relative z-20">
								<div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl shadow-2xl border-[4px] border-gray-700 border-b-0 w-full max-w-lg h-[280px] sm:h-[320px] relative overflow-hidden group">
									{/* Video Content */}
									<img
										src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
										className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
										alt="Party Ad"
									/>

									{/* Video UI Overlay */}
									<div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-4">
										<div className="flex justify-between text-white/80 text-xs">
											<span>REC ●</span>
											<span>00:15 / 00:30</span>
										</div>
										<div className="self-center">
											<button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-xl hover:bg-white/30 transition-all hover:scale-110">
												<Play
													fill="white"
													className="ml-1 text-white"
													size={32}
												/>
												{/* Pulse effect */}
												<div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-50"></div>
											</button>
										</div>
										<div className="h-1 bg-white/30 rounded-full overflow-hidden">
											<div className="w-1/2 h-full bg-orange-500"></div>
										</div>
									</div>
								</div>

								{/* Monitor Chin */}
								<div className="bg-gray-300 h-10 w-full max-w-lg border-x-[4px] border-b-[4px] border-gray-700 rounded-b-xl flex items-center justify-center relative shadow-xl">
									<div className="text-xl text-gray-500"></div>

									{/* Social Icons Dock */}
									<div className="absolute -bottom-6 flex gap-3 bg-white px-4 py-2 rounded-2xl shadow-lg border border-gray-100 transform scale-90 sm:scale-100">
										<div className="p-1.5 bg-gray-100 rounded-lg">
											<span className="font-bold text-gray-800 text-xs">a</span>
										</div>
										<div className="p-1.5 bg-blue-100 rounded-lg">
											<Facebook
												size={16}
												className="text-blue-600"
												fill="currentColor"
											/>
										</div>
										<div className="p-1.5 bg-white border border-gray-200 rounded-lg">
											<Chrome size={16} className="text-red-500" />
										</div>
										<div className="p-1.5 bg-red-100 rounded-lg">
											<Youtube size={16} className="text-red-600" />
										</div>
									</div>
								</div>

								{/* Stand */}
								<div className="bg-gradient-to-b from-gray-400 to-gray-300 h-16 w-32 mx-auto mt-[-2px] shadow-inner perspective-[500px] transform rotate-x-12 relative z-0"></div>
								<div className="bg-gray-800/20 h-4 w-48 mx-auto rounded-[100%] blur-md mt-[-8px]"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Feature Cards (Glassmorphism) */}
				{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 sm:mt-24">
				{[
					{
						icon: User,
						title: "AI Models",
						desc: "Select AI-generated fashion models for ads",
						color: "text-red-500",
					},
					{
						icon: ImageIcon,
						title: "Ad Environments",
						desc: "Pick engaging backgrounds tailored for products",
						color: "text-orange-500",
					},
					{
						icon: Wand2,
						title: "Automated Editing",
						desc: "Clean up & enhance product visuals automatically",
						color: "text-pink-500",
					},
					{
						icon: Clapperboard,
						title: "Video Generation",
						desc: "Convert product ad creative into videos effortlessly",
						color: "text-rose-500",
					},
				].map((item, idx) => (
					<div
						key={idx}
						className="bg-white/40 backdrop-blur-md border border-white/40 p-4 rounded-xl flex items-start gap-3 hover:bg-white/60 transition-colors shadow-lg shadow-orange-900/5 group"
					>
						<div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
							<item.icon className={item.color} size={24} />
						</div>
						<div>
							<h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
							<p className="text-[11px] text-gray-700 font-medium leading-tight mt-1">
								{item.desc}
							</p>
						</div>
					</div>
				))}
			</div> */}
			</div>
		</div>
	</div>
);	
