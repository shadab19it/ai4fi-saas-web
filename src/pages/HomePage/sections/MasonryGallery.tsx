import { FC, useEffect, useRef, useState } from "react";

/* =========================================================
   Types
========================================================= */

type SpanType = "tall" | "wide" | "normal";

type CssTheme =
	| "editorial-dark"
	| "product-gold"
	| "banner-rust"
	| "editorial-cream"
	| "product-navy"
	| "gradient-sage"
	| "product-marble";

interface RealImage {
	type: "real";
	src: string;
	label: string;
}

interface CssImage {
	type: "css";
	theme: CssTheme;
	label: string;
}

type GalleryImage = RealImage | CssImage;

interface GalleryCellData {
	id: number;
	span: SpanType;
	images: GalleryImage[];
}

/* =========================================================
   Data
========================================================= */

const CELLS: GalleryCellData[] = [
	{
		id: 0,
		span: "tall",
		images: [
			{
				type: "real",
				src: "/mnt/user-data/uploads/1771311824300_image.png",
				label: "Model · Blue Shirt",
			},
			{ type: "css", theme: "editorial-dark", label: "Campaign · Night Edit" },
			{ type: "css", theme: "product-gold", label: "Accessory · Gold Line" },
		],
	},
	{
		id: 1,
		span: "wide",
		images: [
			{ type: "css", theme: "banner-rust", label: "Ad · Autumn Drop" },
			{ type: "css", theme: "editorial-cream", label: "Editorial · Soft Look" },
			{ type: "css", theme: "product-navy", label: "Menswear · Classic" },
		],
	},
];

/* =========================================================
   CSS Art Slide
========================================================= */

interface CssArtSlideProps {
	theme: CssTheme;
}

function CssArtSlide({ theme }: CssArtSlideProps) {
	const baseStyle: React.CSSProperties = {
		width: "100%",
		height: "100%",
		display: "flex",
	};

	switch (theme) {
		case "editorial-dark":
			return (
				<div
					style={{
						...baseStyle,
						background:
							"linear-gradient(160deg,#1A1A18 0%,#2C2C28 60%,#3D3530 100%)",
					}}
				/>
			);

		case "product-gold":
			return (
				<div
					style={{
						...baseStyle,
						background:
							"linear-gradient(135deg,#F5EDD8 0%,#E8D5A3 50%,#D4B483 100%)",
					}}
				/>
			);

		default:
			return <div style={{ ...baseStyle, background: "#eee" }} />;
	}
}

/* =========================================================
   Rotating Cell
========================================================= */

interface RotatingCellProps {
	cell: GalleryCellData;
}

function RotatingCell({ cell }: RotatingCellProps) {
	const poolLen = cell.images.length;

	const [activeIdx, setActiveIdx] = useState<number>(0);
	const [fading, setFading] = useState<boolean>(false);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const stagger = cell.id * 800;
		const interval = 3200 + cell.id * 1000;

		const timeout = setTimeout(() => {
			intervalRef.current = setInterval(() => {
				setFading(true);

				setTimeout(() => {
					setActiveIdx((prev) => (prev + 1) % poolLen);
					setFading(false);
				}, 650);
			}, interval);
		}, stagger);

		return () => {
			clearTimeout(timeout);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [cell.id, poolLen]);

	const current = cell.images[activeIdx];

	return (
		<>
			{/* Image Layer */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: fading ? 0 : 1,
					transition: "opacity 0.65s cubic-bezier(0.4,0,0.2,1)",
				}}
			>
				{current.type === "real" ? (
					<img
						src={current.src}
						alt={current.label}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				) : (
					<CssArtSlide theme={current.theme} />
				)}
			</div>

			{/* Gradient Overlay */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.65) 100%)",
					pointerEvents: "none",
				}}
			/>

			{/* Label */}
			<div
				style={{
					position: "absolute",
					bottom: 14,
					left: 14,
					right: 36,
					zIndex: 2,
					color: "white",
					fontFamily: "Georgia, serif",
					fontSize: 12,
					fontStyle: "italic",
				}}
			>
				{current.label}
			</div>
		</>
	);
}

/* =========================================================
   Main Gallery
========================================================= */

const MasonryGallery: FC<{ gallery: GalleryCellData[] }> = ({ gallery }) => {
	return (
		<div className="w-full">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
				{gallery.map((cell) => (
					<div
						key={cell.id}
						className={`relative rounded-lg overflow-hidden shadow-lg bg-muted flex flex-col ${
							cell.span === "tall"
								? "row-span-2"
								: cell.span === "wide"
									? "col-span-2"
									: ""
						}`}
					>
						<RotatingCell cell={cell} />
					</div>
				))}
			</div>
		</div>
	);
};

export default MasonryGallery;
