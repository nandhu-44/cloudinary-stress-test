import os
from PIL import Image
import random

def create_image(target_size_bytes):
    # Start with a base size
    width, height = 100, 100
    quality = 85
    while True:
        img = Image.new('RGB', (width, height))
        # Fill with random pixels for a more realistic image
        pixels = []
        for _ in range(width * height):
            pixels.append((random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)))
        img.putdata(pixels)
        
        # Save temporarily to check size
        img.save('temp.jpg', 'JPEG', quality=quality)
        size = os.path.getsize('temp.jpg')
        
        if size >= target_size_bytes:
            if abs(size - target_size_bytes) / target_size_bytes < 0.1:  # within 10%
                break
            else:
                # Try reducing quality first
                if quality > 10:
                    quality -= 5
                else:
                    # Increase dimensions if quality is too low
                    width = int(width * 1.1)
                    height = int(height * 1.1)
                    quality = 85  # reset quality
        else:
            # Increase dimensions
            width = int(width * 1.2)
            height = int(height * 1.2)
    
    # Save the final image
    filename = f"images/image_{target_size_bytes}bytes.jpg"
    img.save(filename, 'JPEG', quality=quality)
    if os.path.exists('temp.jpg'):
        os.remove('temp.jpg')
    return filename

if __name__ == "__main__":
    size_input = input("Enter image size (e.g., 500kb, 1mb, 2mb, 5mb, 10mb): ").strip().lower()
    if 'kb' in size_input:
        num = float(size_input.replace('kb', ''))
        target = num * 1024
    elif 'mb' in size_input:
        num = float(size_input.replace('mb', ''))
        target = num * 1024 * 1024
    else:
        print("Invalid format. Please use kb or mb.")
        exit(1)
    
    target = int(target)
    filename = create_image(target)
    print(f"Image created: {filename}")
