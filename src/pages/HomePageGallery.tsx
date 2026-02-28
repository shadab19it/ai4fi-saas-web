import { useState, useEffect, useRef } from "react";
import modelGalleryList from "../services/ModelGallery";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedModel } from "../store/modelSlice";
import { Search, Check, X, MousePointer2, ChevronLeft, ChevronRight, ChevronDown, Camera, Sparkles, Layout, Shirt } from "lucide-react";
import "./HomePageGallery.css";

/* ─── DATA ─────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "women",
    label: "Women",
    icon: "♀",
    color: "#d4af7a",
    rgb: "212, 175, 122",
  },
  {
    id: "men",
    label: "Men",
    icon: "♂",
    color: "#7ab8d4",
    rgb: "122, 184, 212",
  },
  {
    id: "boys",
    label: "Boys",
    icon: "◇",
    color: "#7ad4a8",
    rgb: "122, 212, 168",
  },
  {
    id: "girls",
    label: "Girls",
    icon: "✦",
    color: "#d47ab8",
    rgb: "212, 122, 184",
  },
  {
    id: "baby",
    label: "Baby",
    icon: "◎",
    color: "#d4c87a",
    rgb: "212, 200, 122",
  },
];

const AI_FEATURES = [
  { id: "vto", label: "Virtual Try On", path: "/model-gallery", icon: <Shirt size={14} />, desc: "Transform your look instantly" },
  { id: "pss", label: "Photo Shoot Studio", path: "/product-model-generator", icon: <Camera size={14} />, desc: "Professional AI photoshoots" },
  { id: "ag", label: "Ad Generator", path: "/ads-generator", icon: <Layout size={14} />, desc: "High-converting social ads" },
];

const seeds = {
  women: [
    "cara1",
    "cara2",
    "cara3",
    "cara4",
    "cara5",
    "cara6",
    "cara7",
    "cara8",
    "cara9",
    "cara10",
    "cara11",
    "cara12",
    "cara13",
    "cara14",
    "cara15",
    "cara16",
    "cara17",
    "cara18",
  ],
  men: [
    "men1",
    "men2",
    "men3",
    "men4",
    "men5",
    "men6",
    "men7",
    "men8",
    "men9",
    "men10",
    "men11",
    "men12",
  ],
  boys: ["boy1", "boy2", "boy3", "boy4", "boy5", "boy6", "boy7", "boy8"],
  girls: [
    "girl1",
    "girl2",
    "girl3",
    "girl4",
    "girl5",
    "girl6",
    "girl7",
    "girl8",
  ],
  baby: ["bab1", "bab2", "bab3", "bab4", "bab5", "bab6"],
};

const names = {
  women: [
    "Aria",
    "Luna",
    "Sofia",
    "Maya",
    "Zara",
    "Elena",
    "Nora",
    "Priya",
    "Leila",
    "Ines",
    "Camila",
    "Mia",
    "Yuki",
    "Sara",
    "Aisha",
    "Ruby",
    "Grace",
    "Lily",
  ],
  men: [
    "Ethan",
    "Noah",
    "Liam",
    "James",
    "Omar",
    "Kai",
    "Leo",
    "Ravi",
    "Marcus",
    "Drew",
    "Alex",
    "Sam",
  ],
  boys: ["Finn", "Eli", "Max", "Jake", "Remy", "Cole", "Theo", "Ben"],
  girls: ["Emma", "Ava", "Chloe", "Bella", "Zoey", "Nina", "Isla", "Hana"],
  baby: ["Cub·A", "Cub·B", "Cub·C", "Cub·D", "Cub·E", "Cub·F"],
};

// Varying aspect ratios for editorial masonry feel
const aspects = [
  "1/1",
  "3/4",
  "2/3",
  "3/4",
  "3/4",
  "4/5",
  "3/4",
  "2/3",
  "3/4",
  "3/4",
  "3/4",
  "2/3",
  "3/4",
  "4/5",
  "3/4",
  "3/4",
  "3/4",
  "3/4",
];


const buildModels = (catId: string) => {
  const mapping: Record<string, string> = {
    women: "female",
    men: "male",
    boys: "boy",
    girls: "girl",
    baby: "baby",
  };

  const targetCategory = mapping[catId] || catId;
  const categoryData = modelGalleryList.find((item: any) => item.category === targetCategory);

  let images: string[] = categoryData ? categoryData.images : [];

  if (images.length === 0) {
    // Fallback if no images found in service
    const seedList = seeds[catId as keyof typeof seeds] || [];
    images = seedList.map((seed) => `https://picsum.photos/seed/${seed}/400/520`);
  }

  return images.map((imgUrl, i) => ({
    id: `${catId}-${i}`,
    cat: catId,
    name:
      (names[catId as keyof typeof names] || [])[i] ||
      `${catId.charAt(0).toUpperCase() + catId.slice(1)} Model ${i + 1}`,
    img: imgUrl,
    hero: i === 0,
    aspect: "1/1", // Square aspect ratio is better for face focuses
  }));
};

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function HomePageGallery() {
  const [activeCat, setActiveCat] = useState("women");
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [showFeatureDropdown, setShowFeatureDropdown] = useState(false);
  const [showTrayToolDropdown, setShowTrayToolDropdown] = useState(false);
  const [activeTrayTool, setActiveTrayTool] = useState("vto");
  const featureRef = useRef<HTMLDivElement>(null);
  const trayToolRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedModel } = useSelector((state: RootState) => state.modelList);

  const trayRef = useRef<HTMLDivElement>(null);
  const cat = CATEGORIES.find((c) => c.id === activeCat) || CATEGORIES[0];
  const models = buildModels(activeCat);
  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeTool = AI_FEATURES.find(f => f.id === activeTrayTool) || AI_FEATURES[0];

  const scrollTray = (dir: "left" | "right") => {
    if (trayRef.current) {
      const scrollAmount = 200;
      trayRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggle = (imgUrl: string) => {
    dispatch(setSelectedModel(imgUrl));
  };

  // Track mouse for spotlight
  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);

    const handleClickOutside = (e: MouseEvent) => {
      if (featureRef.current && !featureRef.current.contains(e.target as Node)) {
        setShowFeatureDropdown(false);
      }
      if (trayToolRef.current && !trayToolRef.current.contains(e.target as Node)) {
        setShowTrayToolDropdown(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search on tab switch
  useEffect(() => setSearch(""), [activeCat]);

  // Handle body scroll and global navbar when modal is open
  useEffect(() => {
    if (modalIdx !== null) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [modalIdx]);

  return (
    <div
      className="gallery-root relative"
      style={
        {
          "--cat-color": cat.color,
          "--cat-color-rgb": cat.rgb,
        } as React.CSSProperties
      }
    >
      {/* Ambient cursor glow */}
      <div
        className="glow-blob"
        style={{
          left: cursor.x,
          top: cursor.y,
          background: `radial-gradient(circle, ${cat.color} 0%, transparent 65%)`,
        }}
      />

      <div className="gallery-body ">
        {/* ── RAIL (Inner Sidebar) ── */}
        <aside className="rail sticky top-[80px] h-[calc(100vh-100px)]">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`rail-btn${activeCat === c.id ? " active" : ""}`}
              style={
                activeCat === c.id
                  ? ({
                    "--cat-color": c.color,
                    "--cat-color-rgb": c.rgb,
                  } as React.CSSProperties)
                  : {}
              }
              onClick={() => setActiveCat(c.id)}
            >
              <span className="rail-pip" />
              <span className="rail-icon">{c.icon}</span>
              <span className="rail-label font-bold">{c.label}</span>
            </button>
          ))}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="gallery-main">
          {/* Header Area */}
          <div className="gallery-header">
            <div className="header-left">
              <div className="header-feature-selector" ref={featureRef}>
                <div
                  className={`feature-trigger ${showFeatureDropdown ? "active" : ""}`}
                  onClick={() => setShowFeatureDropdown(!showFeatureDropdown)}
                >
                  <span className="eyebrow-line" />
                  <span className="trigger-label">
                    {activeTool.label}
                    <ChevronDown size={12} className={`chevron ${showFeatureDropdown ? "up" : ""}`} />
                  </span>
                  <span className="eyebrow-line" />
                </div>

                {showFeatureDropdown && (
                  <div className="feature-dropdown z-[1000]">
                    {AI_FEATURES.map((f) => (
                      <div
                        key={f.id}
                        className={`feature-item ${f.id === activeTrayTool ? "selected" : ""}`}
                        onClick={() => {
                          setActiveTrayTool(f.id);
                          setShowFeatureDropdown(false);
                        }}
                      >
                        {f.icon}
                        <div className="item-content">
                          <div className="item-label">{f.label}</div>
                          <div className="item-desc">{f.desc}</div>
                        </div>
                        {f.id === activeTrayTool && <Check size={12} className="check-icon" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <h1 className="header-title md:leading-[1.4]">
                Select Your <em>{cat.label}</em> Cast
              </h1>
              <p className="text-sm">
                {filtered.length} models available — click to choose
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="search-wrap">
                <span className="search-icon">
                  <Search size={14} />
                </span>
                <input
                  className="search-input"
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {selectedModel.length > 0 && (
                <div className="count-badge">{selectedModel.length} Selected</div>
              )}
            </div>
          </div>

          {/* Sticky Tray Area */}
          <div className="tray md:flex-row flex-col sticky top-[80px] z-20 border-b border-[var(--gallery-border)] shadow-sm bg-[var(--gallery-bg)]">
            <div className="tray-label md:block hidden">Selection</div>
            <div className="tray-slots-container group relative flex-1 min-w-0">
              <div className="tray-slots" ref={trayRef}>
                {selectedModel.length === 0 ? (
                  <div className="tray-empty">
                    Select models from the gallery to begin your {activeTool.label.toLowerCase()}
                  </div>
                ) : (
                  selectedModel.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="tray-card"
                      onClick={() => toggle(imgUrl)}
                    >
                      <img src={imgUrl} alt="Selected Model" />
                      <div className="tray-remove">
                        <X size={14} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="tray-action-group" ref={trayToolRef}>
              <div className="tool-selector-wrap">
                <div
                  className={`tool-trigger ${showTrayToolDropdown ? 'active' : ''}`}
                  onClick={() => setShowTrayToolDropdown(!showTrayToolDropdown)}
                >
                  {activeTool.icon}
                  <span className="tool-name">
                    {activeTool.label}
                  </span>
                  <ChevronDown size={14} className={`chevron ${showTrayToolDropdown ? 'up' : ''}`} />
                </div>

                {showTrayToolDropdown && (
                  <div className="tool-dropdown top-full mt-2 z-[1001]">
                    {AI_FEATURES.map((f) => (
                      <div
                        key={f.id}
                        className={`tool-item ${f.id === activeTrayTool ? "selected" : ""}`}
                        onClick={() => {
                          setActiveTrayTool(f.id);
                          setShowTrayToolDropdown(false);
                        }}
                      >
                        {f.icon}
                        <div className="item-content">
                          <div className="item-label">{f.label}</div>
                        </div>
                        {f.id === activeTrayTool && <Check size={12} className="check-icon" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="proceed-btn"
                disabled={selectedModel.length === 0}
                onClick={() => {
                  const path = activeTrayTool === 'vto' ? '/virtualtryon' : activeTool?.path;
                  if (path) navigate(path, { state: { from: "gallery", selectedModels: selectedModel } });
                }}
              >
                {activeTrayTool === 'vto' ? 'Start Try-On' : `Open ${activeTool.label}`}
                {selectedModel.length > 0 && (
                  <span className="proceed-count">{selectedModel.length}</span>
                )}
              </button>
            </div>
          </div>

          {/* Grid Area */}
          <div className="grid-area">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <MousePointer2 size={48} className="mb-4" />
                <p className="font-serif text-xl italic">
                  No models found for "{search}"
                </p>
              </div>
            ) : (
              <div className="masonry">
                {filtered.map((m, i) => (
                  <div
                    key={m.id}
                    className="card-wrap"
                    style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
                  >
                    <div
                      className={`model-card${selectedModel.includes(m.img) ? " sel" : ""}`}
                      onClick={() => setModalIdx(i)}
                    >
                      <div
                        style={{
                          paddingTop:
                            m.aspect === "2/3"
                              ? "150%"
                              : m.aspect === "4/5"
                                ? "125%"
                                : "133%",
                          position: "relative",
                        }}
                      >
                        <img
                          className="card-img"
                          src={m.img}
                          alt={m.name}
                          loading="lazy"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                        <div className="card-cinematic" />
                        {(selectedModel.length == 0 || selectedModel.includes(m.img)) && <div
                          className="tick-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(m.img);
                          }}
                        >
                          {selectedModel.includes(m.img) ? (
                            <Check size={12} />
                          ) : (
                            <span>+</span>
                          )}
                        </div>}
                        {m.hero && <div className="hero-badge">Featured</div>}
                        <div className="card-info">
                          <div className="info-name">{m.name}</div>
                          <div className="info-sub">
                            {cat.label} Collection
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selection Tray / Bottom Action Bar */}

        </div>
        {/* /gallery-body */}

        {/* ─── MODAL GALLERY ─── */}
        {modalIdx !== null && (
          <div className="modal-gallery" onClick={() => setModalIdx(null)}>
            <div className="modal-content">
              <button className="modal-close" onClick={() => setModalIdx(null)}>
                <X size={24} />
              </button>

              <button
                className="modal-nav prev"
                disabled={modalIdx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalIdx(modalIdx - 1);
                }}
              >
                <ChevronLeft size={32} />
              </button>

              <div className="modal-viewer">
                <div className="modal-img-wrap">
                  <img
                    src={filtered[modalIdx].img}
                    alt={filtered[modalIdx].name}
                    className="modal-img"
                  />
                  <div className="modal-meta">
                    <h2 className="modal-name">{filtered[modalIdx].name}</h2>
                    <p className="modal-sub">
                      {cat.label} · AI Generated Collection
                    </p>
                    <button
                      className={`modal-select-btn${selectedModel.includes(filtered[modalIdx].img) ? " selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(filtered[modalIdx].img);
                      }}
                    >
                      {selectedModel.includes(filtered[modalIdx].img)
                        ? "Remove from Cast"
                        : "Add to Cast"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="modal-nav next"
                disabled={modalIdx === filtered.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalIdx(modalIdx + 1);
                }}
              >
                <ChevronRight size={32} />
              </button>

              <div className="modal-counter">
                {modalIdx + 1} / {filtered.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
