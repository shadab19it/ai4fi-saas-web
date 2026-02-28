"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import OtherFeatures from "../components/showcase/OtherFeatures";

// --- Types ---
interface TestimonialImage {
	id: string;
	src: string; // placeholder color
	alt: string;
	label?: string;
}

interface Section {
	id: string;
	label: string;
	title: string;
	subtitle?: string;
	items: TestimonialCard[];
}

interface TestimonialCard {
	id: string;
	images: string[]; // array of placeholder colors (simulate multiple photos)
	testimonial?: {
		time: string;
		title: string;
		text: string;
		author?: string;
	};
	span?: "wide" | "tall" | "normal";
}

// --- Data ---
const SECTIONS: Section[] = [
	{
		id: "ethenic-male",
		label: "Ethenic Male",
		title: "Ethnic Male ",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/1/Generated Image February 21, 2026 - 7_38PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/1/Generated Image February 21, 2026 - 7_40PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/1/Generated Image February 21, 2026 - 7_41PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/1/Generated Image February 21, 2026 - 7_42PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/1/Generated Image February 21, 2026 - 7_55PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/1/Generated Image February 21, 2026 - 7_57PM.jpeg",
				],
				span: "wide",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/2/Generated Image February 21, 2026 - 6_57PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/2/Generated Image February 21, 2026 - 7_00PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/2/Generated Image February 21, 2026 - 7_12PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/2/Generated Image February 21, 2026 - 7_14PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/2/Generated Image February 21, 2026 - 7_33PM.jpeg",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/3/Generated Image February 22, 2026 - 12_20PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/3/Generated Image February 22, 2026 - 12_22PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/3/Generated Image February 22, 2026 - 12_24PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/3/Generated Image February 22, 2026 - 12_26PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/3/Generated Image February 22, 2026 - 12_30PM.jpeg",
				],
				span: "wide",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/4/Generated Image February 22, 2026 - 12_35PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/4/Generated Image February 22, 2026 - 12_36PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/4/Generated Image February 22, 2026 - 12_38PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/4/Generated Image February 22, 2026 - 12_50PM.jpeg",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/5/Generated Image February 22, 2026 - 12_56PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/5/Generated Image February 22, 2026 - 12_59PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/5/Generated Image February 22, 2026 - 1_01PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/5/Generated Image February 22, 2026 - 1_03PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/6/Generated Image February 22, 2026 - 1_07PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/6/Generated Image February 22, 2026 - 1_12PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/6/Generated Image February 22, 2026 - 1_12PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/6/Generated Image February 22, 2026 - 1_14PM.jpeg",
				],
				span: "wide",
			},
			{
				id: "s7",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/7/Generated Image February 22, 2026 - 1_24PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/7/Generated Image February 22, 2026 - 1_28PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/7/Generated Image February 22, 2026 - 1_31PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/7/Generated Image February 22, 2026 - 1_36PM.jpeg",
				],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/8/Gemini_Generated_Image_mfuw6pmfuw6pmfuw.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/8/Gemini_Generated_Image_pboijcpboijcpboi.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/8/Gemini_Generated_Image_qimfd9qimfd9qimf.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Ethenic/8/Generated Image February 22, 2026 - 1_42PM.jpeg",
				],
				span: "wide",
			},
		],
	},
	{
		id: "ethenic-female",
		label: "Ethenic Female ",
		title: "Ethnic Female",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/1/Generated Image February 21, 2026 - 4_32PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/1/Generated Image February 21, 2026 - 4_34PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/1/Generated Image February 21, 2026 - 4_35PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/1/Generated Image February 21, 2026 - 4_40PM 2.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/1/Generated Image February 21, 2026 - 4_40PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/2/Generated Image February 21, 2026 - 4_46PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/2/Generated Image February 21, 2026 - 4_47PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/2/Generated Image February 21, 2026 - 4_51PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/2/Generated Image February 21, 2026 - 4_53PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/2/Generated Image February 21, 2026 - 4_57PM copy.jpeg",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/3/Generated Image February 21, 2026 - 4_59PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/3/Generated Image February 21, 2026 - 5_01PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/3/Generated Image February 21, 2026 - 5_03PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/3/Generated Image February 21, 2026 - 5_04PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/3/Generated Image February 21, 2026 - 5_08PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/4/Generated Image February 21, 2026 - 5_12PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/4/Generated Image February 21, 2026 - 5_14PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/4/Generated Image February 21, 2026 - 5_15PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/4/Generated Image February 21, 2026 - 5_17PM.jpeg",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/5/Generated Image February 21, 2026 - 5_22PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/5/Generated Image February 21, 2026 - 5_23PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/5/Generated Image February 21, 2026 - 5_26PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/5/Generated Image February 21, 2026 - 5_28PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/5/Generated Image February 21, 2026 - 5_29PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/5/Generated Image February 21, 2026 - 5_32PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/6/7b47627cab5d464f8389b7b0459923b5.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/6/Generated Image February 21, 2026 - 4_24PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/6/a9a805adb43248ec95449697fd394f7a.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/6/b204ac709ad3404e998f9f98dc9a8922.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/6/b8e6155885504138ae0dafd27e623db6.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/6/c01155007c4b43a2b159714fcd044c89.jpeg",
				],
				span: "tall",
			},
			{
				id: "s7",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/7/WhatsApp Image 2025-09-15 at 17.59.36 (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/7/WhatsApp Image 2025-09-15 at 17.59.36 (2).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/7/WhatsApp Image 2025-09-15 at 17.59.37 (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/7/WhatsApp Image 2025-09-15 at 17.59.37 (2).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/7/WhatsApp Image 2025-09-15 at 17.59.37.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/7/WhatsApp Image 2026-01-17 at 18.15.33.jpeg",
				],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/8/Generated Image February 21, 2026 - 4_30PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/8/processed-image (3).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/8/processed-image (4).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/8/processed-image (5).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Ethenic/8/processed-image (7).png",
				],
				span: "tall",
			},
		],
	},
	{
		id: "casual-male",
		label: "Casual Male",
		title: "Casual Male ",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/1/Generated Image February 22, 2026 - 3_32PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/1/Generated Image February 22, 2026 - 3_33PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/1/Generated Image February 22, 2026 - 3_33PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/1/Generated Image February 22, 2026 - 3_34PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/1/Generated Image February 22, 2026 - 3_36PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/2/Generated Image February 22, 2026 - 3_37PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/2/Generated Image February 22, 2026 - 3_38PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/2/Generated Image February 22, 2026 - 3_38PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/2/Generated Image February 22, 2026 - 3_39PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/2/Generated Image February 22, 2026 - 3_40PM.jpeg",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/3/Generated Image February 22, 2026 - 3_44PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/3/Generated Image February 22, 2026 - 3_44PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/3/Generated Image February 22, 2026 - 3_46PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/3/Generated Image February 22, 2026 - 3_47PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/4/Generated Image February 22, 2026 - 3_48PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/4/Generated Image February 22, 2026 - 3_50PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/4/Generated Image February 22, 2026 - 3_52PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/4/Generated Image February 22, 2026 - 3_56PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/4/Generated Image February 22, 2026 - 4_58PM.jpeg",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/5/Generated Image February 22, 2026 - 8_00PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/5/Generated Image February 22, 2026 - 8_01PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/5/Generated Image February 22, 2026 - 8_02PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/5/Generated Image February 22, 2026 - 8_03PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/5/Generated Image February 22, 2026 - 8_05PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/6/Generated Image February 22, 2026 - 8_05PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/6/Generated Image February 22, 2026 - 8_07PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/6/Generated Image February 22, 2026 - 8_08PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/6/Generated Image February 22, 2026 - 8_10PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/6/Generated Image February 22, 2026 - 8_10PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s7",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/7/Generated Image February 22, 2026 - 8_12PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/7/Generated Image February 22, 2026 - 8_13PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/7/Generated Image February 22, 2026 - 8_13PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/7/Generated Image February 22, 2026 - 8_14PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/7/Generated Image February 22, 2026 - 8_15PM.jpeg",
				],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/8/Generated Image February 22, 2026 - 10_02PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/8/Generated Image February 22, 2026 - 10_03PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/8/Generated Image February 22, 2026 - 10_03PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/8/Generated Image February 22, 2026 - 10_04PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/8/Generated Image February 22, 2026 - 10_05PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Male_Casual/8/Generated Image February 22, 2026 - 10_06PM.jpeg",
				],
				span: "tall",
			},
		],
	},
	{
		id: "casual-female",
		label: "Casual Female",
		title: "Casual Female ",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/1/Generated Image February 22, 2026 - 1_59PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/1/Generated Image February 22, 2026 - 2_00PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/1/Generated Image February 22, 2026 - 2_00PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/1/Generated Image February 22, 2026 - 2_01PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/1/Generated Image February 22, 2026 - 2_02PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/2/Generated Image February 22, 2026 - 1_47PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/2/Generated Image February 22, 2026 - 1_47PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/2/Generated Image February 22, 2026 - 1_48PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/2/Generated Image February 22, 2026 - 1_48PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/2/Generated Image February 22, 2026 - 1_49PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/2/Generated Image February 22, 2026 - 1_50PM.jpeg",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/3/Generated Image February 22, 2026 - 2_03PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/3/Generated Image February 22, 2026 - 2_04PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/3/Generated Image February 22, 2026 - 2_04PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/3/Generated Image February 22, 2026 - 2_05PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/3/Generated Image February 22, 2026 - 2_06PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/4/Generated Image February 22, 2026 - 2_12PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/4/Generated Image February 22, 2026 - 2_14PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/4/Generated Image February 22, 2026 - 2_14PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/4/Generated Image February 22, 2026 - 2_17PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/4/Generated Image February 22, 2026 - 2_20PM.jpeg",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/5/Generated Image September 13, 2025 - 12_11PM.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/5/Generated Image September 13, 2025 - 12_18PM.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/5/Generated Image September 13, 2025 - 12_27PM (1).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/5/Generated Image September 13, 2025 - 12_27PM (2).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/5/Generated Image September 13, 2025 - 12_27PM.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/5/WhatsApp Image 2025-07-03 at 17.05.13.jpeg",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/6/WhatsApp Image 2025-07-03 at 16.49.09.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/6/unwatermarked_Gemini_Generated_Image_353tu5353tu5353t (1).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/6/unwatermarked_Gemini_Generated_Image_mirrrpmirrrpmirr (1).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/6/unwatermarked_Gemini_Generated_Image_w9i39mw9i39mw9i3.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/6/unwatermarked_Gemini_Generated_Image_yrjdi4yrjdi4yrjd.png",
				],
				span: "tall",
			},
			{
				id: "s7",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/7/Generated Image September 13, 2025 - 12_27PM (3) (1).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/7/Generated Image September 13, 2025 - 12_30PM (1) (1).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/7/Generated Image September 13, 2025 - 12_34PM (2).png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/7/IMG20250816160923.jpg",
				],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/8/Generated Image February 22, 2026 - 2_23PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/8/Generated Image February 22, 2026 - 2_24PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/8/Generated Image February 22, 2026 - 2_25PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/Female_Casual/8/Generated Image February 22, 2026 - 2_27PM.jpeg",
				],
				span: "tall",
			},
		],
	},
	{
		id: "plus-size",
		label: "Plus Size",
		title: "Plus Size ",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/1/Generated Image February 22, 2026 - 10_08PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/1/Generated Image February 22, 2026 - 10_08PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/1/Generated Image February 22, 2026 - 10_09PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/1/Generated Image February 22, 2026 - 10_11PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/2/Generated Image February 22, 2026 - 10_12PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/2/Generated Image February 22, 2026 - 10_13PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/2/Generated Image February 22, 2026 - 10_14PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/2/Generated Image February 22, 2026 - 10_15PM.jpeg",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/3/Generated Image February 22, 2026 - 10_16PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/3/Generated Image February 22, 2026 - 10_17PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/3/Generated Image February 22, 2026 - 10_18PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/3/Generated Image February 22, 2026 - 10_19PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/4/Generated Image February 22, 2026 - 10_21PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/4/Generated Image February 22, 2026 - 10_21PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/4/Generated Image February 22, 2026 - 10_23PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/4/Generated Image February 22, 2026 - 10_24PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/4/Generated Image February 22, 2026 - 10_25PM.jpeg",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/5/Generated Image February 22, 2026 - 10_26PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/5/Generated Image February 22, 2026 - 10_28PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/5/Generated Image February 22, 2026 - 10_29PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/5/Generated Image February 22, 2026 - 10_30PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/6/Generated Image February 22, 2026 - 10_45PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/6/Generated Image February 22, 2026 - 10_46PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/6/Generated Image February 22, 2026 - 10_46PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/6/Generated Image February 22, 2026 - 11_19PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s7",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/7/Generated Image February 22, 2026 - 11_21PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/7/Generated Image February 22, 2026 - 11_22PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/7/Generated Image February 22, 2026 - 11_23PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/7/Generated Image February 22, 2026 - 11_24PM.jpeg",
				],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/8/Generated Image February 22, 2026 - 11_25PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/8/Generated Image February 22, 2026 - 11_26PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/8/Generated Image February 22, 2026 - 11_27PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/PlusSize/8/Generated Image February 22, 2026 - 11_27PM.jpeg",
				],
				span: "tall",
			},
		],
	},
	{
		id: "kids-wear",
		label: "Kids Wear",
		title: "Kids Wear ",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/1/Generated Image February 22, 2026 - 11_34PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/1/Generated Image February 22, 2026 - 11_34PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/1/Generated Image February 22, 2026 - 11_36PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/1/Generated Image February 22, 2026 - 11_37PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/2/Generated Image February 22, 2026 - 11_45PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/2/Generated Image February 22, 2026 - 11_46PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/2/Generated Image February 22, 2026 - 11_47PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/2/Generated Image February 22, 2026 - 11_47PM.jpeg",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/3/Generated Image February 22, 2026 - 11_38PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/3/Generated Image February 22, 2026 - 11_39PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/3/Generated Image February 22, 2026 - 11_43PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/4/Generated Image February 22, 2026 - 11_30PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/4/Generated Image February 22, 2026 - 11_30PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/4/Generated Image February 22, 2026 - 11_31PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/4/Generated Image February 22, 2026 - 11_32PM (1).jpeg",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/5/Generated Image February 22, 2026 - 11_49PM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/5/Generated Image February 22, 2026 - 11_49PM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/5/Generated Image February 23, 2026 - 12_15AM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/5/Generated Image February 23, 2026 - 12_15AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/5/Generated Image February 23, 2026 - 12_17AM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/6/Generated Image February 23, 2026 - 12_23AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/6/Generated Image February 23, 2026 - 12_24AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/6/Generated Image February 23, 2026 - 12_28AM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/6/Generated Image February 23, 2026 - 12_28AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/6/Generated Image February 23, 2026 - 12_32AM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s7",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/7/Generated Image February 23, 2026 - 12_30AM (1).jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/7/Generated Image February 23, 2026 - 12_30AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/7/Generated Image February 23, 2026 - 12_33AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/7/Generated Image February 23, 2026 - 12_35AM.jpeg",
				],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/8/Generated Image February 23, 2026 - 12_36AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/8/Generated Image February 23, 2026 - 12_37AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/8/Generated Image February 23, 2026 - 12_39AM.jpeg",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/kids/8/Generated Image February 23, 2026 - 12_41AM.jpeg",
				],
				span: "tall",
			},
		],
	},
	{
		id: "lingerie",
		label: "Lingerie",
		title: "Lingerie ",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/female_model_003.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/female_model_005.png",
				],
				span: "tall",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/female_model_009.png",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/female_model_010.png",
				],
				span: "tall",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/female_model_045.png",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/female_model_048.png",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/male_model_003.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/male_model_010.png",
				],
				span: "tall",
			},
			{
				id: "s7",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/male_model_015.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/male_model_017.png",
				],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/male_model_024.png",
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/lingerie/male_model_029.png",
				],
				span: "tall",
			},
		],
	},
	{
		id: "4k",
		label: "4k images",
		title: "4k Images ",
		items: [
			{
				id: "s1",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/4k/4k_kid.jpeg",
				],
				span: "tall",
			},
			{
				id: "s2",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/4k/4kl_casualjpeg.jpeg",
				],
				testimonial: {
					time: "Instant",
					title: "Sarah J.",
					text: "The AI virtual try-on is incredibly accurate. I can see how clothes fit my body without ever leaving home. It has redefined how I shop.",
					author: "Sarah J.",
				},
			},
			{
				id: "s3",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/4k/Generated Image February 23, 2026 - 12_17PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s4",
				span: "tall",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/4k/Generated Image February 23, 2026 - 12_19PM.jpeg",
				],
			},
			{
				id: "s5",
				images: [
					"https://ai4fi.s3.amazonaws.com/Visual Portfolio/4k/Generated Image February 23, 2026 - 1_09PM.jpeg",
				],
				span: "tall",
			},
			{
				id: "s6",
				images: [], // Placeholder for additional 4k content
				span: "tall",
			},
			{
				id: "s7",
				images: [],
				testimonial: {
					time: "Real-time",
					title: "Style Assist",
					text: "AI4FI's stylist suggests outfits based on my body type and skin tone. It's like having a personal fashion consultant 24/7.",
					author: "Marcus K.",
				},
			},
			{
				id: "s8",
				images: [],
				span: "tall",
			},
		],
	},
	{
		id: "others",
		label: "Others Features",
		title: "Other Features ",
		items: [],
	},
];

// --- Lightbox ---
// --- Lightbox ---
function LightboxModal({
	images,
	initialIndex,
	onClose,
}: {
	images: string[];
	initialIndex: number;
	onClose: () => void;
}) {
	const [index, setIndex] = useState(initialIndex);

	const next = useCallback((e?: React.MouseEvent) => {
		e?.stopPropagation();
		setIndex((prev) => (prev + 1) % images.length);
	}, [images.length]);

	const prev = useCallback((e?: React.MouseEvent) => {
		e?.stopPropagation();
		setIndex((prev) => (prev - 1 + images.length) % images.length);
	}, [images.length]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") next();
			if (e.key === "ArrowLeft") prev();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [onClose, next, prev]);

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
			onClick={onClose}
		>
			<button
				onClick={onClose}
				className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-3xl transition-all"
			>
				&times;
			</button>

			{images.length > 1 && (
				<>
					<button
						onClick={prev}
						className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
					>
						<ChevronLeft size={32} />
					</button>
					<button
						onClick={next}
						className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
					>
						<ChevronRight size={32} />
					</button>
				</>
			)}

			<div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
				<img
					key={index}
					src={images[index]}
					alt=""
					className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95"
					onClick={(e) => e.stopPropagation()}
				/>
			</div>

			{images.length > 1 && (
				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 text-sm font-medium">
					{index + 1} / {images.length}
				</div>
			)}
		</div>
	);
}

// --- Slideshow Hook ---
function useSlideshow(images: string[]) {
	const [idx, setIdx] = useState(0);
	const [hovered, setHovered] = useState(false);
	const startX = useRef<number | null>(null);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const next = useCallback(() => {
		if (images.length <= 1) return;
		setIdx((current) => (current + 1) % images.length);
	}, [images.length]);

	const prev = useCallback(() => {
		if (images.length <= 1) return;
		setIdx((current) => (current - 1 + images.length) % images.length);
	}, [images.length]);

	useEffect(() => {
		if (hovered || images.length <= 1) return;
		const stagger = Math.random() * 2000;
		const timeout = setTimeout(() => {
			timerRef.current = setInterval(next, 3500 + Math.random() * 1500);
		}, stagger);
		return () => {
			clearTimeout(timeout);
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [hovered, images.length, next]);

	const touchBind = {
		onTouchStart: (e: React.TouchEvent) => {
			startX.current = e.touches[0].clientX;
		},
		onTouchEnd: (e: React.TouchEvent) => {
			if (startX.current === null) return;
			const diff = e.changedTouches[0].clientX - startX.current;
			if (Math.abs(diff) > 40) diff > 0 ? prev() : next();
			startX.current = null;
		},
	};
	return { idx, hovered, setHovered, next, prev, touchBind };
}

// --- Dots ---
function Dots({ count, active }: { count: number; active: number }) {
	if (count <= 1) return null;
	return (
		<div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="w-1.5 h-1.5 rounded-full transition-all duration-400"
					style={{
						background:
							i === active ? "var(--brand, #a78bfa)" : "rgba(255,255,255,0.35)",
						transform: i === active ? "scale(1.4)" : "scale(1)",
					}}
				/>
			))}
		</div>
	);
}

// Height pattern: long → short → extra long (cycles every 3)
const HEIGHT_CLASSES = [
	"h-[240px] md:h-[300px] lg:h-[75vh]", // long
	"h-[160px] md:h-[190px] lg:h-[65vh]", // short
	"h-[300px] md:h-[380px] lg:h-[85vh]", // extra long
];
const TESTIMONIAL_HEIGHT_CLASSES = [
	"h-[260px] md:h-[320px] lg:h-[75vh]", // long
	"h-[190px] md:h-[220px] lg:h-[65vh]", // short
	"h-[320px] md:h-[400px] lg:h-[85vh]", // extra long
];

// --- Image Card ---
function ImageCard({
	card,
	is4k,
	onImageClick,
	index = 0,
}: {
	card: TestimonialCard;
	is4k?: boolean;
	onImageClick?: (images: string[], index: number) => void;
	index?: number;
}) {
	const { idx, hovered, setHovered, next, prev, touchBind } = useSlideshow(
		card.images,
	);
	if (!card.images.length) return null;
	const heightClass = HEIGHT_CLASSES[index % 3];
	if (card.id == "others") {
		return <OtherFeatures />;
	} else {
		return (
			<div className="masonry-item mb-3 sm:mb-4 break-inside-avoid">
				<div
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					{...touchBind}
					onClick={() => onImageClick?.(card.images, idx)}
					className={`showcase-card relative ${heightClass} w-[auto] overflow-hidden rounded-xl cursor-pointer group select-none`}
				>
					<div
						className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
						style={{ transform: `translateX(-${idx * 100}%)` }}
					>
						{card.images.map((img, i) => (
							<img
								key={i}
								src={img}
								alt=""
								draggable={false}
								className="w-full h-full object-cover object-top flex-shrink-0"
								loading="lazy"
							/>
						))}
					</div>
					{card.images.length > 1 && (
						<>
							<button
								onClick={(e) => {
									e.stopPropagation();
									prev();
								}}
								className="hidden md:flex items-center justify-center absolute z-30 top-1/2 left-2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 hover:bg-background/90 border border-border text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300"
							>
								<ChevronLeft size={16} />
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									next();
								}}
								className="hidden md:flex items-center justify-center absolute z-30 top-1/2 right-2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 hover:bg-background/90 border border-border text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300"
							>
								<ChevronRight size={16} />
							</button>
						</>
					)}
					<Dots count={card.images.length} active={idx} />
					{is4k && (
						<div className="absolute top-2.5 right-2.5 z-20 bg-brand/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
							4K
						</div>
					)}
					<div
						className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none rounded-xl"
						style={{
							background:
								"linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.6) 100%)",
						}}
					/>
				</div>
			</div>
		);
	}
}

// --- Testimonial Card ---
function TestimonialCardComponent({
	card,
	onImageClick,
	index = 0,
}: {
	card: TestimonialCard;
	onImageClick?: (images: string[], index: number) => void;
	index?: number;
}) {
	const { idx, hovered, setHovered, next, prev, touchBind } = useSlideshow(
		card.images,
	);
	if (!card.images.length) return null;
	const heightClass = TESTIMONIAL_HEIGHT_CLASSES[index % 3];
	return (
		<div className="masonry-item mb-3 sm:mb-4 break-inside-avoid">
			<div
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				{...touchBind}
				onClick={() => onImageClick?.(card.images, idx)}
				className={`showcase-card relative ${heightClass} w-full overflow-hidden rounded-xl cursor-pointer group select-none`}
			>
				<div
					className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
					style={{ transform: `translateX(-${idx * 100}%)` }}
				>
					{card.images.map((img, i) => (
						<img
							key={i}
							src={img}
							alt=""
							draggable={false}
							className="w-full h-full object-cover object-top flex-shrink-0"
							loading="lazy"
						/>
					))}
				</div>
				<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
				{card.images.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.stopPropagation();
								prev();
							}}
							className="hidden md:flex items-center justify-center absolute z-30 top-1/2 left-2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 hover:bg-background/90 border border-border text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300"
						>
							<ChevronLeft size={16} />
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								next();
							}}
							className="hidden md:flex items-center justify-center absolute z-30 top-1/2 right-2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 hover:bg-background/90 border border-border text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300"
						>
							<ChevronRight size={16} />
						</button>
					</>
				)}
				<Dots count={card.images.length} active={idx} />
				{card.testimonial && (
					<div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
						<span
							className="text-[9px] font-bold tracking-widest uppercase mb-1 block"
							style={{ color: "var(--brand, #a78bfa)" }}
						>
							{card.testimonial.time}
						</span>
						<h4 className="text-white font-bold text-sm sm:text-base mb-1 leading-tight">
							{card.testimonial.title}
						</h4>
						<p className="text-gray-200 text-[10px] sm:text-xs italic leading-snug opacity-90 line-clamp-3">
							"{card.testimonial.text}"
						</p>
						{card.testimonial.author && (
							<div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
								<div
									className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold"
									style={{ color: "var(--brand, #a78bfa)" }}
								>
									{card.testimonial.author.charAt(0)}
								</div>
								<span className="text-white/60 text-[10px] font-medium">
									{card.testimonial.author}
								</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

// --- Section ---
function TestimonialSection({
	section,
	onImageClick,
}: {
	section: Section;
	onImageClick?: (images: string[], index: number) => void;
}) {
	const is4k = section.id === "4k";
	return (
		<div id={section.id} className="mb-14 sm:mb-20 scroll-mt-24">
			<div className="mb-5 sm:mb-7 border-b border-border/50 pb-3">
				<div className="flex items-center gap-2 mb-1">
					<div
						className="h-px w-4"
						style={{ background: "var(--brand, #a78bfa)" }}
					/>
					<p
						className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase font-bold"
						style={{ color: "var(--brand, #a78bfa)" }}
					>
						COLLECTION
					</p>
				</div>
				<h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-foreground">
					{section.title}
				</h2>
			</div>
			{section.id === "others" ? (
				<OtherFeatures />
			) : (
				<div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
					{section.items
						.filter((c) => c.images.length > 0)
						.map((card, i) => {
							return card.testimonial ? (
								<TestimonialCardComponent
									key={card.id}
									card={card}
									index={i}
									onImageClick={onImageClick}
								/>
							) : (
								<ImageCard
									key={card.id}
									card={card}
									is4k={is4k}
									onImageClick={onImageClick}
									index={i}
								/>
							);
						})}
				</div>
			)}
		</div>
	);
}

// --- Sidebar ---
function Sidebar({
	sections,
	activeId,
	onNav,
}: {
	sections: Section[];
	activeId: string;
	onNav: (id: string) => void;
}) {
	const [mobileNavVisible, setMobileNavVisible] = useState(true);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const onScroll = () => {
			const currentY = window.scrollY;
			if (currentY - lastScrollY.current > 10) {
				setMobileNavVisible(false); // scrolling down
			} else if (lastScrollY.current - currentY > 10) {
				setMobileNavVisible(true); // scrolling up
			}
			lastScrollY.current = currentY;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<aside className="sticky w-[280px] z-[40] border-r border-border top-[80px] p-8 bottom-0 h-[calc(100vh-80px)] bg-background/50 backdrop-blur-md hidden lg:block">
				<div className="mb-10">
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">
						Discovery
					</p>
					<h4 className="text-2xl font-bold text-foreground">
						Our <span className="text-brand-gradient">Showcase</span>
					</h4>
				</div>
				<ul className="space-y-1">
					{sections.map((s) => {
						const a = activeId === s.id;
						return (
							<li key={s.id}>
								<button
									onClick={() => onNav(s.id)}
									className="group flex items-center gap-2 w-full text-left py-2 transition-all duration-300"
								>
									<span
										className="block h-px shrink-0 transition-all"
										style={{
											width: a ? 32 : 12,
											backgroundColor: a ? "var(--brand)" : "var(--border)",
											transitionDuration: "400ms",
										}}
									/>
									<span
										className="text-base transition-all duration-300"
										style={{
											color: a
												? "var(--foreground)"
												: "var(--muted-foreground)",
											fontWeight: a ? 700 : 500,
										}}
									>
										{s.label}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</aside>
			<nav
				className="lg:hidden sticky top-[76px] w-screen z-[40] bg-background border-b border-border py-3 px-4 sm:px-8 transition-transform duration-300"
				style={{
					transform: mobileNavVisible ? "translateY(0)" : "translateY(-110%)",
				}}
			>
				<div className="text-center mb-3">
					<p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-0.5">
						Discovery
					</p>
					<h2 className="font-bold text-foreground">
						Our <span className="text-brand-gradient">Showcase</span>
					</h2>
				</div>
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
					{sections.map((s) => {
						const a = activeId === s.id;
						return (
							<button
								key={s.id}
								onClick={() => onNav(s.id)}
								className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider py-2 px-1 rounded-full border transition-all duration-300 text-center truncate ${a ? "bg-brand/10 border-brand text-brand shadow-sm" : "bg-muted/10 border-border text-muted-foreground hover:border-muted-foreground/30"}`}
							>
								{s.label}
							</button>
						);
					})}
				</div>
			</nav>
		</>
	);
}

// --- Main ---
export default function ClientShowcase() {
	const [activeId, setActiveId] = useState(SECTIONS[0].id);
	const [lightboxData, setLightboxData] = useState<{
		images: string[];
		index: number;
	} | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observers: IntersectionObserver[] = [];
		SECTIONS.forEach((section) => {
			const el = document.getElementById(section.id);
			if (!el) return;
			const obs = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) setActiveId(section.id);
				},
				{ rootMargin: "-40% 0px -50% 0px", threshold: 0 },
			);
			obs.observe(el);
			observers.push(obs);
		});
		return () => observers.forEach((o) => o.disconnect());
	}, []);

	const handleNav = useCallback((id: string) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
	}, []);

	return (
		<div className="min-h-screen flex  flex-col lg:flex-row items-start bg-background text-foreground transition-colors duration-300 font-sans">
			<style>{`
				@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
				@keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
				.animate-slideInRight { animation: slideInRight 0.5s ease-in-out forwards; }
				.animate-slideInLeft { animation: slideInLeft 0.5s ease-in-out forwards; }
				.showcase-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
				.showcase-card:hover { transform: translateY(-4px); }
			`}</style>

			<Sidebar sections={SECTIONS} activeId={activeId} onNav={handleNav} />

			<div className="flex-1 w-full border-t border-border pt-6 lg:mt-20 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
				<div ref={containerRef}>
					{SECTIONS.map((section) => (
						<TestimonialSection
							key={section.id}
							section={section}
							onImageClick={(images, index) => setLightboxData({ images, index })}
						/>
					))}
				</div>
			</div>

			{lightboxData && (
				<LightboxModal
					images={lightboxData.images}
					initialIndex={lightboxData.index}
					onClose={() => setLightboxData(null)}
				/>
			)}
		</div>
	);
}
