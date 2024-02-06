type MaterialSymbolProps = {
    name: string;
    style?: "outlined" | "rounded" | "sharp";
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
    fill?: boolean;
    grade?: -25 | 0 | 200;
    opticalSize?: 20 | 24 | 40 | 48;
    className?: string;
};

function PlaceholderIcon() {
    return (
        // Question mark icon
        <svg height="24" width="24" viewBox="0 -960 960 960">
            <path
                fill="currentColor"
                d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"
            />
        </svg>
    );
}

export default async function MaterialSymbol({
    name,
    style = "outlined", // change default style
    className = "fill-current", // suites your theme by default
    fill,
    weight = 400,
    grade = 0,
    opticalSize = 24,
}: MaterialSymbolProps) {
    let properties = "";

    if (weight == 400 && grade == 0 && !fill) {
        properties = "default";
    } else {
        if (weight && weight != 400) properties += "wght" + weight;
        if (grade) properties += "grad" + grade.toString().replace("-", "N");
        if (fill) properties += "fill1";
    }

    const src = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbols${style}/${name}/${properties}/${opticalSize}px.svg`;

    const response = await fetch(src);
    if (response.ok && response.status >= 200 && response.status < 300) {
        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{
                    __html: await response.text(),
                }}
            />
        );
    }

    console.error(
        `(!) Couldn't find MaterialSymbol: ${name}\n    └─ Queried url: ${src}`
    );

    return <PlaceholderIcon />;
}
