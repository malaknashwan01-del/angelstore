import type { SkinTone } from "../data/tryOn";

interface FaceModelProps {
  tone: SkinTone;
  lips?: string;
  cheeks?: string;
  glossy?: boolean;
}

// وجه مرسوم بـ SVG — الشفايف والخدود بيتلونوا حسب المنتج المختار
export default function FaceModel({ tone, lips, cheeks, glossy = false }: FaceModelProps) {
  return (
    <svg viewBox="0 30 300 330" role="img" aria-label="Makeup preview" className="h-full w-full">
      <defs>
        <radialGradient id="blush">
          <stop offset="0%" stopColor={cheeks ?? "transparent"} stopOpacity=".75" />
          <stop offset="100%" stopColor={cheeks ?? "transparent"} stopOpacity="0" />
        </radialGradient>
        <clipPath id="frame">
          <circle cx="150" cy="205" r="150" />
        </clipPath>
      </defs>

      <g clipPath="url(#frame)">
        <circle cx="150" cy="205" r="150" fill="#ffe8ef" />

        {/* الشعر من ورا */}
        <path d="M58 200 C40 90 100 52 150 52 C210 52 262 92 244 210 C240 260 262 300 270 360 H30 C40 300 62 262 58 200 Z" fill={tone.hair} />

        {/* الرقبة والكتاف */}
        <path d="M122 270 H178 V318 C178 318 165 330 150 330 C135 330 122 318 122 318 Z" fill={tone.shade} />
        <path d="M40 360 C50 322 90 310 122 304 C135 318 165 318 178 304 C210 310 250 322 260 360 Z" fill="#f7b6cb" />

        {/* الوجه */}
        <ellipse cx="150" cy="185" rx="84" ry="104" fill={tone.skin} />
        <ellipse cx="66" cy="196" rx="10" ry="18" fill={tone.skin} />
        <ellipse cx="234" cy="196" rx="10" ry="18" fill={tone.skin} />

        {/* البلاشر */}
        <ellipse cx="104" cy="226" rx="30" ry="20" fill="url(#blush)" />
        <ellipse cx="196" cy="226" rx="30" ry="20" fill="url(#blush)" />

        {/* الحواجب */}
        <path d="M96 160 Q116 148 136 158" stroke={tone.hair} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M164 158 Q184 148 204 160" stroke={tone.hair} strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* العيون مغمضة */}
        <path d="M100 188 Q117 200 134 188" stroke="#2b1a22" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M166 188 Q183 200 200 188" stroke="#2b1a22" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M104 193 l-5 5 M112 196 l-3 6 M121 196 l-1 6 M130 193 l3 5" stroke="#2b1a22" strokeWidth="2" strokeLinecap="round" />
        <path d="M196 193 l5 5 M188 196 l3 6 M179 196 l1 6 M170 193 l-3 5" stroke="#2b1a22" strokeWidth="2" strokeLinecap="round" />

        {/* الأنف */}
        <path d="M150 196 Q146 214 142 222 Q150 228 158 222" stroke={tone.shade} strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* الشفايف */}
        <g style={{ transition: "fill .3s" }}>
          <path d="M120 250 C130 240 141 236 150 243 C159 236 170 240 180 250 C168 252 159 253 150 253 C141 253 132 252 120 250 Z" fill={lips ?? tone.lip} />
          <path d="M120 250 C132 254 141 255 150 255 C159 255 168 254 180 250 C174 265 163 273 150 273 C137 273 126 265 120 250 Z" fill={lips ?? tone.lip} />
          <path d="M122 250 C134 253 142 254 150 254 C158 254 166 253 178 250" stroke="#000" strokeOpacity=".25" strokeWidth="1.5" fill="none" />
          {glossy && lips && (
            <ellipse cx="146" cy="263" rx="12" ry="3.5" fill="#fff" opacity=".55" />
          )}
        </g>

        {/* الغرة */}
        <path d="M66 170 C64 100 110 66 158 70 C206 72 236 104 236 160 C220 120 190 100 152 104 C120 108 92 128 66 170 Z" fill={tone.hair} />
      </g>
    </svg>
  );
}
