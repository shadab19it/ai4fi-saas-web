import { ArrowRight, Play, X, ZoomIn } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type MediaItem =
	| { type: "image"; src: string; alt?: string; badge?: string }
	| { type: "video"; src: string; poster?: string; badge?: string };

interface FeatureFlow {
	label: string; // e.g. "Male", "Female"
	items: MediaItem[];
}

interface FeatureGroup {
	name: string;
	flows: FeatureFlow[];
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const FEATURE_GROUPS: FeatureGroup[] = [
	{
		name: "Unstitch Tryon",
		flows: [
			{
				label: "Female",
				items: [
					{
						type: "image",
						src: "./Archive/unstrich_tryon/1/unstiched_cloth.webp",
						alt: "Unstitched fabric male 1",
						badge: "raw",
					},
					{
						type: "image",
						src: "./Archive/unstrich_tryon/1/stiched_cloth.jpeg",
						alt: "Stitched cloth male 1",
					},
				],
			},
			{
				label: "Male",
				items: [
					{
						type: "image",
						src: "./Archive/unstrich_tryon/2/unstiched_cloth.jpg",
						alt: "Unstitched fabric female 1",
						badge: "raw",
					},
					{
						type: "image",
						src: "./Archive/unstrich_tryon/2/unstiched_cloth_pant.jpg",
						alt: "Unstitched fabric female 1",
						badge: "raw",
					},
					{
						type: "image",
						src: "./Archive/unstrich_tryon/2/stiched_cloth.jpeg",
						alt: "Stitched cloth female 1",
					},
				],
			},
		],
	},
	{
		name: "Ad Generator",
		flows: [
			{
				label: "Default",
				items: [
					{
						type: "image",
						src: "./Archive/ad/1/ads-product-img-B-Z9QbSE.png",
						alt: "Ad concept 1",
						badge: "raw",
					},
					{
						type: "video",
						src: "./Archive/ad/1/generated_video (5).mp4",

					},
				],
			},
			{
				label: "Default",
				items: [
					{
						type: "image",
						src: "./Archive/ad/2/lays.jpg",
						alt: "Ad concept 1",
						badge: "raw",
					},
					{
						type: "video",
						src: "./Archive/ad/2/generated_video (7).mp4",

					},
				],
			},
		],
	},
	{
		name: "Photo Shoot Studio",
		flows: [
			{
				label: "Default",
				items: [
					{
						type: "image",
						src: "./Archive/product_photography/1/raw.jpeg",
						alt: "Studio shot 1",
						badge: "raw",
					},
					{
						type: "image",
						src: "./Archive/product_photography/1/first.jpeg",
						alt: "Studio shot 2",
					},
					{
						type: "image",
						src: "./Archive/product_photography/1/second.jpeg",
						alt: "Studio shot 2",
					},
					{
						type: "image",
						src: "./Archive/product_photography/1/third.jpeg",
						alt: "Studio shot 4",
					},
				],
			},
			{
				label: "Default",
				items: [
					{
						type: "image",
						src: "./Archive/product_photography/2/raw.JPG",
						alt: "Studio shot 1",
						badge: "raw",
					},
					{
						type: "image",
						src: "./Archive/product_photography/2/first.jpeg",
						alt: "Studio shot 2",
					},
					{
						type: "image",
						src: "./Archive/product_photography/2/second.jpeg",
						alt: "Studio shot 2",
					},
					{
						type: "image",
						src: "./Archive/product_photography/2/third.jpeg",
						alt: "Studio shot 4",
					},

				],
			},
		],
	},
];

// ─── Step Label ──────────────────────────────────────────────────────────────

const STEP_LABELS = [
	"Input",
	"Output",
	"Result",
	"Final",
	"Step 5",
	"Step 6",
	"Step 7",
];
function getStepLabel(index: number, total: number): string {
	if (total === 2) return index === 0 ? "Before" : "After";
	if (index === 0) return "Input";
	if (index === total - 1) return "Result";
	return `Step ${index + 1}`;
}

// ─── Flow Arrow ──────────────────────────────────────────────────────────────

const FlowArrow = () => (
	<div className="flex-shrink-0 flex items-center justify-center mx-4 sm:mx-8">
		<div className="flex items-center gap-0">
			<div
				className="h-[2px] w-8 sm:w-12"
				style={{
					background:
						"linear-gradient(90deg, var(--brand), color-mix(in srgb, var(--brand), transparent 60%))",
				}}
			/>
			<ArrowRight size={22} className="text-brand -ml-1" strokeWidth={2.5} />
		</div>
	</div>
);

// ─── Media Card ──────────────────────────────────────────────────────────────

interface MediaCardProps {
	item: MediaItem;
	index: number;
	total: number;
	isActive: boolean;
	onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
	item,
	index,
	total,
	isActive,
	onClick,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isHovered, setIsHovered] = useState(false);
	const label = getStepLabel(index, total);

	useEffect(() => {
		if (item.type === "video" && videoRef.current) {
			if (isHovered) {
				videoRef.current.play().catch(() => { });
			} else {
				videoRef.current.pause();
				videoRef.current.currentTime = 0;
			}
		}
	}, [isHovered, item.type]);

	return (
		<div
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && onClick()}
			className="relative cursor-pointer outline-none group/card flex-shrink-0"
			style={{ maxWidth: 260 }}
		>
			{/* Main card container */}
			<div
				className={`relative w-[120px] h-[150px] sm:w-[160px] sm:h-[200px] md:w-[220px] md:h-[270px] overflow-hidden rounded-2xl
				transition-all duration-500 ease-out
				${isActive ? "ring-2 ring-brand ring-offset-2 ring-offset-background shadow-[0_0_30px_rgba(var(--brand-rgb,167,139,250),0.3)]" : "shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20"}
				`}
				style={{
					border: isActive
						? "none"
						: "1px solid color-mix(in srgb, var(--border), transparent 30%)",
				}}
			>
				{/* Media content */}
				{item.type === "image" ? (
					<img
						src={item.src}
						alt={item.alt ?? `Step ${index + 1}`}
						className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
						loading="lazy"
					/>
				) : (
					<video
						ref={videoRef}
						src={item.src}
						poster={item.poster}
						muted
						loop
						playsInline
						className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
					/>
				)}

				{/* Gradient overlay */}
				<div
					className="absolute inset-0 transition-opacity duration-300"
					style={{
						background:
							"linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)",
						opacity: isHovered ? 0.9 : 0.6,
					}}
				/>

				{/* Top: Step badge */}
				{item.badge && (
					<div className="absolute top-2.5 left-2.5 z-10">
						<div
							className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-300
							${isActive ? "bg-brand text-white" : "bg-black/40 text-white/90 border border-white/10"}`}
						>
							<span
								className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-brand"}`}
							/>
							{item.badge}
						</div>
					</div>
				)}


				{/* Video play icon */}
				{item.type === "video" && (
					<div
						className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
					>
						<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-brand/30">
							<Play size={18} className="text-white ml-0.5" fill="white" />
						</div>
					</div>
				)}

				{/* Bottom: Zoom hint on hover */}
				<div
					className={`absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-[9px] font-medium transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
				>
					<ZoomIn size={10} />
					Click to expand
				</div>
			</div>
		</div>
	);
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
	item: MediaItem;
	label: string;
	onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ item, label, onClose }) => {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", handler);
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", handler);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl"
			style={{ animation: "fadeIn 0.2s ease" }}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative bg-background/95 border border-border/50 rounded-2xl p-5 sm:p-8 max-w-[95vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col gap-4 shadow-2xl"
				style={{ animation: "scaleIn 0.25s ease" }}
			>
				<button
					onClick={onClose}
					className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-muted/50 hover:bg-brand/20 text-foreground flex items-center justify-center transition-all duration-200 hover:scale-110"
				>
					<X size={16} color="white" />
				</button>

				<div className="flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-brand" />
					<span className="text-white font-semibold text-sm sm:text-base">
						{label}
					</span>
				</div>

				{item.type === "image" ? (
					<img
						src={item.src}
						alt={label}
						className="max-w-[85vw] sm:max-w-[80vw] max-h-[75vh] object-contain rounded-xl"
					/>
				) : (
					<video
						src={item.src}
						poster={item.poster}
						controls
						autoPlay
						muted
						loop
						className="max-w-[85vw] sm:max-w-[80vw] max-h-[75vh] object-contain rounded-xl"
					/>
				)}
			</div>
		</div>
	);
};

// ─── Flow Row ────────────────────────────────────────────────────────────────

interface FlowRowProps {
	flow: FeatureFlow;
	groupName: string;
	showLabel: boolean;
}

const FlowRow: React.FC<FlowRowProps> = ({ flow, groupName, showLabel }) => {
	const [activeIdx, setActiveIdx] = useState<number | null>(null);

	return (
		<div className="flex flex-col gap-3">
			{/* Flow items with arrows */}
			<div className="flex items-center flex-wrap gap-x-4 gap-y-5 sm:gap-y-6">
				{flow.items.map((item, i) => {
					// Show arrow if it's the first image OR if it has a 'raw' badge
					// (But not after the final image)
					const showArrow = (i === 0 || item.badge?.toLowerCase() === "raw") && i < flow.items.length - 1;

					return (
						<div key={i} className="flex items-center">
							<MediaCard
								item={item}
								index={i}
								total={flow.items.length}
								isActive={activeIdx === i}
								onClick={() => setActiveIdx(activeIdx === i ? null : i)}
							/>
							{showArrow && <FlowArrow />}
						</div>
					);
				})}
			</div>

			{/* Lightbox */}
			{activeIdx !== null && (
				<Lightbox
					item={flow.items[activeIdx]}
					label={`${groupName}${showLabel ? ` · ${flow.label}` : ""} — ${getStepLabel(activeIdx, flow.items.length)}`}
					onClose={() => setActiveIdx(null)}
				/>
			)}
		</div>
	);
};

// ─── Group Card ──────────────────────────────────────────────────────────────

interface GroupCardProps {
	group: FeatureGroup;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
	const hasMultipleFlows = group.flows.length > 1;
	const totalSteps = group.flows.reduce((sum, f) => sum + f.items.length, 0);

	return (
		<div
			className="relative overflow-hidden rounded-2xl p-5 sm:p-7 md:p-9 transition-all duration-500 hover:shadow-xl"
			style={{
				background:
					"linear-gradient(135deg, color-mix(in srgb, var(--card), transparent 40%), color-mix(in srgb, var(--card), transparent 70%))",
				border: "1px solid color-mix(in srgb, var(--border), transparent 30%)",
			}}
		>
			{/* Subtle corner accent */}
			<div
				className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-[0.04]"
				style={{
					background:
						"radial-gradient(circle at top right, var(--brand), transparent 70%)",
				}}
			/>

			{/* Group header */}
			<div className="flex items-center gap-3 mb-6 sm:mb-8">
				<div
					className="w-1 h-6 rounded-full"
					style={{ background: "var(--brand)" }}
				/>
				<h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
					{group.name}
				</h3>
			</div>

			{/* Render each flow */}
			<div
				className={`flex flex-col ${hasMultipleFlows ? "gap-6 sm:gap-8" : "gap-0"}`}
			>
				{hasMultipleFlows &&
					group.flows.map((flow, i) => (
						<div key={i} className="flex flex-col gap-3">
							{/* Divider line between flows */}
							{i > 0 && (
								<div
									className="h-px w-full mb-2"
									style={{
										background:
											"color-mix(in srgb, var(--border), transparent 50%)",
									}}
								/>
							)}
							<FlowRow
								flow={flow}
								groupName={group.name}
								showLabel={hasMultipleFlows}
							/>
						</div>
					))}
				{!hasMultipleFlows &&
					group.flows.map((flow, i) => (
						<FlowRow
							key={i}
							flow={flow}
							groupName={group.name}
							showLabel={false}
						/>
					))}
			</div>
		</div>
	);
};

// ─── Inline Styles (keyframes) ───────────────────────────────────────────────

const inlineStyles = `
@keyframes fadeIn {
	from { opacity: 0; }
	to   { opacity: 1; }
}
@keyframes scaleIn {
	from { opacity: 0; transform: scale(0.92); }
	to   { opacity: 1; transform: scale(1); }
}
`;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OtherFeatures() {
	return (
		<div className="bg-background text-foreground font-sans py-6 sm:py-10 transition-colors duration-300">
			<style>{inlineStyles}</style>
			<div className="mx-auto flex flex-col gap-8 sm:gap-12">
				{FEATURE_GROUPS.map((group) => (
					<GroupCard key={group.name} group={group} />
				))}
			</div>
		</div>
	);
}
