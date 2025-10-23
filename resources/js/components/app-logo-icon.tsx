import React from 'react';
import { SVGProps } from 'react';

// Lucide-style app logo icon (stroke-based) compatible with lucide-react props
export default function AppLogoIcon(props: SVGProps<SVGSVGElement>) {
    const { width = 20, height = 20, stroke = 'currentColor', strokeWidth = 1.5, ...rest } = props;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...rest}
        >
            {/* Outer diamond */}
            <polygon points="12 2 4 8 12 14 20 8 12 2" />
        </svg>
    );
}
