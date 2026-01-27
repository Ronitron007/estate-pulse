#!/bin/bash

# Download sample real estate images for Tricity seed data
# Images from Unsplash (free to use)

BASE_DIR="$(dirname "$0")/seed-images/tricity"
mkdir -p "$BASE_DIR"

# Function to download image
download_image() {
    local slug=$1
    local uuid=$2
    local url=$3

    local dir="$BASE_DIR/$slug"
    mkdir -p "$dir"

    local file="$dir/img-$uuid-original.jpg"

    if [ -f "$file" ]; then
        echo "Skipping $file (already exists)"
        return
    fi

    echo "Downloading $file..."
    curl -L -s -o "$file" "$url"

    if [ $? -eq 0 ]; then
        echo "  Downloaded: $file"
    else
        echo "  FAILED: $file"
    fi
}

# Unsplash URLs for different property types
# Using direct download URLs (1920x1080 resolution)

echo "=== Downloading Tricity Property Images ==="
echo ""

# DLF Hyde Park (plotted development)
echo "1. DLF Hyde Park..."
download_image "dlf-hyde-park" "a1b2c3d4" "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop"
download_image "dlf-hyde-park" "e5f6g7h8" "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop"

# Sushma Crescent
echo "2. Sushma Crescent..."
download_image "sushma-crescent" "i9j0k1l2" "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1080&fit=crop"
download_image "sushma-crescent" "m3n4o5p6" "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"

# Omaxe The Resort (luxury villas)
echo "3. Omaxe The Resort..."
download_image "omaxe-the-resort" "q7r8s9t0" "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop"
download_image "omaxe-the-resort" "u1v2w3x4" "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&h=1080&fit=crop"

# Motiaz Royal Citi
echo "4. Motiaz Royal Citi..."
download_image "motiaz-royal-citi" "y5z6a7b8" "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop"

# Janta Enclave
echo "5. Janta Enclave..."
download_image "janta-enclave-kharar" "c9d0e1f2" "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&h=1080&fit=crop"

# Sushma Joynest
echo "6. Sushma Joynest..."
download_image "sushma-joynest" "g3h4i5j6" "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1920&h=1080&fit=crop"
download_image "sushma-joynest" "k7l8m9n0" "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&h=1080&fit=crop"

# Emaar Palm Heights
echo "7. Emaar Palm Heights..."
download_image "emaar-palm-heights" "o1p2q3r4" "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1920&h=1080&fit=crop"
download_image "emaar-palm-heights" "s5t6u7v8" "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&h=1080&fit=crop"

# Omaxe Celestia Royal
echo "8. Omaxe Celestia Royal..."
download_image "omaxe-celestia-royal" "w9x0y1z2" "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=1920&h=1080&fit=crop"

# DLF Garden City Panchkula
echo "9. DLF Garden City Panchkula..."
download_image "dlf-garden-city-panchkula" "a3b4c5d6" "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&h=1080&fit=crop"
download_image "dlf-garden-city-panchkula" "e7f8g9h0" "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&h=1080&fit=crop"

# Ambuja Utalika
echo "10. Ambuja Utalika..."
download_image "ambuja-utalika" "i1j2k3l4" "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1920&h=1080&fit=crop"

# Omaxe Shivalik Homes
echo "11. Omaxe Shivalik Homes..."
download_image "omaxe-shivalik-homes" "m5n6o7p8" "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&h=1080&fit=crop"

# Emaar Digi Homes
echo "12. Emaar Digi Homes..."
download_image "emaar-digi-homes" "q9r0s1t2" "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1920&h=1080&fit=crop"
download_image "emaar-digi-homes" "u3v4w5x6" "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop"

# Sushma Valencia
echo "13. Sushma Valencia..."
download_image "sushma-valencia" "y7z8a9b0" "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&h=1080&fit=crop"
download_image "sushma-valencia" "c1d2e3f4" "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&h=1080&fit=crop"

# Janta Sky Gardens
echo "14. Janta Sky Gardens..."
download_image "janta-sky-gardens" "g5h6i7j8" "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=1080&fit=crop"

# Motiaz Splendour
echo "15. Motiaz Splendour..."
download_image "motiaz-splendour" "k9l0m1n2" "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1920&h=1080&fit=crop"
download_image "motiaz-splendour" "o3p4q5r6" "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920&h=1080&fit=crop"

echo ""
echo "=== Download Complete ==="
echo ""
echo "Images saved to: $BASE_DIR"
echo ""
echo "Total directories: $(find "$BASE_DIR" -type d | wc -l | tr -d ' ')"
echo "Total images: $(find "$BASE_DIR" -name "*.jpg" | wc -l | tr -d ' ')"
