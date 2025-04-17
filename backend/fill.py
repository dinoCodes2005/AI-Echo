import os
import django
import random
from django.core.files import File
from chatapp.models import ChatRoom  # Adjust this based on your app name

# Set the settings module to your Django project's settings file
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'  # Replace 'backend.settings' with the actual path to your settings module

# Initialize Django
django.setup()

# Path where images are stored
image_folder = 'media/room_images/'  # Ensure this folder contains multiple images

# Get all available images in the folder (including .avif)
image_files = [f for f in os.listdir(image_folder) if f.endswith(('.png', '.jpg', '.jpeg', '.avif'))]

if not image_files:
    print("No images found in the directory!")
else:
    # Creating 10-15 rooms
    room_names = [
        "Room 1", "Room 2", "Room 3", "Room 4", "Room 5",
        "Room 6", "Room 7", "Room 8", "Room 9", "Room 10",
        "Room 11", "Room 12", "Room 13", "Room 14", "Room 15"
    ]

    for room_name in room_names:
        # Create room
        room = ChatRoom.objects.create(
            name=room_name,
            slug=room_name.lower().replace(" ", "-"),
        )

        # Assign random image to room
        random_image = random.choice(image_files)  # Select a random image
        image_path = os.path.join(image_folder, random_image)

        with open(image_path, 'rb') as img_file:
            room.image.save(random_image, File(img_file), save=True)

    print("Rooms created and images assigned successfully!")
