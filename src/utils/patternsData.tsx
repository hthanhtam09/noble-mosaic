export const patterns = [
    {
        id: "square",
        name: "Square",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Inner Grid with rounded corners */}
                <rect x="15" y="15" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />
                <rect x="38.33" y="15" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />
                <rect x="61.66" y="15" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />

                <rect x="15" y="38.33" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />
                <rect x="38.33" y="38.33" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />
                <rect x="61.66" y="38.33" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />

                <rect x="15" y="61.66" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />
                <rect x="38.33" y="61.66" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />
                <rect x="61.66" y="61.66" width="23.33" height="23.33" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />


                {/* Outline */}
                <rect x="15" y="15" width="70" height="70" stroke="currentColor" strokeWidth="2.5" />
            </svg>
        ),
    },
    {
        id: "dot",
        name: "Dot",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <pattern id="dot-grid" width="40" height="69.282" patternUnits="userSpaceOnUse" patternTransform="translate(10, 15.359)">
                        <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="40" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="20" cy="34.641" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="69.282" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="40" cy="69.282" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <clipPath id="dot-clip-2">
                        <circle cx="50" cy="50" r="38" />
                    </clipPath>
                </defs>
                <g clipPath="url(#dot-clip-2)">
                    <rect x="0" y="0" width="100" height="100" fill="url(#dot-grid)" />
                </g>
                {/* Outline */}
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2.5" />
            </svg>
        ),
    },
    {
        id: "diamond",
        name: "Diamond",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="diamond-clip-2">
                        <polygon points="50,12 88,50 50,88 12,50" />
                    </clipPath>
                    <pattern id="diamond-grid" width="28.28" height="28.28" patternUnits="userSpaceOnUse" patternTransform="rotate(45) translate(3, 3)">
                        <rect x="0" y="0" width="28.28" height="28.28" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2" fill="currentColor" />
                        <circle cx="28.28" cy="0" r="2" fill="currentColor" />
                        <circle cx="0" cy="28.28" r="2" fill="currentColor" />
                        <circle cx="28.28" cy="28.28" r="2" fill="currentColor" />
                    </pattern>
                </defs>
                {/* Grid Background */}
                <polygon points="50,12 88,50 50,88 12,50" fill="url(#diamond-grid)" />

                {/* Texts */}


                {/* Outline */}
                <polygon points="50,10 90,50 50,90 10,50" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
        ),
    },
    {
        id: "hexagon",
        name: "Hexagon",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="hex-clip-2">
                        <polygon points="50,12 82.64,31 82.64,69 50,88 17.36,69 17.36,31" />
                    </clipPath>
                </defs>
                <g clipPath="url(#hex-clip-2)">
                    {/* Center Hexagon */}
                    <polygon points="50,38 64,46 64,62 50,70 36,62 36,46" fill="none" stroke="currentColor" strokeWidth="1" />

                    {/* Top Left */}
                    <polygon points="36,14 50,22 50,38 36,46 22,38 22,22" fill="none" stroke="currentColor" strokeWidth="1" />

                    {/* Top Right */}
                    <polygon points="64,14 78,22 78,38 64,46 50,38 50,22" fill="none" stroke="currentColor" strokeWidth="1" />

                    {/* Bottom Left */}
                    <polygon points="36,62 50,70 50,86 36,94 22,86 22,70" fill="none" stroke="currentColor" strokeWidth="1" />

                    {/* Bottom Right */}
                    <polygon points="64,62 78,70 78,86 64,94 50,86 50,70" fill="none" stroke="currentColor" strokeWidth="1" />

                    {/* Far Left Mid */}
                    <polygon points="22,38 36,46 36,62 22,70 8,62 8,46" fill="none" stroke="currentColor" strokeWidth="1" />

                    {/* Far Right Mid */}
                    <polygon points="78,38 92,46 92,62 78,70 64,62 64,46" fill="none" stroke="currentColor" strokeWidth="1" />
                </g>
                {/* Outline */}
                <polygon points="50,10 84.64,30 84.64,70 50,90 15.36,70 15.36,30" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
        ),
    },
    {
        id: "puzzle",
        name: "Jigsaw",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Puzzle Inner Lines */}
                {/* Vertical 1 */}
                <path d="M 38.33 15 L 38.33 26 A 4 4 0 1 1 38.33 34 L 38.33 51 A 4 4 0 1 0 38.33 59 L 38.33 85" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Vertical 2 */}
                <path d="M 61.66 15 L 61.66 28 A 4 4 0 1 0 61.66 36 L 61.66 54 A 4 4 0 1 1 61.66 62 L 61.66 85" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Horizontal 1 */}
                <path d="M 15 38.33 L 26 38.33 A 4 4 0 1 0 34 38.33 L 47 38.33 A 4 4 0 1 1 55 38.33 L 85 38.33" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Horizontal 2 */}
                <path d="M 15 61.66 L 31 61.66 A 4 4 0 1 1 39 61.66 L 51 61.66 A 4 4 0 1 0 59 61.66 L 85 61.66" fill="none" stroke="currentColor" strokeWidth="1" />


                {/* Outline */}
                <rect x="15" y="15" width="70" height="70" stroke="currentColor" strokeWidth="2.5" />
            </svg>
        ),
    },
    {
        id: "islamic",
        name: "Islamic Geometric",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <path id="islamic-star-path" d="M 0 -14.142 L 4.142 -10 L 10 -10 L 10 -4.142 L 14.142 0 L 10 4.142 L 10 10 L 4.142 10 L 0 14.142 L -4.142 10 L -10 10 L -10 4.142 L -14.142 0 L -10 -4.142 L -10 -10 L -4.142 -10 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                    <pattern id="islamic-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="translate(10, 10)">
                        <use href="#islamic-star-path" />
                        <use href="#islamic-star-path" x="40" />
                        <use href="#islamic-star-path" y="40" />
                        <use href="#islamic-star-path" x="40" y="40" />
                        <use href="#islamic-star-path" x="20" y="20" />
                    </pattern>
                    <clipPath id="islamic-clip-2">
                        <path d="M 50 10 L 64.14 24.14 L 75.86 24.14 L 75.86 35.86 L 90 50 L 75.86 64.14 L 75.86 75.86 L 64.14 75.86 L 50 90 L 35.86 75.86 L 24.14 75.86 L 24.14 64.14 L 10 50 L 24.14 35.86 L 24.14 24.14 L 35.86 24.14 Z" />
                    </clipPath>
                </defs>

                {/* Content */}
                <g clipPath="url(#islamic-clip-2)">
                    <rect x="0" y="0" width="100" height="100" fill="url(#islamic-grid)" />
                </g>

                {/* Outline */}
                <path d="M 50 10 L 64.14 24.14 L 75.86 24.14 L 75.86 35.86 L 90 50 L 75.86 64.14 L 75.86 75.86 L 64.14 75.86 L 50 90 L 35.86 75.86 L 24.14 75.86 L 24.14 64.14 L 10 50 L 24.14 35.86 L 24.14 24.14 L 35.86 24.14 Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
        ),
    },
    {
        id: "fish-scale",
        name: "Fish Scale",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <pattern id="scale-grid" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="translate(0, 0) scale(1)">
                        {/* Top Row Scales */}
                        <path d="M 0 14 A 14 14 0 0 1 28 14" fill="none" stroke="currentColor" strokeWidth="1" />
                        {/* Bottom Row Scales (Shifted) */}
                        <path d="M -14 28 A 14 14 0 0 1 14 28" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M 14 28 A 14 14 0 0 1 42 28" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <clipPath id="scale-clip-2">
                        <circle cx="50" cy="50" r="38" />
                    </clipPath>
                </defs>

                {/* Content */}
                <g clipPath="url(#scale-clip-2)">
                    <rect x="0" y="0" width="100" height="100" fill="url(#scale-grid)" />
                </g>

                {/* Outline */}
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2.5" />
            </svg>
        ),
    },
    {
        id: "trapezoid",
        name: "Trapezoid",
        svg: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="skew-clip">
                        <polygon points="17,26 83,17 83,73 17,83" />
                    </clipPath>
                </defs>
                {/* Outline */}
                <polygon points="15,25 85,15 85,75 15,85" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.5" />
                {/* Content */}
                <g clipPath="url(#skew-clip)">
                    {/* Zigzag Verticals */}
                    <path d="M 38 21 L 38 80 M 61 19 L 61 77" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="1" />
                    {/* Zigzag Horizontals */}
                    <path d="M 17 48 L 38 41 L 61 44 L 83 37" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1" strokeOpacity="1" />
                    <path d="M 17 68 L 38 61 L 61 64 L 83 57" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1" strokeOpacity="1" />
                </g>
            </svg>
        ),
    },
];
