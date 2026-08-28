export interface ProductSpecItem {
  label: string;
  value: string;
  category: "Performance" | "Display" | "Camera & Audio" | "Battery & Power" | "Connectivity" | "Guarantee";
  iconName?: string;
}

export interface DetailedSpecs {
  processor: string;
  ram: string;
  storage: string;
  display: string;
  camera: string;
  battery: string;
  connectivity: string;
  condition: string;
  warranty: string;
  modelYear: string | number;
  os: string;
  allSpecs: ProductSpecItem[];
}

export function getCompleteProductSpecs(device: any, listing?: any): DetailedSpecs {
  const brand = (device?.brand || "").trim();
  const model = (device?.model || "").trim();
  const category = (device?.category || "Phones").trim();
  const year = device?.year || 2023;
  const storage = device?.storage && device?.storage !== "N/A" ? device.storage : "Standard Storage";
  const ram = device?.ram && device?.ram !== "N/A" ? device.ram : "Optimized RAM";
  const color = device?.color || "Midnight";
  const condition = listing?.condition === "PRISTINE" ? "Grade A+ (Pristine Like-New)" : listing?.condition === "EXCELLENT" ? "Grade A (Excellent)" : "Grade B+ (Certified Good)";
  const warranty = "12-Month ReTech Certified Hardware Guarantee";

  let processor = "High-Efficiency Multi-Core Processor";
  let display = "Retina Display with True Tone";
  let camera = "Advanced 12MP System with 4K Video";
  let battery = "Verified 100% Tested Lithium-Ion (All-Day)";
  let connectivity = "5G, Wi-Fi 6, Bluetooth 5.3, USB-C";
  let os = "iOS / Latest Stable OS";

  const modelLower = model.toLowerCase();
  const brandLower = brand.toLowerCase();

  // 1. PHONES
  if (category === "Phones" || modelLower.includes("iphone") || modelLower.includes("galaxy s") || modelLower.includes("pixel")) {
    if (brandLower.includes("apple") || modelLower.includes("iphone")) {
      os = "iOS 18 (Supported & Upgradable)";
      if (modelLower.includes("15 pro")) {
        processor = "Apple A17 Pro (3nm, 6-core GPU, Hardware Ray Tracing)";
        display = "6.1\" Super Retina XDR OLED (120Hz ProMotion, 2000 nits, Dynamic Island)";
        camera = "48MP Main (f/1.78) + 12MP Ultra Wide + 12MP 3x Telephoto, 4K60 ProRes";
        battery = "3274 mAh (100% Diagnostic Health, MagSafe 15W)";
        connectivity = "5G Ultra Wideband, Wi-Fi 6E, USB-C 3.0 (10Gbps), NFC, Bluetooth 5.3";
      } else if (modelLower.includes("15")) {
        processor = "Apple A16 Bionic (5-core GPU, 16-core Neural Engine)";
        display = "6.1\" Super Retina XDR OLED (Dynamic Island, 2000 nits peak)";
        camera = "48MP Main 2x Telephoto + 12MP Ultra-Wide, Smart HDR 5, 4K Dolby Vision";
        battery = "3349 mAh (Tested Grade A, 20hr Video Playback)";
        connectivity = "5G Sub-6/mmWave, Wi-Fi 6, USB-C 2.0, NFC, Bluetooth 5.3";
      } else if (modelLower.includes("14 pro max")) {
        processor = "Apple A16 Bionic (6-core CPU, 5-core GPU)";
        display = "6.7\" Super Retina XDR OLED (120Hz ProMotion, Always-On, Dynamic Island)";
        camera = "48MP Quad-Pixel Main + 12MP 3x Telephoto + 12MP Ultra-Wide, Action Mode";
        battery = "4323 mAh (Tested 98%+ Capacity, 29hr Video Playback)";
        connectivity = "5G, Wi-Fi 6, Lightning, Emergency SOS via Satellite, Bluetooth 5.3";
      } else if (modelLower.includes("14")) {
        processor = "Apple A15 Bionic with 5-core GPU & 16-core Neural Engine";
        display = "6.1\" Super Retina XDR OLED (800 nits typ, 1200 nits HDR)";
        camera = "12MP Main (f/1.5 Photonic Engine) + 12MP Ultra-Wide, 4K HDR Cinematic";
        battery = "3279 mAh (Verified Battery Health 99%, 20hr Video)";
        connectivity = "5G Dual SIM/eSIM, Wi-Fi 6, Lightning, Bluetooth 5.3, NFC";
      } else if (modelLower.includes("13 pro")) {
        processor = "Apple A15 Bionic (6-core CPU, 5-core GPU)";
        display = "6.1\" Super Retina XDR OLED with ProMotion 120Hz Refresh Rate";
        camera = "Triple 12MP Pro System (Telephoto 3x, Wide f/1.5, Ultra-Wide Macro)";
        battery = "3095 mAh (Tested 96%+ Health, 22hr Video)";
        connectivity = "5G Sub-6, Wi-Fi 6, Lightning, NFC Apple Pay, Bluetooth 5.0";
      } else if (modelLower.includes("13")) {
        processor = "Apple A15 Bionic (4-core GPU, 16-core Neural Engine)";
        display = "6.1\" Super Retina XDR OLED (Super Sharp 460 ppi)";
        camera = "Dual 12MP Wide & Ultra-Wide with Sensor-Shift OIS & Cinematic Mode";
        battery = "3227 mAh (Tested Grade A, 19hr Video Playback)";
        connectivity = "5G, Wi-Fi 6, Lightning, NFC, Bluetooth 5.0";
      } else if (modelLower.includes("12 pro")) {
        processor = "Apple A14 Bionic (5nm First Generation, 4-core GPU)";
        display = "6.1\" Super Retina XDR OLED Ceramic Shield Glass";
        camera = "Triple 12MP System with LiDAR Scanner for Night Portrait & AR";
        battery = "2815 mAh (Tested Refurbished Battery, 17hr Video)";
        connectivity = "5G Sub-6, Wi-Fi 6, Lightning, NFC, Bluetooth 5.0";
      } else if (modelLower.includes("se")) {
        processor = "Apple A15 Bionic (Same Flagship Silicon as iPhone 13)";
        display = "4.7\" Retina HD IPS Display with Touch ID Home Button";
        camera = "12MP Wide Camera (f/1.8, Deep Fusion, Smart HDR 4)";
        battery = "2018 mAh (Optimized Compact Battery, 15hr Video)";
        connectivity = "5G Sub-6, Wi-Fi 6, Lightning, Touch ID, Bluetooth 5.0";
      }
    } else if (brandLower.includes("samsung") || modelLower.includes("galaxy")) {
      os = "Android 14 / One UI 6.1 with Galaxy AI";
      if (modelLower.includes("s24 ultra")) {
        processor = "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm Octa-Core)";
        display = "6.8\" Dynamic AMOLED 2X QHD+ (1-120Hz LTPO, 2600 nits, Anti-Reflective)";
        camera = "200MP Main OIS + 50MP 5x Optical + 10MP 3x Optical + 12MP Ultra-Wide, 8K30 Video";
        battery = "5000 mAh (Tested Grade A+, 45W Super Fast Charging 2.0)";
        connectivity = "5G mmWave/Sub-6, Wi-Fi 7, S-Pen Integrated, Bluetooth 5.3, Ultra-Wideband (UWB)";
      } else if (modelLower.includes("s23")) {
        processor = "Qualcomm Snapdragon 8 Gen 2 for Galaxy (4nm)";
        display = "6.1\" Dynamic AMOLED 2X FHD+ (48-120Hz, 1750 nits peak)";
        camera = "50MP Main OIS + 10MP 3x Telephoto + 12MP Ultra-Wide, Nightography";
        battery = "3900 mAh (Tested Health, 25W Fast Charge, Wireless PowerShare)";
        connectivity = "5G Sub-6, Wi-Fi 6E, USB-C 3.2, Bluetooth 5.3, NFC";
      } else if (modelLower.includes("flip")) {
        processor = "Qualcomm Snapdragon 8 Gen 2 Foldable Platform";
        display = "6.7\" Foldable Dynamic AMOLED 2X (120Hz) + 3.4\" Super AMOLED Flex Window";
        camera = "Dual 12MP Wide OIS + 12MP Ultra-Wide with Flex Mode Hands-Free Video";
        battery = "3700 mAh Dual-Cell Battery (Fast Charge, Qi Wireless)";
        connectivity = "5G, Wi-Fi 6E, Armor Aluminum Frame, IPX8 Water Resistance";
      }
    } else if (brandLower.includes("oneplus")) {
      os = "OxygenOS 14 (Android 14)";
      processor = modelLower.includes("12") ? "Snapdragon 8 Gen 3 (3.3GHz)" : "Snapdragon 8+ Gen 1";
      display = "6.82\" 2K ProXDR OLED (1-120Hz LTPO 4.0, 4500 nits peak brightness)";
      camera = "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultra-Wide (Hasselblad Color)";
      battery = "5400 mAh Dual-Cell with 100W SUPERVOOC Ultra-Fast Charging";
      connectivity = "5G Dual SIM, Wi-Fi 7, Bluetooth 5.4, USB-C 3.2 Gen 1, IR Blaster";
    } else if (brandLower.includes("google") || modelLower.includes("pixel")) {
      os = "Stock Android 14 (7 Years Guaranteed OS Updates)";
      processor = modelLower.includes("8") ? "Google Tensor G3 AI Chip with Titan M2 Security" : "Google Tensor G2";
      display = "6.7\" Super Actua OLED (1-120Hz LTPO, 2400 nits HDR)";
      camera = "50MP Octa PD Main + 48MP 5x Quad PD Telephoto + 48MP Ultra-Wide with Macro Focus";
      battery = "5050 mAh (Tested Diagnostic Health, 30W Fast Charging, Qi Wireless)";
      connectivity = "5G mmWave/Sub-6, Wi-Fi 7, Ultra-Wideband, Bluetooth 5.3, NFC";
    } else if (brandLower.includes("xiaomi")) {
      os = "Xiaomi HyperOS (Android 14)";
      processor = "Qualcomm Snapdragon 8 Gen 3 (4nm TSMC)";
      display = "6.73\" 2K C8 OLED (1-120Hz LTPO, 3000 nits, Dolby Vision)";
      camera = "Triple 50MP Leica Summilux Optics with Variable Aperture (f/1.42 - f/4.0)";
      battery = "4880 mAh (120W HyperCharge Wired, 50W Wireless)";
      connectivity = "5G Dual SIM, Wi-Fi 7, USB-C 3.2 Gen 2, Bluetooth 5.4";
    } else if (brandLower.includes("nothing")) {
      os = "Nothing OS 2.5 (Clean Android 14)";
      processor = "Snapdragon 8+ Gen 1 (4nm TSMC Flagship)";
      display = "6.7\" Flexible OLED (1-120Hz LTPO, 1600 nits peak)";
      camera = "Dual 50MP Sony IMX890 OIS + 50MP Samsung JN1 Ultra-Wide with Glyph Fill Light";
      battery = "4700 mAh (45W Fast Charging, 15W Wireless, 5W Reverse)";
      connectivity = "5G, Glyph Interface 33 LED Zones, Wi-Fi 6, Bluetooth 5.3";
    }
  }

  // 2. LAPTOPS
  else if (category === "Laptops" || modelLower.includes("macbook") || modelLower.includes("xps") || modelLower.includes("thinkpad") || modelLower.includes("spectre")) {
    if (brandLower.includes("apple") || modelLower.includes("macbook")) {
      os = "macOS Sonoma / Sequoia";
      if (modelLower.includes("m3 max")) {
        processor = "Apple M3 Max (14-core CPU, 30-core GPU, Hardware Mesh Shading)";
        display = "16.2\" Liquid Retina XDR (3456x2234, 120Hz ProMotion, 1600 nits peak HDR)";
        camera = "1080p FaceTime HD Camera with Advanced Image Signal Processor";
        battery = "100Wh Lithium-Polymer (Up to 22hr Battery, 140W USB-C Fast Charger)";
        connectivity = "Wi-Fi 6E, Bluetooth 5.3, 3x Thunderbolt 4, HDMI 2.1, SDXC Slot, MagSafe 3";
      } else if (modelLower.includes("m2")) {
        processor = "Apple M2 Chip (8-core CPU, 10-core GPU, 100GB/s Memory Bandwidth)";
        display = "15.3\" Liquid Retina IPS Display (2880x1864, 500 nits, P3 Wide Color)";
        camera = "1080p FaceTime HD Camera with Spatial Audio 6-Speaker System";
        battery = "66.5Wh Battery (Up to 18hr Battery, MagSafe 3 Fast Charge)";
        connectivity = "Wi-Fi 6, Bluetooth 5.3, 2x Thunderbolt / USB 4, 3.5mm Headphone Jack";
      } else {
        processor = "Apple M1 Chip (8-core CPU, 7-core GPU, Fanless Silent Design)";
        display = "13.3\" Retina LED-backlit Display (2560x1600, 400 nits, P3 Wide Color)";
        camera = "720p FaceTime HD Camera with Neural Engine Face Detection";
        battery = "49.9Wh Battery (Up to 18hr Battery, 30W USB-C Adapter)";
        connectivity = "Wi-Fi 6, Bluetooth 5.0, 2x Thunderbolt / USB 4 Ports";
      }
    } else if (brandLower.includes("dell") || modelLower.includes("xps")) {
      os = "Windows 11 Pro 64-bit";
      processor = "13th Gen Intel Core i7-1360P (12-Core, up to 5.0GHz Turbo)";
      display = "13.4\" 3.5K OLED Touch InfinityEdge (400 nits, 100% DCI-P3)";
      camera = "720p at 30 fps HD RGB camera + 400p IR camera with Windows Hello";
      battery = "55Wh Integrated Battery with 60W Type-C AC Adapter";
      connectivity = "Wi-Fi 6E AX211, Bluetooth 5.2, 2x Thunderbolt 4 (USB Type-C)";
    } else if (brandLower.includes("hp") || modelLower.includes("spectre")) {
      os = "Windows 11 Home 64-bit";
      processor = "Intel Evo Core i7-13700H (14-Core, 20-Threads, up to 5.0GHz)";
      display = "14.0\" 2.8K OLED Touch 360° Convertible (400 nits, 100% DCI-P3)";
      camera = "HP True Vision 5MP IR camera with camera shutter & temporal noise reduction";
      battery = "66Wh 4-cell Li-ion polymer (Up to 13.5 hours battery life)";
      connectivity = "Wi-Fi 6E, Bluetooth 5.3, 2x Thunderbolt 4, 1x USB-A 10Gbps, MicroSD";
    } else if (brandLower.includes("lenovo") || modelLower.includes("thinkpad")) {
      os = "Windows 11 Pro Enterprise";
      processor = "Intel Core i7-1365U vPro (10-Core, up to 5.2GHz, 12MB Cache)";
      display = "14.0\" 2.8K OLED Anti-Glare (400 nits, 100% DCI-P3, Eyesafe Certified)";
      camera = "1080p FHD RGB+IR webcam with Privacy Shutter & Human Presence Detection";
      battery = "57Wh Rapid Charge Battery (80% in 60 minutes with 65W USB-C)";
      connectivity = "Wi-Fi 6E, Bluetooth 5.1, 2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.1";
    } else if (brandLower.includes("asus") || modelLower.includes("zenbook")) {
      os = "Windows 11 Home";
      processor = "Intel Core i7-1360P / AMD Ryzen 7 7730U Octa-Core";
      display = "14.0\" 2.8K (2880x1800) OLED 90Hz 16:10 (0.2ms response, 600 nits peak)";
      camera = "FHD camera with IR function to support Windows Hello";
      battery = "75Wh 4-cell Li-ion (Up to 18 hours runtime, 65W Type-C Easy Charge)";
      connectivity = "Wi-Fi 6E Dual-Band, Bluetooth 5.3, 2x Thunderbolt 4, HDMI 2.1 TMDS";
    } else if (brandLower.includes("acer") || modelLower.includes("swift")) {
      os = "Windows 11 Home";
      processor = "Intel Core i5-13500H (12 Cores, 16 Threads, up to 4.7GHz)";
      display = "14.0\" 2.8K CineCrystal OLED (2880x1800, 90Hz, 100% DCI-P3, 500 nits)";
      camera = "1440p QHD Video Camera with Acer PurifiedVoice AI Noise Reduction";
      battery = "65Wh Li-ion Battery with 100W USB-PD Fast Charging";
      connectivity = "Killer Wi-Fi 6E 1675i, Bluetooth 5.1, 2x USB Type-C Thunderbolt 4, HDMI 2.1";
    }
  }

  // 3. HEADPHONES & AUDIO
  else if (category === "Headphones" || modelLower.includes("wh-1000") || modelLower.includes("airpods") || modelLower.includes("bose") || modelLower.includes("jbl") || modelLower.includes("buds")) {
    display = "Custom Acoustic Driver / LED Status Indicators";
    camera = "Multi-Beamforming Microphones with AI Noise Suppression";
    os = "Proprietary DSP Firmware (App Companion for iOS & Android)";
    if (brandLower.includes("sony") || modelLower.includes("wh-1000")) {
      processor = "Sony Integrated Processor V1 + HD Noise Cancelling Processor QN1";
      camera = "8 Microphones (4 on each ear cup) for Precision Voice Pickup & ANC";
      battery = "30 Hours Playback with ANC ON (3-min charge gives 3 hours)";
      connectivity = "Bluetooth 5.2, LDAC Hi-Res Wireless, Multipoint 2-Device Pairing, 3.5mm Aux";
    } else if (brandLower.includes("bose") || modelLower.includes("quietcomfort")) {
      processor = "Bose Custom Active EQ & Immersive Audio DSP Silicon";
      camera = "Advanced Microphones for 360° Environmental Noise Filtering";
      battery = "24 Hours Battery Life (Up to 18 Hours with Immersive Audio On)";
      connectivity = "Bluetooth 5.3, Snapdragon Sound with aptX Adaptive, SimpleSync, Aux";
    } else if (brandLower.includes("apple") || modelLower.includes("airpods")) {
      processor = modelLower.includes("max") ? "Dual Apple H1 Audio Chips (1 in each ear cup)" : "Apple H2 Headphone Chip";
      camera = "Dual Beamforming Microphones with Inward-Facing Voice Pickup";
      battery = modelLower.includes("max") ? "20 Hours with ANC & Spatial Audio enabled" : "6 Hours Earbuds + 30 Hours Total with MagSafe Case";
      connectivity = "Bluetooth 5.3, Apple Dynamic Head Tracking Spatial Audio, MagSafe/USB-C";
    } else if (brandLower.includes("jbl")) {
      processor = "JBL Pro Sound DSP with True Adaptive Noise Cancelling 2.0";
      camera = "4-Mic Crystal Clear Call Technology with VoiceAware Controls";
      battery = "Up to 50 Hours Playback (30 Hours with True Adaptive ANC)";
      connectivity = "Bluetooth 5.3 LE Audio, Smart Ambient Aware, Fast Pair Google/Microsoft";
    } else if (brandLower.includes("samsung")) {
      processor = "Samsung Seamless Codec (SSC) 24-bit Hi-Fi Audio Silicon";
      camera = "3 High SNR Microphones for 33dB Active Noise Elimination";
      battery = "5 Hours ANC On + 18 Hours Case (Wireless Qi Fast Charge)";
      connectivity = "Bluetooth 5.3, Auto Switch Galaxy Devices, 360 Audio with Direct Multi-Channel";
    } else if (brandLower.includes("beats")) {
      processor = "Custom Beats Acoustic Platform with Class 1 Bluetooth";
      camera = "Upgraded Voice-Targeting Microphones with 27% better clarity";
      battery = "Up to 40 Hours Listening Time (Fast Fuel 10-min charge = 4 hours)";
      connectivity = "Lossless Audio via USB-C, 3.5mm Analog Input, One-touch Apple & Android Pairing";
    }
  }

  // 4. SMART WATCHES
  else if (category === "Smart Watches" || modelLower.includes("watch") || modelLower.includes("fenix") || modelLower.includes("colorfit")) {
    camera = "Bio-Sensors (ECG, SpO2, Optical Heart Rate, Skin Temp)";
    if (brandLower.includes("apple") || modelLower.includes("apple watch")) {
      os = "watchOS 10 / 11";
      if (modelLower.includes("ultra")) {
        processor = "Apple S9 SiP (64-bit Dual Core, 4-core Neural Engine, Double Tap)";
        display = "49mm Aerospace Titanium Case (Always-On Retina OLED, 3000 nits Sapphire)";
        battery = "Up to 36 Hours Normal Use (Up to 72 Hours in Low Power Mode, Fast Charge)";
        connectivity = "Precision Dual-Frequency GPS (L1 & L5), LTE & UMTS Cellular, Wi-Fi 4, UWB Gen 2";
      } else if (modelLower.includes("series 9")) {
        processor = "Apple S9 SiP with Second-Generation Ultra Wideband Chip";
        display = "45mm / 41mm Always-On Retina OLED (Edge-to-Edge 2000 nits)";
        battery = "18 Hours All-Day Battery Life (Fast Magnetic USB-C Charger)";
        connectivity = "GPS/GNSS, Compass, Always-On Altimeter, Blood Oxygen & ECG, Bluetooth 5.3";
      } else {
        processor = "Apple S8 SiP 64-bit Dual Core Processor";
        display = "40mm Retina OLED Display (1000 nits brightness)";
        battery = "18 Hours All-Day Battery Life (Low Power Mode up to 36 Hours)";
        connectivity = "GPS, High-g Accelerometer for Crash Detection, Wi-Fi, Bluetooth 5.3";
      }
    } else if (brandLower.includes("samsung") || modelLower.includes("galaxy watch")) {
      os = "Wear OS Powered by Samsung (One UI 5 Watch)";
      processor = "Exynos W930 (5nm Dual Core 1.4GHz)";
      display = "1.5\" (37.3mm) Super AMOLED (480x480, Sapphire Crystal Glass, Rotating Bezel)";
      battery = "425 mAh (Up to 40 Hours with AOD Off, WPC Wireless Fast Charging)";
      connectivity = "NFC, Dual-Band GPS, Bluetooth 5.3, Wi-Fi 2.4GHz & 5GHz, BioActive Sensor (BIA)";
    } else if (brandLower.includes("garmin") || modelLower.includes("fenix")) {
      os = "Garmin Native Multi-Sport Real-Time OS";
      processor = "Garmin Low-Power Multi-GNSS Satellite Tracking Silicon";
      display = "1.3\" Sunlight-Visible Transflective Memory-in-Pixel (MIP) Solar Sapphire";
      battery = "Up to 22 Days in Smartwatch Mode (with Solar Charging) / 73 Hours GPS";
      connectivity = "Multi-Band SatIQ GPS, Bluetooth, ANT+, Wi-Fi, TopoActive Maps, Garmin Pay";
    } else if (brandLower.includes("noise") || brandLower.includes("boat")) {
      os = "Custom Wearable RTOS with Bluetooth Calling";
      processor = "Single-Chip Bluetooth Calling SoC with TruSync Technology";
      display = "1.96\" AMOLED Display with Always-On Support (500 nits)";
      battery = "7 Days Battery Backup (2 Days with heavy Bluetooth calling)";
      connectivity = "Bluetooth 5.3, Heart Rate & SpO2 Tracker, 100+ Sports Modes, IP68 Waterproof";
    }
  }

  // 5. TABLETS & IPADS
  else if (category === "Tablets" || category === "iPads" || modelLower.includes("ipad") || modelLower.includes("tab") || modelLower.includes("pad")) {
    if (brandLower.includes("ipad") || modelLower.includes("ipad")) {
      os = "iPadOS 17 / 18 (Apple Intelligence Ready)";
      if (modelLower.includes("pro 12.9") || modelLower.includes("pro 11")) {
        processor = "Apple M2 Chip (8-core CPU, 10-core GPU, 16-core Neural Engine)";
        display = modelLower.includes("12.9") ? "12.9\" Liquid Retina XDR (Mini-LED 2D backlight with 2596 dimming zones, 120Hz ProMotion)" : "11\" Liquid Retina LED (120Hz ProMotion, 600 nits, P3 Wide Color)";
        camera = "12MP Wide + 10MP Ultra-Wide with LiDAR Scanner & 12MP TrueDepth Front with Center Stage";
        battery = "40.88Wh Lithium-Polymer (Up to 10 Hours Surfing on Wi-Fi)";
        connectivity = "Wi-Fi 6E (802.11ax), Bluetooth 5.3, Thunderbolt / USB 4, Apple Pencil 2 Hover";
      } else if (modelLower.includes("air")) {
        processor = "Apple M1 Chip (8-core CPU, 8-core Graphics, 8GB Unified RAM)";
        display = "10.9\" Liquid Retina Display (2360x1640, 500 nits, Anti-Reflective Coating)";
        camera = "12MP Wide back camera with 4K video & 12MP Ultra-Wide front with Center Stage";
        battery = "28.6Wh Lithium-Polymer (Up to 10 Hours Wi-Fi browsing)";
        connectivity = "Wi-Fi 6, Bluetooth 5.0, USB-C 3.1 Gen 2 (up to 10Gbps), Touch ID in Top Button";
      } else if (modelLower.includes("mini")) {
        processor = "Apple A15 Bionic (6-core CPU, 5-core GPU, Neural Engine)";
        display = "8.3\" Liquid Retina Display (2266x1488, 500 nits, Wide Color P3, True Tone)";
        camera = "12MP Wide back with Quad-LED True Tone Flash & 12MP Ultra-Wide front";
        battery = "19.3Wh Battery (Up to 10 Hours Wi-Fi web browsing)";
        connectivity = "Wi-Fi 6, Bluetooth 5.0, USB-C (5Gbps), Apple Pencil (2nd Gen) Magnetic Charging";
      } else {
        processor = "Apple A14 Bionic (6-core CPU, 4-core Graphics)";
        display = "10.9\" Liquid Retina Display (2360x1640, 500 nits, True Tone)";
        camera = "12MP Wide back camera & Landscape 12MP Ultra-Wide front with Center Stage";
        battery = "28.6Wh Battery (Up to 10 Hours video playback)";
        connectivity = "Wi-Fi 6, Bluetooth 5.2, USB-C Charging Port, Touch ID";
      }
    } else if (brandLower.includes("samsung") || modelLower.includes("tab s9")) {
      os = "Android 14 with Samsung DeX Desktop Mode";
      processor = "Snapdragon 8 Gen 2 for Galaxy (4nm Flagship Platform)";
      display = "14.6\" Dynamic AMOLED 2X (120Hz, 16:10 ratio, Vision Booster, HDR10+)";
      camera = "13MP + 8MP Ultra-Wide Rear + Dual 12MP Ultra-Wide Front with Auto Framing";
      battery = "11,200 mAh Monster Battery with 45W Fast Charging (S-Pen Included)";
      connectivity = "Wi-Fi 6E, Bluetooth 5.3, USB Type-C 3.2 Gen 1, IP68 Water & Dust Resistant";
    } else if (brandLower.includes("lenovo") || modelLower.includes("tab p12")) {
      os = "Android 13 / 14";
      processor = "Qualcomm Snapdragon 870 5G / MediaTek Dimensity 7050 Octa-Core";
      display = "12.6\" 2.5K AMOLED (2560x1600, 120Hz, HDR10+, Dolby Vision, 600 nits)";
      camera = "13MP Auto-Focus + 5MP Wide Rear & 8MP Fixed-Focus Front with ToF Sensor";
      battery = "10,200 mAh (Up to 14 Hours Streaming, 45W Quick Charge 4.0)";
      connectivity = "Wi-Fi 6, Bluetooth 5.2, USB-C 3.1 Gen 2 with Video Out, 4 JBL Speakers";
    } else if (brandLower.includes("xiaomi") || modelLower.includes("pad 6")) {
      os = "Xiaomi HyperOS for Pad";
      processor = "Qualcomm Snapdragon 8+ Gen 1 (4nm TSMC High Performance)";
      display = "11.0\" 2.8K 144Hz 7-speed Variable Refresh Display (100% DCI-P3, HDR10)";
      camera = "50MP Main Camera + 2MP Depth & 20MP Front Ultra-Clear Selfie";
      battery = "8600 mAh Battery with 67W Fast Charging (100% in 35 minutes)";
      connectivity = "Wi-Fi 6, Bluetooth 5.3, USB 3.2 Gen 1, Quad Stereo Speakers Dolby Atmos";
    } else if (brandLower.includes("oneplus") || modelLower.includes("oneplus pad")) {
      os = "OxygenOS 14 for Pad";
      processor = "MediaTek Dimensity 9000 (3.05GHz Cortex-X2 4nm Silicon)";
      display = "11.61\" 2.8K 144Hz 7:5 ReadFit Ratio LCD (500 nits, Dolby Vision)";
      camera = "13MP Rear Camera with 4K video + 8MP Front Camera";
      battery = "9510 mAh with 67W SUPERVOOC Charging (1 Month Standby)";
      connectivity = "Wi-Fi 6 (802.11ax), Bluetooth 5.3, Omnibearing Sound Field 4 Speakers";
    }
  }

  // 6. PCS & DESKTOP COMPUTERS
  else if (category === "PCs" || category.includes("PC") || modelLower.includes("mac studio") || modelLower.includes("optiplex") || modelLower.includes("omen") || modelLower.includes("alienware") || modelLower.includes("thinkcentre")) {
    display = "Multi-Monitor 4K/8K DisplayPort & HDMI Support";
    camera = "Dedicated Desktop Video/Audio Signal Interface";
    if (brandLower.includes("apple") || modelLower.includes("mac studio") || modelLower.includes("mac mini")) {
      os = "macOS Sonoma / Sequoia Workstation";
      if (modelLower.includes("studio")) {
        processor = "Apple M2 Max (12-core CPU, 30-core GPU, 400GB/s Memory Bandwidth)";
        camera = "Studio Quality Hardware Audio DAC & Multi-Stream ProRes Engine";
        battery = "Integrated 370W High-Efficiency Active Thermal Workstation Power Supply";
        connectivity = "4x Thunderbolt 4 (40Gbps), 10Gb Ethernet, 2x USB-A, HDMI 2.1 (8K), SDXC (UHS-II)";
      } else {
        processor = "Apple M2 Chip (8-core CPU, 10-core GPU, 16-core Neural Engine)";
        battery = "Integrated 150W Silent Power Supply with Active Low-Noise Blower";
        connectivity = "2x Thunderbolt 4 / USB 4, 2x USB-A (5Gbps), HDMI (4K60), Gigabit Ethernet, Wi-Fi 6E";
      }
    } else if (brandLower.includes("dell") || modelLower.includes("alienware") || modelLower.includes("optiplex")) {
      os = "Windows 11 Pro 64-bit";
      if (modelLower.includes("alienware")) {
        processor = "Intel Core i7-13700KF (16-Core, up to 5.4GHz) + NVIDIA GeForce RTX 4070 12GB GDDR6X";
        battery = "750W Platinum Rated Cryo-Tech Liquid Cooled Power Supply";
        connectivity = "Wi-Fi 6E Killer AX1675, 2.5GbE LAN, 5x USB 3.2 Gen 1, 2x USB-C 3.2 Gen 2x2 (20Gbps)";
      } else {
        processor = "Intel Core i7-12700 (12-Core, up to 4.9GHz vPro Desktop Processor)";
        battery = "180W Internal 85% Efficient Power Supply (Micro Form Factor)";
        connectivity = "Intel Wi-Fi 6E AX211, Gigabit Ethernet, 3x DisplayPort 1.4a, 5x USB-A 3.2 Gen 2";
      }
    } else if (brandLower.includes("hp") || modelLower.includes("omen")) {
      os = "Windows 11 Home Gaming Edition";
      processor = "Intel Core i7-13700KF (16-Core, 24-Thread) + NVIDIA GeForce RTX 4060 Ti 8GB";
      battery = "600W 80 Plus Gold Certified ATX Power Supply with RGB Lighting Controller";
      connectivity = "Realtek Wi-Fi 6 (2x2), Bluetooth 5.3, Gigabit LAN, 3x DisplayPort 1.4a, 1x HDMI 2.1";
    } else if (brandLower.includes("lenovo") || modelLower.includes("thinkcentre") || modelLower.includes("legion")) {
      os = "Windows 11 Pro Enterprise";
      processor = "Intel Core i5-13500T (14 Cores, up to 4.6GHz, 24MB Cache Intel vPro)";
      battery = "90W 89% High-Efficiency Compact Power Adapter";
      connectivity = "Intel Wi-Fi 6 AX201, Bluetooth 5.1, DisplayPort 1.4, HDMI 2.1, 4x USB-A 3.2, 1x USB-C 3.2";
    } else if (brandLower.includes("asus") || modelLower.includes("rog")) {
      os = "Windows 11 Home 64-bit";
      processor = "Intel Core i7-13700F (16-Core, up to 5.2GHz) + NVIDIA GeForce RTX 4060 8GB";
      battery = "500W 80+ Bronze Power Supply with Aura Sync RGB Chassis";
      connectivity = "Wi-Fi 6E (802.11ax), Bluetooth 5.3, Gigabit LAN, 6x USB-A, 1x USB-C, 7.1 HD Audio";
    } else if (brandLower.includes("acer") || modelLower.includes("predator")) {
      os = "Windows 11 Home Gaming";
      processor = "Intel Core i7-13700F (16-Core, 24-Threads) + NVIDIA GeForce RTX 4060 8GB GDDR6";
      battery = "500W PFC 80 Plus Gold Power Supply with FrostBlade Cooling Fans";
      connectivity = "Killer Wireless Wi-Fi 6E 1675x, Realtek 2.5GbE Ethernet, DTS:X Ultra Audio, USB 3.2";
    }
  }

  // Create unified structured array
  const allSpecs: ProductSpecItem[] = [
    { label: "Processor", value: processor, category: "Performance", iconName: "Cpu" },
    { label: "RAM Memory", value: ram, category: "Performance", iconName: "HardDrive" },
    { label: "Storage Capacity", value: storage, category: "Performance", iconName: "Database" },
    { label: "Display Screen", value: display, category: "Display", iconName: "Monitor" },
    { label: "Camera & Optics", value: camera, category: "Camera & Audio", iconName: "Camera" },
    { label: "Battery & Charging", value: battery, category: "Battery & Power", iconName: "BatteryCharging" },
    { label: "Connectivity & I/O", value: connectivity, category: "Connectivity", iconName: "Wifi" },
    { label: "Operating System", value: os, category: "Performance", iconName: "Layers" },
    { label: "Condition Grade", value: condition, category: "Guarantee", iconName: "CheckCircle2" },
    { label: "Hardware Warranty", value: warranty, category: "Guarantee", iconName: "ShieldCheck" },
    { label: "Release Year", value: `${year} Edition`, category: "Guarantee", iconName: "Calendar" },
    { label: "Device Color", value: color, category: "Display", iconName: "Palette" },
  ];

  return {
    processor,
    ram,
    storage,
    display,
    camera,
    battery,
    connectivity,
    condition,
    warranty,
    modelYear: year,
    os,
    allSpecs,
  };
}
