import typography from "@tailwindcss/typography";
declare const _default: {
    content: string[];
    darkMode: "class";
    theme: {
        extend: {
            fontFamily: {
                display: [string, string];
                body: [string, string];
            };
            colors: {
                night: string;
                mist: string;
                cyan: string;
                coral: string;
                sand: string;
            };
            boxShadow: {
                glow: string;
            };
            backgroundImage: {
                "hero-mesh": string;
            };
            keyframes: {
                float: {
                    "0%, 100%": {
                        transform: string;
                    };
                    "50%": {
                        transform: string;
                    };
                };
            };
            animation: {
                float: string;
            };
        };
    };
    plugins: (typeof typography)[];
};
export default _default;
