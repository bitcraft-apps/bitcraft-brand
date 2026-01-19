#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
LOGO_DIR="$REPO_ROOT/logo"
EXPORT_DIR="$LOGO_DIR/exports"
PNG_DIR="$EXPORT_DIR/png"
FAVICON_DIR="$EXPORT_DIR/favicon"

# Source SVGs
LOGO_SVG="$LOGO_DIR/bitcraft-logo.svg"
LOGO_PADDED_SVG="$LOGO_DIR/bitcraft-logo-padded.svg"

# Export sizes
PNG_SIZES=(64 128 256 512 1024)
FAVICON_SIZES=(16 32 48)

usage() {
    echo "Usage: $0 [--all|--logos|--favicons]"
    echo ""
    echo "Options:"
    echo "  --all       Export all assets (logos + favicons)"
    echo "  --logos     Export logo PNGs at sizes: ${PNG_SIZES[*]}"
    echo "  --favicons  Export favicon.ico from sizes: ${FAVICON_SIZES[*]}"
    echo ""
    echo "Requirements:"
    echo "  - Inkscape (for SVG to PNG conversion)"
    echo "  - ImageMagick (for favicon.ico bundling)"
    exit 1
}

check_inkscape() {
    if ! command -v inkscape &> /dev/null; then
        echo "Error: Inkscape is not installed."
        echo ""
        echo "Install Inkscape:"
        echo "  macOS:  brew install --cask inkscape"
        echo "  Ubuntu: sudo apt install inkscape"
        echo "  Fedora: sudo dnf install inkscape"
        exit 1
    fi
}

check_imagemagick() {
    if ! command -v convert &> /dev/null; then
        echo "Error: ImageMagick is not installed."
        echo ""
        echo "Install ImageMagick:"
        echo "  macOS:  brew install imagemagick"
        echo "  Ubuntu: sudo apt install imagemagick"
        echo "  Fedora: sudo dnf install imagemagick"
        exit 1
    fi
}

optimize_png() {
    local file="$1"
    if command -v pngquant &> /dev/null; then
        pngquant --force --output "$file" "$file" 2>/dev/null || true
    elif command -v optipng &> /dev/null; then
        optipng -quiet "$file" 2>/dev/null || true
    fi
}

export_logos() {
    check_inkscape

    echo "Exporting logo PNGs..."
    mkdir -p "$PNG_DIR"

    for size in "${PNG_SIZES[@]}"; do
        local output="$PNG_DIR/logo-${size}.png"
        echo "  → logo-${size}.png"
        inkscape "$LOGO_PADDED_SVG" \
            --export-type=png \
            --export-filename="$output" \
            --export-width="$size" \
            --export-height="$size" \
            2>/dev/null
        optimize_png "$output"
    done

    echo "Logo PNGs exported to: $PNG_DIR"
}

export_favicons() {
    check_inkscape
    check_imagemagick

    echo "Exporting favicons..."
    mkdir -p "$FAVICON_DIR"

    local favicon_pngs=()

    for size in "${FAVICON_SIZES[@]}"; do
        local output="$FAVICON_DIR/favicon-${size}.png"
        echo "  → favicon-${size}.png"
        inkscape "$LOGO_PADDED_SVG" \
            --export-type=png \
            --export-filename="$output" \
            --export-width="$size" \
            --export-height="$size" \
            2>/dev/null
        optimize_png "$output"
        favicon_pngs+=("$output")
    done

    echo "  → favicon.ico"
    convert "${favicon_pngs[@]}" "$FAVICON_DIR/favicon.ico"

    echo "Favicons exported to: $FAVICON_DIR"
}

# Parse arguments
if [[ $# -eq 0 ]]; then
    usage
fi

case "$1" in
    --all)
        export_logos
        echo ""
        export_favicons
        ;;
    --logos)
        export_logos
        ;;
    --favicons)
        export_favicons
        ;;
    *)
        usage
        ;;
esac

echo ""
echo "Done!"
